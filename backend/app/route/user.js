module.exports = (app) => {
	const user = require('../../controller/user');
	const auth = require('../../controller/auth.controller');
	const authJwt = require('../middleware/authJwt');

	// Публичные маршруты (доступны всем);
	// роуты регистрации и входа;
	// здесь НЕТ проверки токена [authJwt.verifyToken] ведь неавторизованный пользователь 
	// не сможет войти в систему, если мы потребуем от него токен для входа
	app.post('/api/auth/register', auth.register);
	app.post('/api/auth/login', auth.login);

	// Защищенные маршруты (только с токеном)
	// Позволяет получить список всех пользователей системы. Но этот рут уже приватный и требует токен, чтобы обычные гости не видели список админов
	app.get('/api/users', [authJwt.verifyToken], user.findAll);

	app.get('/api/user/:id', [authJwt.verifyToken], user.findById);
};