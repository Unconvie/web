// простой контроллер справочник

// Подключает настройки базы данных и все созданные в проекте модели.
const db = require('../config/db.config.js');
// короткую ссылку на модель discipline
const Discipline = db.discipline;
// файл со вспомогательными функциями
const globalFunctions = require('../config/global.functions.js');

//получить все дисциплины
exports.getAll = (req, res) => {
	// дебаг - запрос дошел до этого метода
	console.log("Попытка получить список дисциплин...");
	// Команда Sequelize: «Иди в таблицу дисциплин и найди там всё»
	Discipline.findAll()
		// Если база всё отдала, выведем этот массив в терминал
		// для проверки (console.log), отправим его фронтенд со статусом 200 OK
		.then(items => {
			console.log("Данные из базы получены:", items);
			res.status(200).send(items);
		})
		.catch(error => {
			// напечатается в окне терминала
			console.error("ОШИБКА SEQUELIZE:", error.message);
			res.status(500).send({ message: error.message });
		});
};

// Получить одну дисциплину по ID

// Экспортирует функцию получения одной записи
exports.getOne = (req, res) => {
	// "Найти по первичному ключу". первичный ключ у нас — id,
	// Sequelize ищет запись по нему. id вытаскивается из адресной строки через req.params.id
	Discipline.findByPk(req.params.id)
		// Если запись нашлась, мы не пишем res.send(...), а передаем управление
		// функции sendResult из внешнего файла. Она знает, как красиво упаковать ответ.
		.then(item => globalFunctions.sendResult(res, item))
		.catch(error => globalFunctions.sendError(res, error));
};

// Добавление дисциплины
exports.add = (req, res) => {
	// добавляет новую строку в таблицу.
	// В поле name (название дисциплины) кладем то, что пользователь
	// ввел на фронтенде в поле и прислал в теле запроса (req.body.name)
	Discipline.create({
		name: req.body.name
	})
		.then(item => {
			res.status(200).send(item);
		})
		.catch(error => {
			console.error("Ошибка при добавлении:", error.message);
			res.status(500).send({ message: error.message });
		});
};

// Изменение дисциплины

// Функция обновления существующей записи
exports.modify = (req, res) => {
	// Обновляет запись
	// Первый аргумент { name: req.body.name } — новые данные
	// Второй аргумент { where: { id: req.params.id } } — условие, чтобы база понимала, какую дисциплину переименовать
	Discipline.update({ name: req.body.name }, { where: { id: req.params.id } })
		// вынесли повторяющийся код в отдельный файл (принцип DRY — Don't Repeat Yourself)
		.then(result => globalFunctions.sendResult(res, result))
		.catch(error => globalFunctions.sendError(res, error));
};

// Удаление
exports.remove = (req, res) => {
	// удаляет запись из базы
	// используем where с id из параметров запроса, чтобы не стереть лишнего
	Discipline.destroy({ where: { id: req.params.id } })
		.then(() => globalFunctions.sendResult(res, 'Дисциплина удалена'))
		.catch(error => globalFunctions.sendError(res, error));
};