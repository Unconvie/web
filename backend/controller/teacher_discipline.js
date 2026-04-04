// управляют тем, кто и что преподает - промежуточной таблицей-мостом

const db = require('../config/db.config.js');
const TeacherDiscipline = db.teacher_discipline;

// Получить все пары Преподаватель-Предмет
exports.findAll = (req, res) => {
	// идет в таблицу-мост и достает все строки. если вернуть их просто так,
	// фронтенд получит ID (например: teacher_id: 1, discipline_id: 3). Чтобы это исправить, используем include.
	TeacherDiscipline.findAll({
		include: [
			// с помощью JOIN подтягивает к каждому ID: ФИО преподавателя и название дисциплины.
			// забираем только поле name (attributes: ['name']), чтобы не перегружать ответ
			{ model: db.teacher, as: 'teacher', attributes: ['name'] },
			{ model: db.discipline, as: 'discipline', attributes: ['name'] }
		]
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};

// Создать новую пару вручную
exports.add = (req, res) => {
	TeacherDiscipline.create({
		// берем teacher_id и discipline_id из тела запроса (req.body), который пришел с фронтенда
		teacher_id: req.body.teacher_id,
		discipline_id: req.body.discipline_id
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};