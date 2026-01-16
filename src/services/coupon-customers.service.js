const sequelize = require('sequelize');
const { models } = require('../utils/sequelize.utils');

class CouponUserService {
  static async findCustomerByCoupon(user, idCoupon) {
    const coupon = await models.CustomerCoupon.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'count']],
      where: { customer_id: user.customer.id, promotion_id: idCoupon },
    });
    return coupon;
  }

  static async countCouponRedeemed(user, idCoupon) {
    const countCouponRedeemed = await models.CustomerCoupon.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'count']],
      where: { promotion_id: idCoupon },
    });
    return countCouponRedeemed;
  }
}

module.exports = CouponUserService;
