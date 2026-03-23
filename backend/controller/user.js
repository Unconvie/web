const db = require('../config/db.config.js');
const User = db.user;
const globalFunctions = require('../config/global.functions.js');

// Получить список всех пользователей системы
exports.findAll = (req, res) => {
	User.findAll()
		.then(objects => {
			globalFunctions.sendResult(res, objects);
		})
		.catch(err => {
			globalFunctions.sendError(res, err);
		});
};

// Найти одного пользователя по его ID
exports.findById = (req, res) => {
	User.findByPk(req.params.id)
		.then(object => {
			globalFunctions.sendResult(res, object);
		})
		.catch(err => {
			globalFunctions.sendError(res, err);
		});
};