const { models } = require('../utils/sequelize.utils');
const { getIdUsers } = require('../utils/excel-to-Array');

class CouponUserService {
  static async storeMultipleFromCSV(path, idCoupon) {
    const idUsers = await getIdUsers(path);

    const data = idUsers.map((id) => ({
      couponId: idCoupon,
      customerId: id,
    }));

    const users = await models.UserCoupon.bulkCreate(data);
    return users;
  }

  static async findUserByCoupon(idUser, idCoupon) {
    const coupon = await models.UserCoupon.findOne({
      where: { customer_id: idUser, promotion_id: idCoupon },
    });
    return coupon;
  }
}

module.exports = CouponUserService;
