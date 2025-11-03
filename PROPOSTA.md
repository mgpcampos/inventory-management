### 1) Escopo e MVP

- **Papéis:** admin, gerente, balconista.
- **Entidades Centrais:** usuários, categorias, produtos, fornecedores, armazéns, movimentações_de_estoque.
- **Entidades Opcionais** (se você quiser mais realismo): pedidos_de_compra (+ itens), pedidos_de_venda (+ itens), clientes, saldos_de_estoque (snapshot por produto/armazém).
- **Fluxos MVP:**
  - Cadastro/login, acesso baseado em papéis.
  - CRUD para produtos, categorias, fornecedores, armazéns.
  - Registrar movimentações de estoque: ENTRADA (compra, ajuste), SAÍDA (venda, ajuste), TRANSFERÊNCIA (dois movimentos: saída de A, entrada em B).
  - Consultas: estoque atual por armazém, alertas de estoque baixo, lista de produtos com fornecedor/categoria.

### 2) Modelo de Banco de Dados (SQLite)

- **users:** id, name, email (único), password_hash, role, created_at.
- **categories:** id, name.
- **suppliers:** id, name, email, phone.
- **warehouses:** id, name, location.
- **products:** id, name, sku (único), category_id FK, supplier_id FK, unit_price, reorder_level, active.
- **stock_movements:** id, product_id FK, warehouse_id FK, user_id FK, type[IN, OUT, TRANSFER_IN, TRANSFER_OUT, ADJUST], qty, unit_cost, note, created_at.
- **Opcional:**
  - **purchase_orders:** id, supplier_id FK, status[rascunho, recebido, cancelado], created_by FK, created_at.
  - **purchase_order_items:** id, purchase_order_id FK, product_id FK, qty, unit_cost.
  - **sales_orders:** id, customer_id FK, status[rascunho, atendido, cancelado], created_by FK.
  - **sales_order_items:** id, sales_order_id FK, product_id FK, qty, unit_price.
  - **stock_balances:** product_id FK, warehouse_id FK, qty (mantido para consultas rápidas).
- **Políticas de Chave Estrangeira (FK):**
  - products.category_id e products.supplier_id: ON DELETE RESTRICT (você deve mover os produtos antes de excluir uma categoria/fornecedor).
  - stock_movements FKs: ON DELETE RESTRICT (não perca o histórico).
  - warehouses e stock_balances: você pode usar ON DELETE CASCADE para stock_balances, de modo que a exclusão de um armazém limpe seus saldos.
  - itens de pedido: ON DELETE CASCADE para seus pedidos pai; pedidos pai: ON DELETE RESTRICT se já recebidos/atendidos.

### 3) Mapeamento CRUD para os Requisitos

- **Criar (pelo menos 3):**
  - Criar produto (com categoria e fornecedor).
  - Criar armazém.
  - Criar fornecedor.
  - Criar movimentação de estoque (ENTRADA/SAÍDA/TRANSFERÊNCIA).
- **Atualizar (pelo menos 3, um envolvendo relacionamentos):**
  - Editar produto e alterar sua categoria ou fornecedor (atualiza FKs).
  - Editar uma nota ou tipo-razão de movimentação de estoque; para TRANSFERÊNCIA, permitir a edição do armazém de destino (relacionamento).
  - Atualizar detalhes do fornecedor.
  - Opcional: Alterar o status de um pedido de compra de rascunho para recebido (isso aciona movimentações de estoque) — atualização relacional forte.
- **Ler (pelo menos 3, pelo menos 2 com JOIN):**
  - Lista de produtos com nomes de categoria e fornecedor (JOIN products + categories + suppliers).
  - Estoque atual por produto por armazém (JOIN stock_movements + products + warehouses; agregar SUM de ENTRADA/SAÍDA).
  - Log de atividade do usuário: movimentações recentes com produto e armazém (JOIN movements + users + products + warehouses).
  - Opcional: Relatório de estoque baixo (agregar e filtrar por reorder_level).
- **Excluir (pelo menos 3, pelo menos 1 afetando dados relacionados a FK):**
  - Excluir fornecedor (permitido apenas se nenhum produto o referenciar; caso contrário, bloquear). Se você tiver uma tabela pivô, cascatear a remoção das linhas pivô.
  - Excluir armazém (exclusão em cascata de saldos de estoque para esse armazém; bloquear se existirem movimentações, a menos que você permita o arquivamento).
  - Excluir produto (bloquear se referenciado por movimentações ou itens de pedido; caso contrário, excluir).
  - Opcional: Excluir pedido de compra (cascateia itens; se já recebido, bloquear).

### 4) Regras de Negócio e Transações

- Ao registrar uma **TRANSFERÊNCIA**, crie dois registros de movimentação em uma única transação de banco de dados: SAÍDA da origem e ENTRADA no destino.
- Se você implementar pedidos_de_compra e pedidos_de_venda:
  - Receber um pedido de compra gera movimentações de ENTRADA para cada item; envolva em uma transação.
  - Atender um pedido de venda gera movimentações de SAÍDA para cada item; envolva em uma transação.
