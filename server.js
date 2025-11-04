// server.js
const app = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Aplicação ativa em: http://localhost:${PORT}`);
});
