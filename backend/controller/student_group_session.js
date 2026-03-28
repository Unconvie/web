const db = require('../config/db.config.js');

exports.findAll = (req, res) => {
	db.student_group_session.findAll({
		include: [
			{ model: db.report_type, as: 'report_type' },
			{ model: db.student_group, as: 'student_group' },
			{
				model: db.teacher_discipline,
				as: 'teacher_discipline',
				include: [
					{ model: db.discipline, as: 'discipline' },
					{ model: db.teacher, as: 'teacher' }
				]
			}
		]
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send(err.message));
};

// Добавь этот метод в существующий файл
exports.add = (req, res) => {
	db.student_group_session.create({
		student_group_id: req.body.student_group_id,
		teacher_discipline_id: req.body.teacher_discipline_id,
		report_type_id: req.body.report_type_id,
		semester: req.body.semester || 1 // Если семестр есть в базе
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};