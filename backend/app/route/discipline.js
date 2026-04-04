// Полный набор операций (CRUD) для управления списком предметов. Все операции закрыты токеном
module.exports = (app) => {
	const discipline = require('../../controller/discipline');
	const authJwt = require('../middleware/authJwt');

	// Получить весь список предметов для таблицы или выпадающего списка
	app.get('/api/listDisciplines', [authJwt.verifyToken], discipline.getAll);
	// Получить информацию о конкретном одном предмете по его ID
	app.get('/api/discipline/:id', [authJwt.verifyToken], discipline.getOne);
	// Добавление нового предмета
	app.post('/api/AddDiscipline', [authJwt.verifyToken], discipline.add);
	// Изменение названия предмета
	app.post('/api/updateDiscipline/:id', [authJwt.verifyToken], discipline.modify);
	// Удаление предмета. Здесь вместо метода DELETE используется POST на специальный адрес
	app.post('/api/deleteDiscipline/:id', [authJwt.verifyToken], discipline.remove);
};