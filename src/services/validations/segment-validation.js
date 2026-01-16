const { findUserByCoupon } = require('../coupon-users.service');

const hasUserList = async (segments, userId, couponId) => {
  const segmentToValidate = segments.includes('csv');
  if (!segmentToValidate) return true;

  const userByCoupon = await findUserByCoupon(userId, couponId);
  return userByCoupon;
};

const findSegmentUserState = (segmentCoupon, state) => {
  const segments = {
    registration: 1,
    monthly_first_month: 4,
    monthly_recurring: 5,
    daily: 9,
    monthly_old_customers: 7,
  };

  return segmentCoupon.reduce((p, q) => p || segments[q] === state, false);
};

const validateSegments = async (next, { coupon, user }, query) => {
  if (!user && query.test_validation) return next();
  if (!coupon.segments_available) return next();

  if (!user) return next('Cupón inválido.');

  const segmentCoupon = coupon.segments_available.split(',');
  const statusUser = +user.customer.status_id;

  const segment = findSegmentUserState(segmentCoupon, statusUser);
  const segmentCSV = hasUserList(segmentCoupon, user.id, coupon.id);

  if (segment && segmentCSV) return next();

  return next('Cupón inválido.');
};

module.exports = { validateSegments };
