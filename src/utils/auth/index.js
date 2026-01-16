const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { getConfig } = require('../config.utils');

const { jwtSecretAdminUser, jwtSecretCustomers } = getConfig();
let isAdmin = false;

const secretOrKeyProvider = (req, token, done) => {
  const { headers } = req;
  isAdmin = headers['origin-admin'] && headers['origin-admin'] === 'admin';
  const secretOrKey = isAdmin ? jwtSecretAdminUser : jwtSecretCustomers;

  done(null, secretOrKey);
};

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider,
};

const jwtStrategy = new Strategy(options, (payload, done) => {
  done(null, { ...payload, isAdmin });
});

passport.use(jwtStrategy);
