const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const routerApi = require('../routes/main.routes');
const { getConfig } = require('../utils/config.utils');
const { apiLogger } = require('../utils/debug.utils');
require('../utils/auth');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('../middlewares/error.mid');

class ServerService {
  PORT_HTTP = getConfig().portHttp || 3000;

  allowlist = ['*'];

  app = express();

  constructor() {
    this.middlewares();
    this.routes();
    this.app.use(boomErrorHandler);
  }

  middlewares() {
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
      })
    );
    this.app.use(express.json());
    this.app.use(cors(this.getOptionsCors()));
    this.app.use(logErrors);
    this.app.use(errorHandler);
  }

  routes() {
    routerApi(this.app);
  }

  getOptionsCors() {
    const isAllOriginAllowed = this.allowlist.includes('*');
    return {
      origin: (origin, callback) => {
        if (isAllOriginAllowed || this.allowlist.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('No permitido'));
        }
      },
    };
  }

  start() {
    this.app.listen(this.PORT_HTTP, () => {
      apiLogger('API', `listening on http://localhost:${this.PORT_HTTP}`);
    });
  }
}

module.exports = ServerService;
