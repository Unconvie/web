const db = require('../config/db.config.js');
const Attestation = db.attestation_book;

exports.findAll = (req, res) => {
	db.attestation_book.findAll({
		// Явно просим вернуть mark и id
		attributes: ['id', 'mark', 'student_id', 'student_group_session_id'],
		include: [
			{
				model: db.student,
				as: 'student',
				attributes: ['name']
			},
			{
				model: db.student_group_session,
				as: 'student_group_session',
				include: [
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
			}
		]
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};

exports.add = (req, res) => {
	Attestation.create({
		student_id: req.body.student_id,
		student_group_session_id: req.body.student_group_session_id,
		// ИСПРАВЛЕНО: берем mark из тела запроса
		mark: req.body.mark
	})
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

// Удаление записи по id
exports.delete = (req, res) => {
	const id = req.params.id;
	Attestation.destroy({
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({ message: "Запись успешно удалена!" });
			} else {
				res.send({ message: `Не удалось удалить запись с id=${id}.` });
			}
		})
		.catch(err => {
			res.status(500).send({ message: "Ошибка сервера при удалении" });
		});
};

// Обновление оценки
exports.update = (req, res) => {
	const id = req.params.id;
	Attestation.update({ mark: req.body.mark }, {
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({ message: "Оценка обновлена!" });
			} else {
				res.send({ message: "Не удалось обновить. Возможно, запись не найдена." });
			}
		})
		.catch(err => {
			res.status(500).send({ message: "Ошибка сервера при обновлении" });
		});
};