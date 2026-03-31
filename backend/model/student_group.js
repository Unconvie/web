// Хранит список академических групп
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('student_group', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	}, {
		tableName: 'student_group',
		timestamps: false
	});
};