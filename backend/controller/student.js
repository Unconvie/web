// связь студента с его группой

// Подключаем базу данных и делаем ссылку на модель student для удобства
const db = require('../config/db.config.js');
const Student = db.student;

// Говорим Sequelize найти всех студентов
exports.getAll = (req, res) => {
	// Команда Sequelize пойти в таблицу студентов и вытащить все записи
	Student.findAll({
		// говорим: «Sequelize, когда пойдешь за студентами, сразу захвати с собой данные из другой таблицы»
		include: [{
			// Указываем, из какой таблицы нужно подтянуть данные. В данном случае — модель учебных групп
			model: db.student_group,
			// алиас (псевдоним). говорим Sequelize: «Когда будешь подтягивать группу,
			// назови этот объект в ответе student_group». Это должно совпадать с тем, что написано в init-models.js
			as: 'student_group',    // имя связи из init-models.js
			// не нужна вся информация о группе, только её название
			attributes: ['name']
		}]
	})
		// мы отправляем массив студентов (внутри каждого теперь лежит объект группы student_group) на фронтенд
		.then(items => {
			res.status(200).send(items);
		})
		.catch(error => {
			res.status(500).send({ message: error.message });
		});
};

// Добавление студента
exports.add = (req, res) => {
	// новая строка в таблице студентов. передаем туда имя студента
	//  и group_id (внешний ключ группы), которые пользователь ввел в форму на фронтенде и прислал в req.body
	Student.create({
		name: req.body.name,
		group_id: req.body.group_id
	})
		.then(item => {
			res.status(200).send(item);
		})
		.catch(error => {
			res.status(500).send({ message: error.message });
		});
};

// Удаление
exports.remove = (req, res) => {
	// указываем, что нужно удалить ту запись, чей ID пришел в URL-адресе
	Student.destroy({ where: { id: req.params.id } })
		.then(() => res.status(200).send({ message: "Студент удален" }))
		.catch(error => res.status(500).send({ message: error.message }));
};

// // Заглушка
// exports.getOne = (req, res) => {
// 	res.status(200).send({ message: "Метод в разработке" });
// };

// Изменение данных студента
exports.modify = (req, res) => {
	// Получаем ID из параметров запроса
	const id = req.params.id;
	// Обновляет запись.

	// Первый аргумент — это новые данные
	Student.update(
		{
			name: req.body.name,
			group_id: req.body.group_id
		},
		// Второй аргумент (where) — условие поиска нужной строки в базе
		{
			where: { id: id }
		}
	)
		.then(() => {
			res.status(200).send({ message: "Данные студента обновлены" });
		})
		.catch(error => {
			res.status(500).send({ message: error.message });
		});
};