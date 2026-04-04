const databaseConfig = {
	dbName: 'attestation_book', // имя базы данных
	dbUser: 'root', // имя пользователя(по умолчанию в XAMPP)
	dbPassword: '', // пароль, пользователя root на локалке пустой
	dbHost: 'localhost', // сервер где лежит машина
	dbType: 'mysql', // используемая СУБД
	// Настройки пула соединений
	connectionPool: {
		maxConnections: 5, // одновременно в бд можно открыть 5 соединений
		minConnections: 0, // если никто не пользуется сайтом, лишние соединения закроются до нуля
		acquireTimeout: 30000, // сколько миллисекунд (30 секунд) Sequelize будет пытаться подключиться к базе, прежде чем выбросит ошибку
		idleTimeout: 10000 // если соединение открыто, но им никто не пользуется 10 секунд, оно закроется.
	}
};

// Подключает библиотеку Sequelize
const Sequelize = require('sequelize');

// Создает экземпляр подключения. Мы передаем туда имя базы, логин, пароль и объект с дополнительными настройками.
const dbConnection = new Sequelize(
	databaseConfig.dbName,
	databaseConfig.dbUser,
	databaseConfig.dbPassword,
	{
		host: databaseConfig.dbHost,
		dialect: databaseConfig.dbType,
		// строчка для безопасности
		// принудительно отключаем возможность использовать строковые алиасы для операторов  
		operatorsAliases: false,

		pool: {
			max: databaseConfig.connectionPool.maxConnections,
			min: databaseConfig.connectionPool.minConnections,
			acquire: databaseConfig.connectionPool.acquireTimeout,
			idle: databaseConfig.connectionPool.idleTimeout
		},
		// глобальные настройки всех будущих моделей
		define: {
			// по умолчанию Sequelize переименовывает таблицу user в users
			// Эта строчка говорит: «Используй ровно те имена таблиц, которые я тебе дала».
			freezeTableName: true,
			// по умолчанию Sequelize требует, чтобы в каждой таблице были колонки createdAt и updatedAt
			// нам эти логи не нужны, чтобы не плодить колонки в БД
			timestamps: false
		}
	}
);

// берем файл init-models.js и запускаем функцию initModels,
// передавая ей готовое подключение к базе.
// На выходе получаем объект models, где лежат все таблицы.
const initializeModels = require('../model/init-models');
const models = initializeModels.initModels(dbConnection);

// прикрепляем к нашему объекту моделей класс Sequelize и созданное подключение sequelize
// чтобы в других файлах использовать специальные функции Sequelize
models.Sequelize = Sequelize;
models.sequelize = dbConnection;

// Экспортирует готовый объект.
// Именно его мы потом подключаем в контроллерах через const db = require('../config/db.config.js')
module.exports = models;