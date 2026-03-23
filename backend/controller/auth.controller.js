const db = require("../config/db.config.js");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Регистрация нового пользователя
exports.register = (req, res) => {
	User.create({
		username: req.body.username,
		// Хэшируем пароль перед сохранением
		password: bcrypt.hashSync(req.body.password, 8)
	})
		.then(() => {
			res.send({ message: "Пользователь успешно зарегистрирован!" });
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

// Вход в систему
// Вход в систему
exports.login = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	})
		.then(user => {
			if (!user) {
				return res.status(404).send({ message: "Пользователь не найден." });
			}

			// 1. Проверяем пароль (сравниваем введенный с хэшем из базы)
			var passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Неверный пароль!"
				});
			}

			// 2. Создаем токен (действует 24 часа)
			// В "secret-key" лучше вписать любую свою секретную фразу
			var token = jwt.sign({ id: user.id }, "secret-key", {
				expiresIn: 86400 // 24 часа
			});

			// 3. Отправляем ответ фронтенду
			res.status(200).send({
				id: user.id,
				username: user.username,
				accessToken: token // Вот он, наш золотой ключик
			});
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};