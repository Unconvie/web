// Здесь настраивается логика того, как таблицы «общаются» друг с другом
const { DataTypes } = require("sequelize");

// Импорт моделей
const _student = require("./student");
const _student_group = require("./student_group");
const _discipline = require("./discipline");
const _teacher = require("./teacher");
const _teacher_discipline = require("./teacher_discipline");
const _report_type = require("./report_type");
const _student_group_session = require("./student_group_session");
const _attestation_book = require("./attestation_book");
const _user = require("./user");
const _sqlite_sequence = require("./sqlite_sequence");

function initModels(database) {
	// Инициализация моделей
	const studentModel = _student(database, DataTypes);
	const studentGroupModel = _student_group(database, DataTypes);
	const disciplineModel = _discipline(database, DataTypes);
	const teacherModel = _teacher(database, DataTypes);
	const teacherDisciplineModel = _teacher_discipline(database, DataTypes);
	const reportTypeModel = _report_type(database, DataTypes);
	const studentGroupSessionModel = _student_group_session(database, DataTypes);
	const attestationBookModel = _attestation_book(database, DataTypes);
	const userModel = _user(database, DataTypes);
	const sqliteSequenceModel = _sqlite_sequence(database, DataTypes);

	// Определение связей между моделями
	// Связи "hasMany"
	// связь один ко многим
	disciplineModel.hasMany(teacherDisciplineModel, {
		as: "teacher_disciplines",
		foreignKey: "discipline_id",
		onDelete: "CASCADE"
	});

	reportTypeModel.hasMany(studentGroupSessionModel, {
		foreignKey: "report_type_id",
		onDelete: "CASCADE"
	});

	studentModel.hasMany(attestationBookModel, {
		foreignKey: "student_id",
		onDelete: "CASCADE"
	});

	// например группа владеет многими студентами
	// onDelete:CASCADE - Это значит, что если ты 
	// удалишь группу из базы, все студенты этой
	//  группы удалятся автоматически. Это защищает
	//  базу от «сирот» (записей, которые ссылаются на пустоту).
	studentGroupModel.hasMany(studentModel, {
		foreignKey: "group_id",
		onDelete: "CASCADE"
	});

	studentGroupModel.hasMany(studentGroupSessionModel, {
		as: "student_group_sessions",
		foreignKey: "student_group_id"
	});

	studentGroupSessionModel.hasMany(attestationBookModel, {
		foreignKey: "student_group_session_id",
		onDelete: "CASCADE"
	});

	teacherModel.hasMany(teacherDisciplineModel, {
		as: "teacher_disciplines",
		foreignKey: "teacher_id",
		onDelete: "CASCADE"
	});

	teacherDisciplineModel.hasMany(studentGroupSessionModel, {
		as: "student_group_sessions",
		foreignKey: "teacher_discipline_id",
		onDelete: "CASCADE"
	});

	// Связи "belongsTo"
	//  связь многие ко многим
	teacherDisciplineModel.belongsTo(disciplineModel, {
		as: "discipline",
		foreignKey: "discipline_id"
	});

	studentGroupSessionModel.belongsTo(reportTypeModel, {
		foreignKey: "report_type_id",
		as: 'report_type'
	});

	attestationBookModel.belongsTo(studentModel, {
		foreignKey: "student_id"
	});

	studentModel.belongsTo(studentGroupModel, {
		foreignKey: "group_id"
	});

	studentGroupSessionModel.belongsTo(studentGroupModel, {
		as: "student_group",
		foreignKey: "student_group_id"
	});

	attestationBookModel.belongsTo(studentGroupSessionModel, {
		foreignKey: "student_group_session_id"
	});

	teacherDisciplineModel.belongsTo(teacherModel, {
		as: "teacher",
		foreignKey: "teacher_id"
	});

	studentGroupSessionModel.belongsTo(teacherDisciplineModel, {
		as: "teacher_discipline",
		foreignKey: "teacher_discipline_id"
	});

	// например учитель связан с дисциплиной
	teacherModel.belongsToMany(disciplineModel, {
		// указываем sequelize что связь идет через «посредника»
		//  — ту самую таблицу-мост
		through: teacherDisciplineModel,
		foreignKey: "teacher_id",
		otherKey: "discipline_id",
		// Это алиас. Благодаря ему, когда мы 
		// будем делать запрос, в объекте преподавателя
		//  появится массив под названием disciplines
		as: "disciplines"
	});

	disciplineModel.belongsToMany(teacherModel, {
		through: teacherDisciplineModel,
		foreignKey: "discipline_id",
		otherKey: "teacher_id",
		as: "teachers"
	});

	// Возвращаем объект с моделями
	return {
		attestation_book: attestationBookModel,
		discipline: disciplineModel,
		report_type: reportTypeModel,
		sqlite_sequence: sqliteSequenceModel,
		student: studentModel,
		student_group: studentGroupModel,
		student_group_session: studentGroupSessionModel,
		teacher: teacherModel,
		teacher_discipline: teacherDisciplineModel,
		user: userModel
	};
}

// Экспорт функций
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;