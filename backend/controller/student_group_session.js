const db = require('../config/db.config.js');

exports.findAll = (req, res) => {
	db.student_group_session.findAll({
		include: [
			{
				model: db.student_group,
				as: 'student_group', // Должно совпадать с init-models
				attributes: ['name']
			},
			{
				model: db.teacher_discipline,
				as: 'teacher_discipline',
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
		.then(data => {
			console.log("Данные из базы:", data); // Посмотри в ТЕРМИНАЛ сервера
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};