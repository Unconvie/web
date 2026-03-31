// Справочник преподавателей с их ФИО
module.exports = function (database, DataTypes) {
	return database.define('teacher', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "Идентификатор преподавателя"
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			comment: "ФИО преподавателя"
		},
		trial708: {
			type: DataTypes.CHAR(1),
			allowNull: true,
			comment: "Тестовое поле"
		}
	});
};