- **Saldos de estoque opcionais:**
  - Ou calcule o estoque em tempo real a partir de movimentações_de_estoque usando `SUM(CASE WHEN type in (IN, TRANSFER_IN) THEN qty ELSE -qty END)`.
  - Ou mantenha a tabela `stock_balances` e atualize-a dentro da mesma transação sempre que inserir movimentações.

### 5) Autenticação e Segurança

- **Registro:** hash de senhas com **bcrypt**.
- **Login:** **express-session** com um armazenamento de sessão (e.g., `connect-sqlite3` para SQLite). Armazene apenas o ID do usuário e o papel na sessão.
- **Middlewares:**
  - `isAuthenticated`: protege todas as rotas de inventário.
  - `hasRole([admin, gerente])` para ações sensíveis (excluir, receber pedidos).
  - Token CSRF para formulários (`csurf`) se desejado.
  - Validação de entrada com `express-validator`; sanitize strings.
- Política de senha e tratamento de erros: mensagens flash amigáveis em caso de falhas.

### 6) Estrutura MVC e Roteamento RESTful

- **Pastas:**
  - `src/config` (env, conexão DB), `src/models` (consultas/DAOs), `src/controllers`, `src/routes`, `src/views` (**EJS**), `src/middlewares`, `src/services` (lógica de negócio), `public` (CSS/JS).
- **Exemplos de Rotas RESTful:**
  - Produtos: `GET /products`, `GET /products/new`, `POST /products`, `GET /products/:id`, `GET /products/:id/edit`, `PUT /products/:id`, `DELETE /products/:id`.
  - Fornecedores, Armazéns: mesmo padrão.
  - Movimentações: `GET /movements`, `GET /movements/new`, `POST /movements`.
  - Relatórios: `GET /reports/stock`, `GET /reports/low-stock`.
- Use `method-override` para suportar PUT/DELETE em formulários **EJS**.

### 7) Frontend EJS e UX

- **Parciais:** cabeçalho, barra de navegação (links por papel), rodapé, mensagens flash.
- **Layout:** grid Bootstrap de 12 colunas; tabelas e formulários responsivos; ícones via Bootstrap Icons.
- **Páginas:**
  - Dashboard com estatísticas rápidas (total de produtos, valor de estoque, contagem de estoque baixo).
  - Listagem de produtos com filtros por categoria/fornecedor; formulários de criação/edição.
  - Formulário de movimentação com autocompletar de produto, seletor de tipo, seletor de armazém; ações de cópia claras para transferência.
  - Páginas de relatórios: estoque por armazém, cartões de estoque baixo, log de atividade.
- Mantenha os formulários simples, com feedback de validação; use espaçamento e paleta de cores consistentes.

### 8) Exemplos SQL para JOIN/Agregação (Conceitual)

- **Produtos com categoria e fornecedor:** `SELECT p.id, p.name, c.name AS category, s.name AS supplier FROM products p JOIN categories c ON c.id = p.category_id JOIN suppliers s ON s.id = p.supplier_id`.
- **Estoque atual:** `SELECT m.product_id, m.warehouse_id, SUM(CASE WHEN m.type IN ('IN','TRANSFER_IN','ADJUST_IN') THEN m.qty ELSE -m.qty END) AS qty FROM stock_movements m GROUP BY m.product_id, m.warehouse_id`.
- **Log de atividade:** `SELECT m.id, u.name AS user, p.name AS product, w.name AS warehouse, m.type, m.qty, m.created_at FROM stock_movements m JOIN users u ON u.id = m.user_id JOIN products p ON p.id = m.product_id JOIN warehouses w ON w.id = m.warehouse_id ORDER BY m.created_at DESC`.

### 9) Exclusões e Demonstrações de FK

- **Exclusão de Fornecedor:** verifique se `EXISTS products WHERE supplier_id = ?`; se sim, bloqueie e solicite a reatribuição; caso contrário, exclua o fornecedor.
- **Exclusão de Armazém:** permita apenas se não houver `stock_movements` referenciando-o; se você mantiver `stock_balances`, `ON DELETE CASCADE` prova a exclusão relacionada a FK.
- **Exclusão de Produto:** bloqueie se existirem movimentações ou itens de pedido; mostre onde ele está sendo usado.

### 10) Pilha de Tecnologia e Configuração

- **Front end:** **HTML + CSS + JavaScript + EJS**
- **Back end:** **Node.js + Express.js**
- **Banco de Dados:** **SQLite**
- **Autenticação:** **express-session + bcrypt**
- **Controle de Versão:** **Git + GitHub**
- **Dependências:** `express`, `sqlite3` (ou um wrapper como `better-sqlite3`), `express-session`, `connect-sqlite3` (para armazenamento de sessão), `bcrypt`, `dotenv`, `method-override`, `express-validator`.
- **Opcional ORM/Migrações:** Knex.js para migrações e seeds.
- **Ferramentas de Desenvolvimento:** nodemon, ESLint/Prettier.
- **README:** descrição do projeto, equipe, etapas de instalação/execução, variáveis de ambiente, diagrama do esquema do banco de dados, papéis de usuário, capturas de tela.