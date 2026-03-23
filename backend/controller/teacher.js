const db = require('../config/db.config.js');
const Teacher = db.teacher;
const globalFunctions = require('../config/global.functions.js');

// Получить всех преподавателей
exports.findAll = (req, res) => {
	Teacher.findAll()
		.then(objects => globalFunctions.sendResult(res, objects))
		.catch(err => globalFunctions.sendError(res, err));
};

// Найти одного по ID
exports.findById = (req, res) => {
	Teacher.findByPk(req.params.id)
		.then(object => globalFunctions.sendResult(res, object))
		.catch(err => globalFunctions.sendError(res, err));
};

// Добавить преподавателя
exports.create = (req, res) => {
	Teacher.create({
		last_name: req.body.last_name,
		first_name: req.body.first_name,
		middle_name: req.body.middle_name
	})
		.then(object => globalFunctions.sendResult(res, object))
		.catch(err => globalFunctions.sendError(res, err));
};

// Обновить данные
exports.update = (req, res) => {
	Teacher.update({
		last_name: req.body.last_name,
		first_name: req.body.first_name,
		middle_name: req.body.middle_name
	}, {
		where: { id: req.params.id }
	})
		.then(object => globalFunctions.sendResult(res, object))
		.catch(err => globalFunctions.sendError(res, err));
};

// Удалить
exports.delete = (req, res) => {
	Teacher.destroy({ where: { id: req.params.id } })
		.then(() => globalFunctions.sendResult(res, 'Запись удалена'))
		.catch(err => globalFunctions.sendError(res, err));
};