const db = require('../config/db.config.js');

exports.findAll = (req, res) => {
	db.student_group_session.findAll({
		include: [
			{
				model: db.student_group,
				as: 'student_group', // Попробуй добавить этот алиас
				attributes: ['name']
			},
			{
				model: db.teacher_discipline,
				as: 'teacher_discipline', // И этот
				include: [
					{
						model: db.discipline,
						as: 'discipline',
						attributes: ['name']
					}
				]
			}
		]
	})
		.then(data => res.send(data))
		.catch(err => {
			// Выведем полную ошибку в консоль, чтобы увидеть SQL запрос
			console.log("ПОЛНАЯ ОШИБКА:", err);
			res.status(500).send({ message: err.message });
		});
};