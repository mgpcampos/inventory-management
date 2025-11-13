const Usuario = require("../models/User");

exports.exibirUsuarios = async (req, res) => {
	try {
		const usuarios = await Usuario.findAll();
		res.json(usuarios);
	} catch (err) {
		res.status(500).send(`Erro ao buscar usuários:`, err);
	}
};
