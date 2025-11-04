const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
	"Usuario",
	{
		nome: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "usuarios",
		timestamps: false,
	},
);

module.exports = Usuario;
