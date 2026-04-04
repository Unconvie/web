// готовит данные для выпадающих списков на фронтенде

// Собирает воедино тип контроля (зачет/экзамен), группу
//  и связку препод-предмет. Без него фронтенд не знал бы, 
// какие именно пары «Предмет + Преподаватель» доступны для выбора

const db = require('../config/db.config.js');

// Вызывает поиск всех записей в таблице сессий. Эта таблица — связующее звено между учебным планом и журналом оценок
exports.findAll = (req, res) => {
	db.student_group_session.findAll({
		include: [
			// Подтягивает название типа контроля и название группы.
			// Алиасы as должны соответствовать тем, что прописаны в init-models.js
			{ model: db.report_type, as: 'report_type' },
			{ model: db.student_group, as: 'student_group' },
			{
				// двойная вложенность. заходим в таблицу связок «препод-предмет»,
				// и внутри достаем название дисциплины и ФИО преподавателя
				// ЗАЧЕМ?
				// На фронтенде в выпадающем списке пользователь должен видеть не
				// просто ID=5, а понятную строку: «Математика — Петров».
				// этот вложенный include дает нам нужные слова вместо цифр
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

// Создание новой сессии/назначение предмета
exports.add = (req, res) => {
	db.student_group_session.create({
		// Записывает три «внешних ключа» (Foreign Keys).
		// говорим: «Свяжи вот эту группу с этой парой препод-предмет и
		// таким типом контроля». Все эти ID приходят из формы на фронтенде через req.body
		student_group_id: req.body.student_group_id,
		teacher_discipline_id: req.body.teacher_discipline_id,
		report_type_id: req.body.report_type_id,
		// Записывает номер семестра. Оператор || 1 — это значение по умолчанию.
		// Если фронтенд забыл прислать номер семестра, сервер не выдаст ошибку, а запишет «1»
		semester: req.body.semester || 1
	})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({ message: err.message }));
};