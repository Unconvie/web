// подключаем файл конфигурации базы данных. В переменной db теперь лежат все наши модели и само подключение
const db = require('../config/db.config.js');
// Создает короткую ссылку на модель attestation_book. Это сделано просто для удобства,
// чтобы дальше в коде писать короткое Attestation.create(...) вместо длинного db.attestation_book.create(...).
const Attestation = db.attestation_book;


// Получение всех оценок:

// Объявляет и экспортирует функцию findAll. req (request) — это запрос от фронтенда, 
// res (response) — ответ, который мы отправим обратно.
exports.findAll = (req, res) => {
	// Метод Sequelize, который идет в базу и говорит: «Дай мне все строки из таблицы аттестаций»
	db.attestation_book.findAll({
		// Ограничивает выдачу. Мы говорим базе: «Мне не нужны все поля, дай мне только вот эти 4.
		// Это экономит память
		attributes: ['id', 'mark', 'student_id', 'student_group_session_id'],
		// жадная загрузка
		// Без этого получим просто цифры ID. Благодаря include 
		// Sequelize делает JOIN (объединение таблиц) и вытаскивает имена 
		// студентов, названия предметов и ФИО преподов за один запрос
		include: [
			// Подтягивает к каждой оценке данные студента. Причем забирает только его имя
			{ model: db.student, attributes: ['name'] },
			{
				// Подтягивает данные о сессии группы. И внутри себя открывает следующий include (вложенный запрос)
				model: db.student_group_session,
				include: [
					// Внутри сессии находит тип контроля (экзамен, зачет). as — это псевдоним (алиас), который мы задали в связях
					{ model: db.report_type, as: 'report_type' },
					{
						// Внутри сессии находит связку преподавателя и дисциплины. И открывает еще один уровень вложенности!
						model: db.teacher_discipline,
						as: 'teacher_discipline',
						include: [
							// внутри связки достает имя предмета и имя преподавателя
							{ model: db.discipline, as: 'discipline', attributes: ['name'] },
							{ model: db.teacher, as: 'teacher', attributes: ['name'] }
						]
					}
				]
			}
		]
	})
		// Это промис. Он говорит: «Если база успешно вернула данные,
		// то выполни следующий блок кода, а полученный результат назови data»
		.then(data => {
			// Проверяем, вернулось ли нам хоть что-то из базы
			if (data.length > 0) {
				// дебаг. выводим в консоль терминала структуру первой найденной записи
				console.log("=== DEBUG ATTESTATION ===");
				console.log("Teacher Discipline Object:", JSON.stringify(data[0].student_group_session?.teacher_discipline, null, 2));
			} else {
				// Если массив пустой, пишем об этом в консоль сервера
				console.log("Записей в аттестационной книжке пока нет");
			}
			// Сервер отправляет собранный массив data обратно на фронтенд!!!
			res.send(data);
		})
		// Если на этапе запроса к базе что-то не так, сработает .catch.
		// выведем ошибку в консоль и отправим на фронтенд статус 500 (Внутренняя ошибка сервера).
		.catch(err => {
			console.error("ОШИБКА SEQUELIZE:", err);
			res.status(500).send(err.message);
		});
};

// Создание оценки

// Объявляет функцию добавления записи
exports.add = (req, res) => {
	// новая строка таблицы
	Attestation.create({
		// берем данные, которые пользователь ввел в форму на фронтенде (лежат в теле запроса req.body), раскладываем по базе данных
		student_id: req.body.student_id,
		student_group_session_id: req.body.student_group_session_id,
		mark: req.body.mark
	})
		// Если запись создалась, отправляем созданную строку обратно на фронтенд
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

// Удаление записи по id

exports.delete = (req, res) => {
	// Вытаскивает ID удаляемой записи из URL запроса (например, /api/DeleteAttestation/5)
	const id = req.params.id;
	// Метод Sequelize для удаления. Условие where говорит: «Удали только ту строку,
	// чей id совпадает с тем, что мы вытащили строкой выше»
	Attestation.destroy({
		where: { id: id }
	})
		// Метод destroy возвращает количество удаленных строк.
		// Если оно равно 1 — значит, всё прошло успешно
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

// Обновление записи (оценка + дисциплина/сессия)
exports.update = (req, res) => {
	const id = req.params.id;
	// Метод Sequelize для изменения данных.
	// Первым объектом передаем что меняем (новую оценку и новую сессию из req.body),
	// а вторым объектом — у кого именно меняем (where: { id: id })
	Attestation.update({
		mark: req.body.mark,
		student_group_session_id: req.body.student_group_session_id
	}, {
		where: { id: id }
	})
		// метод update возвращает массив, где на первом месте стоит 
		// число измененных строк. Если там 1 — запись успешно обновлена
		.then(num => {
			if (num == 1) {
				res.send({ message: "Запись успешно обновлена!" });
			} else {
				res.send({ message: "Не удалось обновить. Возможно, запись не найдена или данные идентичны." });
			}
		})
		.catch(err => {
			console.error(err);
			res.status(500).send({ message: "Ошибка сервера при обновлении" });
		});
};