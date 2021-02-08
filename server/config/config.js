const { DB_NAME, DB_USER, DB_PASS } = require('../enums/environment');

module.exports = {
  localhost: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: DB_NAME,
    password: DB_PASS,
    database: DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
};
