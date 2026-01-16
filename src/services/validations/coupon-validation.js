const moment = require('moment');

const {
  findCustomerByCoupon,
  countCouponRedeemed,
} = require('../coupon-customers.service');

const hasLimitCoupon = async (next, { coupon, user }) => {
  if (!user) return next();
  const redeemed = await countCouponRedeemed(user, coupon.id);
  const reachedLimit = redeemed.dataValues.count >= coupon.max;

  if (reachedLimit) {
    return next('El cupón ha expirado.');
  }
  return next();
};

const hasExpiredCoupon = async (next, { coupon }) => {
  const nowDate = moment();
  const couponDate = moment(coupon.finish_at);
  const hasExpired = nowDate.isSameOrAfter(couponDate);

  if (hasExpired) {
    return next('El cupón ha expirado.');
  }
  return next();
};

const hasSameUserCity = async (next, { coupon, user }, query) => {
  const countryByQuery = query.country ? query.country : null;

  const countryUser = user ? user.countryId : countryByQuery;

  if (!countryUser) return next();
  if (!coupon.country_available || coupon.country_available === 'NaN')
    return next();
  const hasSameCity = +countryUser === +coupon.country_available;

  if (hasSameCity) {
    return next();
  }
  return next('Cupón inválido para tu ciudad.');
};

const hasMinimumAmount = async (next, { coupon }, query) => {
  if (!coupon.min_amount) return next();
  if (!query.amount) return next();

  const amount = query.amount / 100;

  const isSuccessfulAmount = +amount >= coupon.min_amount;

  if (isSuccessfulAmount) {
    return next();
  }
  return next(`Aplica tu cupón con la compra mínima de ${coupon.min_amount}`);
};

const hasRedeemed = async (next, { coupon, user }) => {
  if (!user) return next();
  const customerCoupon = await findCustomerByCoupon(user, coupon.id);

  if (customerCoupon.dataValues.count > 0) {
    return next(`Cupón redimido.`);
  }
  return next();
};

const hasSameUserPlan = async (next, { coupon }) => {
  if (coupon.require_plan) {
    return next(`Cupón inválido para el plan seleccionado.`);
  }
  return next();
};

module.exports = {
  hasExpiredCoupon,
  hasSameUserCity,
  hasRedeemed,
  hasLimitCoupon,
  hasSameUserPlan,
  hasMinimumAmount,
};
