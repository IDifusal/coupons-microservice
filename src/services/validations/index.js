const boom = require('@hapi/boom');
const { getValidatedCoupon } = require('../coupons.service');
const Validation = require('./validation.service');
const { findByPromoCode } = require('../coupons.service');
const { getUserToValidate } = require('../user.service');
const {
  hasExpiredCoupon,
  hasSameUserCity,
  hasSameUserPlan,
  hasRedeemed,
  hasLimitCoupon,
  hasMinimumAmount,
} = require('./coupon-validation');

const { validateSegments } = require('./segment-validation');

const validation = new Validation();

const getCoupon = async (promoCode) => {
  const coupon = await findByPromoCode(promoCode);
  if (coupon) {
    return coupon;
  }
  throw new Error('El cupón ingresado no existe.');
};

const getUser = async (userPayloadJWT, userFromQuery) => {
  const newUserPayloadJWT = userPayloadJWT || { isAdmin: false, sub: false };
  const user = await getUserToValidate(newUserPayloadJWT, userFromQuery);

  return user;
};

const getConfig = async (req) => {
  const coupon = await getCoupon(req.params.promoCode);
  const user = await getUser(req.user, req.query['user-id']);
  validation.use(hasExpiredCoupon);
  validation.use(hasLimitCoupon);
  validation.use(hasRedeemed);
  validation.use(hasSameUserCity);

  validation.use(hasSameUserPlan);
  validation.use(hasMinimumAmount);
  validation.use(validateSegments);

  return { user, coupon };
};

const validate = async (req) => {
  try {
    const conf = await getConfig(req);
    await validation.execute(conf, req.query);
    return getValidatedCoupon(conf.coupon.promo_code);
  } catch (error) {
    return boom.badRequest(error);
  }
};

module.exports = {
  validate,
  getConfig,
  getUser,
  getCoupon,
};
