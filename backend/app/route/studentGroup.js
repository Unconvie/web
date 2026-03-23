module.exports = (app) => {
	const studentGroup = require('../../controller/studentGroup');
	const authJwt = require('../middleware/authJwt');

	app.get('/api/listStudentGroups', [authJwt.verifyToken], studentGroup.getAll);
	app.get('/api/studentGroup/:id', [authJwt.verifyToken], studentGroup.getOne);
	app.post('/api/addStudentGroup', [authJwt.verifyToken], studentGroup.add);
	app.post('/api/updateStudentGroup/:id', [authJwt.verifyToken], studentGroup.modify);
	app.post('/api/deleteStudentGroup/:id', [authJwt.verifyToken], studentGroup.remove);
};