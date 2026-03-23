module.exports = (app) => {
	// ВАЖНО: подключаем именно контроллеры
	const user = require('../../controller/user');
	const auth = require('../../controller/auth.controller');
	const authJwt = require('../middleware/authJwt');

	// Публичные маршруты (доступны всем)
	app.post('/api/auth/register', auth.register);
	app.post('/api/auth/login', auth.login);

	// Защищенные маршруты (только с токеном)
	app.get('/api/users', [authJwt.verifyToken], user.findAll);
	app.get('/api/user/:id', [authJwt.verifyToken], user.findById);
};