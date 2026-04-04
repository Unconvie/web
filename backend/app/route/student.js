// Управление списком учащихся
module.exports = (app) => {
	const student = require('../../controller/student');
	const authJwt = require('../middleware/authJwt');

	// все методы защищены, ссылаются на методы контроллера, в адресах используются id для точной идентификации студента
	app.get('/api/ListStudents', [authJwt.verifyToken], student.getAll);
	app.get('/api/student/:id', [authJwt.verifyToken], student.getOne);
	app.post('/api/AddStudent', [authJwt.verifyToken], student.add);
	app.post('/api/UpdateStudent/:id', [authJwt.verifyToken], student.modify);
	app.post('/api/DeleteStudent/:id', [authJwt.verifyToken], student.remove);
};