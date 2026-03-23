const db = require('../config/db.config.js');
const Student = db.student;

exports.getAll = (req, res) => {
	// Говорим Sequelize найти всех студентов
	Student.findAll({
		include: [{
			model: db.student_group, // Указываем модель группы
			as: 'student_group',    // Это имя связи из твоего init-models.js
			attributes: ['name']    // Нам нужно только поле name из таблицы групп
		}]
	})
		.then(items => {
			// Теперь в каждом объекте студента будет вложенный объект student_group
			res.status(200).send(items);
		})
		.catch(error => {
			res.status(500).send({ message: error.message });
		});
};

exports.add = (req, res) => {
	Student.create({
		name: req.body.name, // Меняем fio -> name
		group_id: req.body.group_id // Меняем student_group_id -> group_id
	})
		.then(item => {
			res.status(200).send(item);
		})
		.catch(error => {
			res.status(500).send({ message: error.message });
		});
};

exports.remove = (req, res) => {
	Student.destroy({ where: { id: req.params.id } })
		.then(() => res.status(200).send({ message: "Студент удален" }))
		.catch(error => res.status(500).send({ message: error.message }));
};
// Добавь это в конец файла controller/student.js
exports.getOne = (req, res) => {
	res.status(200).send({ message: "Метод в разработке" });
};

exports.modify = (req, res) => {
	const id = req.params.id; // Получаем ID из параметров запроса

	Student.update(
		{
			name: req.body.name,
			group_id: req.body.group_id
		},
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