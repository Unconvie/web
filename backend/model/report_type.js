// Определяет форму контроля (Экзамен, Лабораторная работа).
//  Она подтягивается в сессию, чтобы уточнить, за что именно ставится оценка
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('report_type', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: false,
		}
	});
};
