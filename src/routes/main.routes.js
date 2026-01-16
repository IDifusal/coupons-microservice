const express = require('express');
const bodyParser = require('body-parser');
const couponsRouter = require('./coupons.routes');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  app.use(bodyParser.urlencoded({ extended: true }));
  router.use('/coupons', couponsRouter);
}

module.exports = routerApi;
