const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// 1. Настройки CORS (чтобы React с порта 8081 мог общаться с сервером на порту 3000)
var corsOptions = {
	origin: ["http://localhost:3000", "http://localhost:3001"]
};
app.use(cors(corsOptions));

// 2. Настройки парсинга данных (JSON и формы)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 3. Подключение базы данных и моделей
const db = require('./config/db.config.js');
db.sequelize.sync({ force: false });

// 4. ПОДКЛЮЧЕНИЕ МАРШРУТОВ (Routes)
// Порядок важен: сначала авторизация, потом всё остальное
require('./app/route/user')(app);           // Вход и регистрация
require('./app/route/discipline')(app);     // Дисциплины
require('./app/route/studentGroup')(app);   // Группы
require('./app/route/student')(app);        // Студенты
require('./app/route/teacher')(app);        // Преподаватели
require('./app/route/attestation_book')(app); // Аттестации

// 5. Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Сервер успешно запущен на порту ${PORT}.`);
});