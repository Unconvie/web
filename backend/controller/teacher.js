// управляют тем, кто и что преподает
// многие ко многим

const db = require('../config/db.config.js');
const Teacher = db.teacher;
// явно импортируем Discipline, так как в этом файле нужно связывать таблицы напрямую 
const Discipline = db.discipline; // Импортируем модель дисциплин
const globalFunctions = require('../config/global.functions.js');

// Получить всех преподавателей
exports.findAll = (req, res) => {
	Teacher.findAll({
		// сразу же «приклеить» к ним дисциплины, которые они ведут (только их id и name)
		include: [
			{
				model: Discipline,
				as: "disciplines", // имя, которое дали в связях
				attributes: ['id', 'name'], // Берем только нужное
				// говорит: Дай мне список дисциплин учителя, но не показывай технические поля из таблицы-посредника (типа даты создания связи)
				through: { attributes: [] } // Нам не нужны поля из связующей таблицы-моста (trial708)
			}
		]
	})
		.then(objects => globalFunctions.sendResult(res, objects))
		.catch(err => globalFunctions.sendError(res, err));
};

// Найти одного по ID
exports.findById = (req, res) => {
	// findByPk — метод Sequelize (найти по первичному ключу).
	// первичный ключ у нас - id, функция ищет преподавателя по его id.
	// этот id сервер берет из URL-адреса запроса через req.params.id (например /api/teachers/5, id будет 5).
	Teacher.findByPk(req.params.id)
		.then(object => globalFunctions.sendResult(res, object))
		.catch(err => globalFunctions.sendError(res, err));
};

// Добавить преподавателя (controller/teacher.js)
exports.create = (req, res) => {
	// Сервер проверяет, как фронтенд прислал имя.
	// Если пришла готовая строка name (например, «Иванов И.И.»), берем её.
	// Если фронтенд прислал имя по частям (фамилия, имя, отчество),
	// сервер склеит их в одну строку через пробел и удалит лишние пробелы по краям с помощью .trim()
	const fullName = req.body.name ||
		`${req.body.last_name || ''} ${req.body.first_name || ''} ${req.body.middle_name || ''}`.trim();

	// создаем запись преподавателя в базе
	Teacher.create({
		name: fullName
	})
		.then(teacher => {
			// Если переданы ID дисциплин, создаем связи в таблице teacher_discipline
			if (req.body.disciplineIds && req.body.disciplineIds.length > 0) {
				// teacher.setDisciplines(req.body.disciplineIds) передаем туда массив [1, 5, 12]: метод Sequelize для связи Many-to-Many.автоматически удаляет старые
				// связи преподавателя и создает новые в таблице-мосте
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

	// Обновляем самого преподавателя
	Teacher.update({ name: fullName }, { where: { id: req.params.id } })
		.then(() => {
			// Ищем этого преподавателя, чтобы обновить его связи и работали методы типа setDisciplines
			return Teacher.findByPk(req.params.id);
		})
		.then(teacher => {
			// Если пришел массив disciplineIds
			// Метод setDisciplines смотрит на новый массив ID. Если какие-то старые связи больше не нужны — он их удаляет
			// Если появились новые — добавляет. синхронизирует базу с массивом, который прислал фронтенд
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