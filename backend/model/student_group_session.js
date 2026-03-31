// таблица-мост, «план занятий». Она объединяет группу,
// связку (преподаватель + предмет) и семестр. Без этой записи нельзя выставить
//  оценку, так как непонятно, в рамках какого семестра идет предмет
module.exports = function (sequelize, DataTypes) {
	const StudentGroupSession = sequelize.define('student_group_session', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		semester: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: "Семестр проведения"
		},
		mark_date: {
			type: DataTypes.STRING(150),
			allowNull: true,
			comment: "Дата оценки"
		},
		student_group_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			comment: "Ссылка на группу студентов",
			references: {
				model: 'student_group',
				key: 'id'
			}
		},
		report_type_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			comment: "Ссылка на тип отчета",
			references: {
				model: 'report_type',
				key: 'id'
			}
		},
		teacher_discipline_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			comment: "Ссылка на преподавателя и дисциплину",
			references: {
				model: 'teacher_discipline',
				key: 'id'
			}
		},
		trial708: {
			type: DataTypes.CHAR(1),
			allowNull: true,
			comment: "Временное поле"
		}
	});

	return StudentGroupSession;
};