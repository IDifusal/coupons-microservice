const ServerService = require('./services/server.service');
const { loadConfig } = require('./utils/config.utils');

function main() {
  try {
    loadConfig();
    const server = new ServerService();
    server.start();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
}

main();
