// Здесь прописан доступ к управлению списком преподавателей
module.exports = (app) => {
	const teacher = require('../../controller/teacher.js'); // Подключаем контроллер
	const authJwt = require('../middleware/authJwt.js'); // Подключаем защиту

	app.get('/api/listTeachers', [authJwt.verifyToken], teacher.findAll);
	app.get('/api/teacher/:id', [authJwt.verifyToken], teacher.findById);
	app.post('/api/addTeacher', [authJwt.verifyToken], teacher.create);
	app.post('/api/updateTeacher/:id', [authJwt.verifyToken], teacher.update);
	app.post('/api/deleteTeacher/:id', [authJwt.verifyToken], teacher.delete);
};