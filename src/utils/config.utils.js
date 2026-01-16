const result = require('dotenv').config({
  path: `env/.env.${process.env.NODE_ENV}`,
});

const { apiLogger } = require('./debug.utils');

function loadConfig() {
  if (result.error) throw new Error(`ERROR-ENV: ${result.error.message}`);
  apiLogger('ENV', `environment "${process.env.NODE_ENV}" loaded successfully`);
}

function getConfig() {
  const ENV = process.env;

  return {
    portHttp: Number(ENV.PORT_HTTP) || 3000,
    debug: ENV.DEBUG === 'true',
    dbUser: ENV.DB_USER,
    dbPassword: ENV.DB_PASSWORD,
    dbHost: ENV.DB_HOST,
    dbName: ENV.DB_NAME,
    dbPort: ENV.DB_PORT,
    jwtSecretAdminUser: ENV.JWT_SECRET_ADMIN_USER,
    jwtSecretCustomers: ENV.JWT_SECRET_CUSTOMER,
  };
}

module.exports = { loadConfig, getConfig };
