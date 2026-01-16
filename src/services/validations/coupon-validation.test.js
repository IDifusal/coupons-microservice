const { Op } = require('sequelize');
const moment = require('moment');
const sequelize = require('../../utils/sequelize.utils');

const CouponService = require('../coupons.service');
const {
  hasExpiredCoupon,

  hasLimitCoupon,
} = require('./coupon-validation');

const nowDate = moment().format('YYYY-MM-DD');
afterAll(() => {
  sequelize.close();
});

describe('Expired', () => {
  it('should get a coupon without expiring', async () => {
    console.log(nowDate);
    const coupons = await CouponService.findAllFilter({
      finish_at: { [Op.gt]: nowDate },
    });
    const index = Math.floor(Math.random() * coupons.length);
    const coupon = coupons[index];
    const message = await hasExpiredCoupon((m) => m, { coupon });
    expect(message).toBeUndefined();
  });

  it('should get a coupon expiring', async () => {
    const coupons = await CouponService.findAllFilter({
      finish_at: { [Op.lt]: nowDate },
    });
    const index = Math.floor(Math.random() * coupons.length);
    const coupon = coupons[index];

    const message = await hasExpiredCoupon((m) => m, { coupon });
    expect(message).toBe('El cupón ha expirado.');
  });
});

describe('hasLimitCoupon', () => {
  it('should get a coupon that has not reached the limit', async () => {
    const [results] = await sequelize.query(
      'SELECT promotion_id, `name`, COUNT(promotion_id) AS Redeemed FROM promotions_customer INNER JOIN promotions on promotion_id = promotions.id GROUP BY promotion_id, `name`, promotions.`status` HAVING promotions.`status` = 1 AND Redeemed > 100 ORDER BY Redeemed DESC'
    );

    const index = Math.floor(Math.random() * results.length);
    const couponId = results[index].promotion_id;
    const coupon = await CouponService.findOneFilter(couponId);
    const limit = await hasLimitCoupon((m) => m, { coupon });
    expect(limit).toBeUndefined();
  });
  it('should get a coupon that has reached the limit', async () => {
    const [results] = await sequelize.query(
      'SELECT promotion_id, `name`, COUNT(promotion_id) AS Redeemed FROM promotions_customer INNER JOIN promotions on promotion_id = promotions.id GROUP BY promotion_id, `name`, promotions.`status` HAVING promotions.`status` = 1 AND Redeemed > 100 ORDER BY Redeemed DESC'
    );

    const index = Math.floor(Math.random() * results.length);
    const couponId = results[index].promotion_id;
    const coupon = await CouponService.findOneFilter(couponId);
    const limit = await hasLimitCoupon((m) => m, { coupon });
    expect(limit).toBeUndefined();
  });
});

describe('hasRedeemed', () => {
  it.todo('should get a coupon that has reached the limit');
});
