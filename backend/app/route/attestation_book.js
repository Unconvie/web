// связывает фронтенд с логикой выставления оценок и формирования учебных сессий
module.exports = function (app) { // экспорт функции которая принимает объект app(запущенный сервер express)
	// Строки с require(...) Подключают контроллеры аттестаций, сессий, связей преподов с дисциплинами и типов отчетов.
	const attestation = require('../../controller/attestation_book.js'); // Подключаем контроллер
	const session = require('../../controller/student_group_session.js');
	const authJwt = require('../middleware/authJwt'); // Подключаем защиту
	const teacherDiscipline = require('../../controller/teacher_discipline.js');
	const reportType = require('../../controller/report_type.js');



	// Получение всех записей аттестационной книжки
	// app.get(...) — обработчик запроса на получение данных
	// app.post(...) — обработчик запроса на создание данных
	// app.put(...) — обработчик на изменение данных
	// app.delete(...) — обработчик на удаление данных
	// [authJwt.verifyToken] — это промежуточное ПО. Массив функций, 
	// выполняются до того, как сработает контроллер. проверяет, залогинен ли пользователь

	// Запрос на получение всех оценок. Защищен токеном. Вызывает функцию findAll в контроллере аттестаций
	app.get('/api/ListAttestation', [authJwt.verifyToken], attestation.findAll);
	app.get('/api/ListSessions', [authJwt.verifyToken], session.findAll);
	// Отправка данных новой оценки из формы на бэкенд. Тоже защищена.
	app.post('/api/AddAttestation', [authJwt.verifyToken], attestation.add);
	// Удаление записи. :id в конце URL. Это переменная пути. 
	// Если шлем запрос на /api/DeleteAttestation/5, сервер поймет - нужно удалить запись с ID = 5.
	app.delete('/api/DeleteAttestation/:id', [authJwt.verifyToken], attestation.delete);	// :id — это переменная, которую вытащим в контроллере
	app.put('/api/UpdateAttestation/:id', [authJwt.verifyToken], attestation.update);
	app.get('/api/ListTeacherDisciplines', [authJwt.verifyToken], teacherDiscipline.findAll);
	app.post('/api/AddTeacherDiscipline', [authJwt.verifyToken], teacherDiscipline.add);
	app.get('/api/listReportTypes', [authJwt.verifyToken], reportType.findAll);// Для выпадающего списка
	app.post('/api/AddSession', [authJwt.verifyToken], session.add);
};