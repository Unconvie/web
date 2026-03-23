module.exports = function (sequelize, DataTypes) {
	return sequelize.define('student', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: { // Должно быть строго name, как в phpMyAdmin
			type: DataTypes.STRING(255),
			allowNull: true
		},
		group_id: { // Должно быть строго group_id
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'student',
		timestamps: false
	});
};