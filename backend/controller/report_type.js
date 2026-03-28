const db = require('../config/db.config.js');
const ReportType = db.report_type;

// Получение всех типов контроля
exports.findAll = (req, res) => {
	ReportType.findAll()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};