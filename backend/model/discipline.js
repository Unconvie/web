// справочник названий предметов
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('discipline', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "TRIAL"
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			comment: "TRIAL"
		}
		// удалила trial708
	}, {
		tableName: 'discipline',
		timestamps: false,
		freezeTableName: true
	});
};