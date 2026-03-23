const databaseConfig = {
    dbName: 'attestation_book',
    dbUser: 'root',
    dbPassword: '',
    dbHost: 'localhost',
    dbType: 'mysql',
    connectionPool: {
        maxConnections: 5,
        minConnections: 0,
        acquireTimeout: 30000,
        idleTimeout: 10000
    }
};

const Sequelize = require('sequelize');

const dbConnection = new Sequelize(
    databaseConfig.dbName,
    databaseConfig.dbUser,
    databaseConfig.dbPassword,
    {
        host: databaseConfig.dbHost,
        dialect: databaseConfig.dbType,
        operatorsAliases: false,
        pool: {
            max: databaseConfig.connectionPool.maxConnections,
            min: databaseConfig.connectionPool.minConnections,
            acquire: databaseConfig.connectionPool.acquireTimeout,
            idle: databaseConfig.connectionPool.idleTimeout
        },
        define: {
            freezeTableName: true,
            timestamps: false
        }
    }
);

const initializeModels = require('../model/init-models');
const models = initializeModels.initModels(dbConnection);

models.Sequelize = Sequelize;
models.sequelize = dbConnection;

module.exports = models;