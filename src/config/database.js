const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "db/database.sqlite",
});

sequelize
	.authenticate()
	.then(() =>
		console.log(
			`Conexão com o banco de dados (SQLite3) estabelecida com sucesso.`,
		),
	)
	.catch((err) => console.error(`ERRO: `, err));

module.exports = sequelize;
