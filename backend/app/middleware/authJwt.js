const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	// Ищем токен в заголовках запроса
	let token = req.headers["x-access-token"];

	// Если токена нет вообще
	if (!token) {
		return res.status(403).send({
			message: "Токен не предоставлен! Доступ запрещен."
		});
	}

	// Расшифровываем токен секретным ключом (должен совпадать с тем, что в auth.controller.js)
	jwt.verify(token, "secret-key", (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message: "Неавторизованный доступ! Неверный или просроченный токен."
			});
		}

		// Если всё отлично, сохраняем id пользователя и пропускаем запрос дальше
		req.userId = decoded.id;
		next();
	});
};

module.exports = {
	verifyToken
};