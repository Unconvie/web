// Этот контроллер используется фронтендом в основном для того,
// чтобы заполнить выпадающий список (Select) вариантами: «Экзамен», «Лабораторная работа».

const db = require('../config/db.config.js');
const ReportType = db.report_type;

// Получение всех типов контроля
exports.findAll = (req, res) => {
	// без аргументов просто делает SQL-запрос SELECT * FROM report_type.
	// вытаскивает все доступные виды аттестации
	ReportType.findAll()
		// Если всё ОK, массив данных улетает на фронтенд.
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};