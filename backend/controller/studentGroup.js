const db = require('../config/db.config.js');
const StudentGroup = db.student_group;
const globalFunctions = require('../config/global.functions.js');

exports.getAll = (req, res) => {
	StudentGroup.findAll()
		.then(items => globalFunctions.sendResult(res, items))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.getOne = (req, res) => {
	StudentGroup.findByPk(req.params.id)
		.then(item => globalFunctions.sendResult(res, item))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.add = (req, res) => {
	StudentGroup.create({ name: req.body.name })
		.then(item => globalFunctions.sendResult(res, item))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.modify = (req, res) => {
	StudentGroup.update({ name: req.body.name }, { where: { id: req.params.id } })
		.then(result => globalFunctions.sendResult(res, result))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.remove = (req, res) => {
	StudentGroup.destroy({ where: { id: req.params.id } })
		.then(() => globalFunctions.sendResult(res, 'Группа удалена'))
		.catch(error => globalFunctions.sendError(res, error));
};