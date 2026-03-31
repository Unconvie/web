// Отвечает за безопасность. Хранит логины и хэшированные пароли для входа в систему.
module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('user', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "Первичный ключ пользователя"
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
			comment: "Уникальное имя пользователя"
		},
		password: {
			type: DataTypes.STRING(150),
			allowNull: false,
			comment: "Хэш пароля"
		}
		// Поле trial708 удаляем
	});

	return User;
};
