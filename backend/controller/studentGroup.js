const db = require('../config/db.config.js');
const StudentGroup = db.student_group;
const globalFunctions = require('../config/global.functions.js');

exports.getAll = (req, res) => {
	// найти все группы.
	StudentGroup.findAll()
		// просто передаем результат в globalFunctions.sendResult.
		.then(items => globalFunctions.sendResult(res, items))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.getOne = (req, res) => {
	// найти конкретную группу по ID (Primary Key).
	StudentGroup.findByPk(req.params.id)
		.then(item => globalFunctions.sendResult(res, item))
		.catch(error => globalFunctions.sendError(res, error));
};

// добавление
// Берет название новой группы из тела запроса и сохраняет в базу.
exports.add = (req, res) => {
	StudentGroup.create({ name: req.body.name })
		.then(item => globalFunctions.sendResult(res, item))
		.catch(error => globalFunctions.sendError(res, error));
};

// Изменение
exports.modify = (req, res) => {
	// Меняет название группы
	// req.params.id говорит какую группу менять
	// req.body.name — на какое имя
	StudentGroup.update({ name: req.body.name }, { where: { id: req.params.id } })
		.then(result => globalFunctions.sendResult(res, result))
		.catch(error => globalFunctions.sendError(res, error));
};

// Удаляет группу по её идентификатору.
exports.remove = (req, res) => {
	StudentGroup.destroy({ where: { id: req.params.id } })
		.then(() => globalFunctions.sendResult(res, 'Группа удалена'))
		.catch(error => globalFunctions.sendError(res, error));
};