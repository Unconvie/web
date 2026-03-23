const db = require('../config/db.config.js');
const Attestation = db.attestation_book;

exports.findAll = (req, res) => {
	// Убираем include вообще, чтобы проверить саму таблицу
	Attestation.findAll()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			console.error("ОШИБКА В ATTESTATION:", err.message);
			res.status(500).send({ message: err.message });
		});
};

exports.add = (req, res) => {
	Attestation.create({
		student_id: req.body.student_id,
		student_group_session_id: req.body.student_group_session_id,
		grade: req.body.grade
	})
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};