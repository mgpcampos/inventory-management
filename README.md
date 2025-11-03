> [!NOTE]
> Este documento encontra-se em contínua elaboração e poderá sofrer alterações futuras.

# Sistema Genérico de Gerenciamento de Inventário

Este repositório hospeda o código-fonte da aplicação desenvolvida para o projeto final da disciplina de **Desenvolvimento de Aplicações Web**.

### Membros do Grupo

| Nome Completo | Prontuário |
| :--- | :--- |
| Mateus G. P. Campos | JC3019705 |
| Kevin L. R. de Candia | JC3018784 |
| Ray G. dos S. Martins | JC3019543 |
| Kauê M. de Araujo | JC3019497 |

---

## Descrição do Projeto

O **Sistema Genérico de Gerenciamento de Inventário** é uma aplicação web completa, desenvolvida para demonstrar o emprego de conceitos apurados ao decorrer do ano na disciplina de Desenvolvimento de Aplicações Web.

O sistema permite o gerenciamento de:
*   **Entidades Centrais:** Usuários, Categorias, Produtos, Fornecedores e Armazéns.
*   **Movimentações de Estoque:** Registro de entradas (compras, ajustes), saídas (vendas, ajustes) e transferências entre armazéns, garantindo a integridade dos dados através de transações.
*   **Controle de Acesso:** Autenticação baseada em papéis (`admin`, `gerente`, `balconista`) para proteger rotas e funcionalidades sensíveis.
*   **Relatórios:** Geração de consultas complexas com JOINs e agregações para visualização do estoque atual e alertas de estoque baixo.

Este projeto segue o blueprint detalhado na `PROPOSTA.md`, focando em um conjunto robusto de operações CRUD e regras de negócio para simular um ambiente de inventário real.

---

## Pilha de Tecnologia

A aplicação foi construída utilizando a seguinte pilha de tecnologias, conforme os requisitos do projeto:

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Front end** | EJS + Bootstrap + JavaScript | Engine de template para renderização dinâmica, com Bootstrap para design responsivo e JavaScript para interatividade. |
| **Back end** | Node.js + Express.js | Ambiente de execução e framework web minimalista para o servidor. |
| **Banco de Dados** | SQLite3 + Sequelize | Banco de dados leve e baseado em arquivo, com Sequelize como ORM para modelagem e operações de banco de dados. |
| **Autenticação** | express-session + bcrypt | Gerenciamento de sessão para controle de acesso e hashing seguro de senhas. |
| **Controle de Versão** | Git + GitHub | Sistema de controle de versão distribuído e plataforma de hospedagem de código. |

---

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   Node.js (versão LTS recomendada)
*   Git

### 1. Clonar o Repositório

```bash
git clone https://github.com/mgpcampos/inventory-management.git
cd inventory-management/
```

### 2. Instalar Dependências

Instale todas as dependências do projeto listadas no `package.json`:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias. No mínimo, você precisará de:

```
# Exemplo de conteúdo para o arquivo .env
NODE_ENV=development
PORT=3000
SESSION_SECRET="sua_chave_secreta_aqui"
# O Sequelize criará o arquivo do banco de dados SQLite automaticamente
DB_FILE=./data/inventory.sqlite
```

### 4. Configurar e Popular o Banco de Dados

Utilizando o Sequelize, execute as migrações para criar o esquema do banco de dados e, em seguida, execute os *seeders* para popular as tabelas iniciais (usuários, categorias, etc.).

```bash
# Exemplo de comando para executar migrações (pode variar dependendo da sua configuração Sequelize CLI)
npx sequelize-cli db:migrate

# Exemplo de comando para executar seeders
npx sequelize-cli db:seed:all
```

### 5. Iniciar a Aplicação

Inicie o servidor Node.js:

```bash
npm run start
```

A aplicação estará acessível em `http://localhost:3000` (ou na porta configurada no seu `.env`).

---

## 🔑 Credenciais de Acesso (Usuários Iniciais)

Após a execução dos *seeders*, os seguintes usuários de teste estarão disponíveis:

| Papel | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | admin@inv.com | 123456 |
| **Gerente** | gerente@inv.com | 123456 |
| **Usuário** | usuario@inv.com | 123456 |

**Nota:** Altere as senhas padrão imediatamente em um ambiente de produção.

---

## 🗺️ Estrutura do Projeto

A estrutura do projeto segue o padrão MVC (Model-View-Controller):

```
.
├── node_modules/
├── public/                 # Arquivos estáticos (CSS, JS do cliente, imagens)
├── src/
│   ├── config/             # Configurações do ambiente e do banco de dados
│   ├── controllers/        # Lógica de manipulação de requisições (Controllers)
│   ├── models/             # Definições de modelos Sequelize e lógica de acesso a dados (Models)
│   ├── routes/             # Definição das rotas da aplicação
│   ├── views/              # Templates EJS (Views)
│   ├── middlewares/        # Funções de middleware (autenticação, autorização, validação)
│   └── services/           # Lógica de negócio complexa
├── .env                    # Variáveis de ambiente (não versionado)
├── package.json
├── README.md               # Este arquivo
└── PROPOSTA.md             # Documento de Proposta do Projeto
```