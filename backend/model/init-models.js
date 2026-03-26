const { DataTypes } = require("sequelize");

// Импорт моделей в другом порядке
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
	// Инициализация моделей в изменённом порядке
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
	disciplineModel.hasMany(teacherDisciplineModel, {
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

	studentGroupModel.hasMany(studentModel, {
		foreignKey: "group_id",
		onDelete: "CASCADE"
	});

	studentGroupModel.hasMany(studentGroupSessionModel, {
		as: "student_group_sessions",
		foreignKey: "student_group_id" // Проверь, чтобы тут не было "group_id"
	});

	studentGroupSessionModel.hasMany(attestationBookModel, {
		foreignKey: "student_group_session_id",
		onDelete: "CASCADE"
	});

	teacherModel.hasMany(teacherDisciplineModel, {
		foreignKey: "teacher_id",
		onDelete: "CASCADE"
	});

	teacherDisciplineModel.hasMany(studentGroupSessionModel, {
		foreignKey: "teacher_discipline_id",
		onDelete: "CASCADE"
	});

	// Связи "belongsTo"
	teacherDisciplineModel.belongsTo(disciplineModel, {
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
		as: "student_group", // Добавь это!
		foreignKey: "student_group_id"
	});

	attestationBookModel.belongsTo(studentGroupSessionModel, {
		foreignKey: "student_group_session_id"
	});

	teacherDisciplineModel.belongsTo(teacherModel, {
		foreignKey: "teacher_id"
	});

	studentGroupSessionModel.belongsTo(teacherDisciplineModel, {
		foreignKey: "teacher_discipline_id"
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