const CouponService = require('../coupons.service');
const sequelize = require('../../utils/sequelize.utils');
const { getCoupon, getUser } = require('./index');

afterAll(() => {
  sequelize.close();
});
describe('Validate the existence of a coupon', () => {
  it('validate that the coupon does not exist', async () => {
    await expect(getCoupon('RandomTextByFail')).rejects.toThrow(
      'El cupón ingresado no existe.'
    );
  });
  it('validate that the coupon does not exist sending null', async () => {
    await expect(getCoupon()).rejects.toThrow('El cupón ingresado no existe.');
  });
  it('validate that the coupon exist', async () => {
    const coupons = await CouponService.findAllFilter({});
    const index = Math.floor(Math.random() * coupons.length);
    const couponToValidate = coupons[index];
    const coupon = await getCoupon(couponToValidate.promo_code);
    expect(coupon.promo_code).toBe(couponToValidate.promo_code);
  });
});

describe('Validate user', () => {
  test('It must get the empty user', async () => {
    const user = await getUser(undefined, undefined);
    expect(user).toBeNull();
  });

  test('It must get the user by the subfield of the jwt', async () => {
    const dataUserPayload = { sub: 381853 };
    const user = await getUser(dataUserPayload, undefined);
    expect(user.email).toBe('leslie.aviles17@gmail.com');
  });

  test('It must get the user by the parameter of the query', async () => {
    const dataUserPayload = { isAdmin: true };
    const user = await getUser(dataUserPayload, 381853);
    expect(user.email).toBe('leslie.aviles17@gmail.com');
  });
  test('It must get the user by the parameter of the query', async () => {
    const dataUserPayload = { isAdmin: true };
    const user = await getUser(dataUserPayload, 'qweq÷');
    expect(user).toBeNull();
  });
});
