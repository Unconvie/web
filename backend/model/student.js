//Содержит ФИО студентов и привязывает их к конкретной группе через group_id
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('student', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		group_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'student',
		timestamps: false
	});
};