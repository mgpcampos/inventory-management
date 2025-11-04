const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = 3000;

sequelize.sync().then(() => {
	app.listen(PORT, () =>
		console.log(`Aplicação ativa em: http://localhost:${PORT}`),
	);
});
