const db = require('../config/db.config.js');
const TeacherDiscipline = db.teacher_discipline;

// Получить все пары Преподаватель-Предмет
exports.findAll = (req, res) => {
	TeacherDiscipline.findAll({
		include: [
			{ model: db.teacher, as: 'teacher', attributes: ['name'] },
			{ model: db.discipline, as: 'discipline', attributes: ['name'] }
		]
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};

// Создать новую пару
exports.add = (req, res) => {
	TeacherDiscipline.create({
		teacher_id: req.body.teacher_id,
		discipline_id: req.body.discipline_id
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};