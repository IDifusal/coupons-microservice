const { Sequelize } = require('sequelize');
const { getConfig } = require('./config.utils');
const setupModels = require('../models');

const config = getConfig();
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: 'mysql',
});

setupModels(sequelize);

module.exports = sequelize;
