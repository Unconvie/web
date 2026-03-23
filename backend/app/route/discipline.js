module.exports = (app) => {
	const discipline = require('../../controller/discipline');
	const authJwt = require('../middleware/authJwt');

	app.get('/api/listDisciplines', [authJwt.verifyToken], discipline.getAll);
	app.get('/api/discipline/:id', [authJwt.verifyToken], discipline.getOne);
	app.post('/api/AddDiscipline', [authJwt.verifyToken], discipline.add);
	app.post('/api/updateDiscipline/:id', [authJwt.verifyToken], discipline.modify);
	app.post('/api/deleteDiscipline/:id', [authJwt.verifyToken], discipline.remove);
};