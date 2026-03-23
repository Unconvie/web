const db = require('../config/db.config.js');
const Discipline = db.discipline;
const globalFunctions = require('../config/global.functions.js');

// exports.getAll = (req, res) => {
// 	Discipline.findAll()
// 		.then(items => globalFunctions.sendResult(res, items))
// 		.catch(error => globalFunctions.sendError(res, error));
// };
exports.getAll = (req, res) => {
	console.log("Попытка получить список дисциплин...");
	Discipline.findAll()
		.then(items => {
			console.log("Данные из базы получены:", items);
			res.status(200).send(items);
		})
		.catch(error => {
			// Это напечатается в твоем черном окне терминала!
			console.error("ОШИБКА SEQUELIZE:", error.message);
			res.status(500).send({ message: error.message });
		});
};

exports.getOne = (req, res) => {
	Discipline.findByPk(req.params.id)
		.then(item => globalFunctions.sendResult(res, item))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.add = (req, res) => {
	Discipline.create({
		name: req.body.name
	})
		.then(item => {
			res.status(200).send(item);
		})
		.catch(error => {
			console.error("Ошибка при добавлении:", error.message);
			res.status(500).send({ message: error.message });
		});
};

exports.modify = (req, res) => {
	Discipline.update({ name: req.body.name }, { where: { id: req.params.id } })
		.then(result => globalFunctions.sendResult(res, result))
		.catch(error => globalFunctions.sendError(res, error));
};

exports.remove = (req, res) => {
	Discipline.destroy({ where: { id: req.params.id } })
		.then(() => globalFunctions.sendResult(res, 'Дисциплина удалена'))
		.catch(error => globalFunctions.sendError(res, error));
};