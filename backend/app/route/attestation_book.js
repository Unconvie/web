module.exports = function (app) {
	const attestation = require('../../controller/attestation_book.js');
	const session = require('../../controller/student_group_session.js');
	const authJwt = require('../middleware/authJwt');
	const teacherDiscipline = require('../../controller/teacher_discipline.js');
	const reportType = require('../../controller/report_type.js');



	// Получение всех записей аттестационной книжки
	app.get('/api/ListAttestation', [authJwt.verifyToken], attestation.findAll);
	app.get('/api/ListSessions', [authJwt.verifyToken], session.findAll);
	app.post('/api/AddAttestation', [authJwt.verifyToken], attestation.add);
	app.delete('/api/DeleteAttestation/:id', attestation.delete);	// Обрати внимание на :id — это переменная, которую мы вытащим в контроллере
	app.put('/api/UpdateAttestation/:id', attestation.update);
	app.get('/api/ListTeacherDisciplines', teacherDiscipline.findAll);
	app.post('/api/AddTeacherDiscipline', teacherDiscipline.add);
	app.get('/api/listReportTypes', reportType.findAll);// Для выпадающего списка
	app.post('/api/AddSession', session.add);
};