const moment = require('moment');
const { findByPromoCode } = require('../coupons.service');
const { findOne } = require('../user.service');

class CouponValidation {
  user = null;

  coupon = null;

  async getUser(req) {
    if (!this.user) {
      const userId = req.user.isAdmin ? req.params.user : req.user.sub;
      this.user = await findOne(userId);
    }
    return this.user;
  }

  async getCoupon(promoCode) {
    if (!this.coupon) {
      this.coupon = await findByPromoCode(promoCode);
    }
    return this.coupon;
  }

  async hasCoupon(next, req) {
    const { promoCode } = req.params;
    const coupon = await this.getCoupon(promoCode);
    if (coupon) {
      return next();
    }

    return next('Cupón no encontrado');
  }

  async hasExpiredCoupon(next) {
    const nowDate = moment();
    const couponDate = moment(this.coupon.finish_at);
    const hasExpired = nowDate.isSameOrAfter(couponDate);

    if (hasExpired) {
      return next();
    }
    return next();
  }

  hasSameUserCity = async (next, req) => {
    const user = await this.getUser(req);
    const hasSameCity = user.countryId === this.coupon.city;

    if (hasSameCity) {
      return next();
    }

    return next();
  };

  static hasSameUserPlan = (next) => next();
}

module.exports = CouponValidation;
