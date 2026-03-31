// таблица-мост для связи многие ко многим, без него не связать преподавателей с предметами
module.exports = function (sequelize, DataTypes) {
	const TeacherDiscipline = sequelize.define('teacher_discipline', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "Первичный ключ записи"
		},
		// discipline_id и teacher_id - 2 главных поля, так как эта
		//  таблица хранит не отдельные объекты а пары чисел 
		// (прееподаватель №2 ведет предмет № 6)
		discipline_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			comment: "Внешний ключ на дисциплину",
			references: {
				model: 'discipline',
				key: 'id'
			}
		},

		teacher_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			comment: "Внешний ключ на преподавателя",
			references: {
				model: 'teacher',
				key: 'id'
			}
		},
		trial708: {
			type: DataTypes.CHAR(1),
			allowNull: true,
			comment: "Поле для тестирования"
		}
	});

	return TeacherDiscipline;
};