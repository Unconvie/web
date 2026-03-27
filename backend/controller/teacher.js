const db = require('../config/db.config.js');
const Teacher = db.teacher;
const Discipline = db.discipline; // Импортируем модель дисциплин
const globalFunctions = require('../config/global.functions.js');

// Получить всех преподавателей
exports.findAll = (req, res) => {
	Teacher.findAll({
		include: [
			{
				model: Discipline,
				as: "disciplines", // То самое имя, которое мы дали в связях
				attributes: ['id', 'name'], // Берем только нужное
				through: { attributes: [] } // Нам не нужны поля из связующей таблицы (trial708)
			}
		]
	})
		.then(objects => globalFunctions.sendResult(res, objects))
		.catch(err => globalFunctions.sendError(res, err));
};

// Найти одного по ID
exports.findById = (req, res) => {
	Teacher.findByPk(req.params.id)
		.then(object => globalFunctions.sendResult(res, object))
		.catch(err => globalFunctions.sendError(res, err));
};

// Добавить преподавателя (controller/teacher.js)
exports.create = (req, res) => {
	const fullName = req.body.name ||
		`${req.body.last_name || ''} ${req.body.first_name || ''} ${req.body.middle_name || ''}`.trim();

	Teacher.create({
		name: fullName
	})
		.then(teacher => {
			// Если переданы ID дисциплин, создаем связи в таблице teacher_discipline
			if (req.body.disciplineIds && req.body.disciplineIds.length > 0) {
				return teacher.setDisciplines(req.body.disciplineIds).then(() => teacher);
			}
			return teacher;
		})
		.then(teacher => globalFunctions.sendResult(res, teacher))
		.catch(err => globalFunctions.sendError(res, err));
};

// Обновить данные преподавателя
exports.update = (req, res) => {
	const fullName = req.body.name ||
		`${req.body.last_name || ''} ${req.body.first_name || ''} ${req.body.middle_name || ''}`.trim();

	// 1. Обновляем самого преподавателя
	Teacher.update({ name: fullName }, { where: { id: req.params.id } })
		.then(() => {
			// 2. Ищем этого преподавателя, чтобы обновить его связи
			return Teacher.findByPk(req.params.id);
		})
		.then(teacher => {
			// 3. Если пришел массив disciplineIds, обновляем связи
			if (req.body.disciplineIds) {
				return teacher.setDisciplines(req.body.disciplineIds).then(() => teacher);
			}
			return teacher;
		})
		.then(() => globalFunctions.sendResult(res, { message: "Данные и дисциплины обновлены" }))
		.catch(err => globalFunctions.sendError(res, err));
};

// Удалить
exports.delete = (req, res) => {
	Teacher.destroy({ where: { id: req.params.id } })
		.then(() => globalFunctions.sendResult(res, 'Запись удалена'))
		.catch(err => globalFunctions.sendError(res, err));
};