const express = require('express');
const passport = require('passport');
const CouponService = require('../services/coupons.service');
const CouponUserService = require('../services/coupon-users.service');
// eslint-disable-next-line no-unused-vars
const validatorHandler = require('../middlewares/validator.mid');
// eslint-disable-next-line no-unused-vars
const { getCouponDTO, createCouponDTO } = require('../dtos/coupon.dto');
const { validate } = require('../services/validations');

const router = express.Router();

router.get('/', async (req, res) => {
  const coupons = await CouponService.findAll(req.query);
  res.json(coupons);
});

router.post(
  '/',
  // validatorHandler(createCouponDTO, 'body'),
  async (req, res, next) => {
    try {
      const coupon = await CouponService.store(req.body);
      if (coupon && req.files && req.files.csv) {
        const path = req.files.csv.tempFilePath;
        await CouponUserService.storeMultipleFromCSV(path, coupon.id);
      }
      res.json(coupon);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/', async (req, res) => {
  const coupons = await CouponService.update(req.body);
  res.json(coupons);
});

router.get(
  '/coupon-validate/user/:promoCode',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const coupons = await validate(req);
    res.json(coupons);
  }
);

router.get('/coupon-validate/:promoCode', async (req, res) => {
  const coupons = await validate(req);
  res.json(coupons);
});

router.get('/search/:id/', async (req, res) => {
  const { id } = req.params;
  const coupons = await CouponService.findOne(id);
  res.json(coupons);
});

router.get('/coupon-types', async (req, res) => {
  const response = await CouponService.getTypes();
  res.json(response);
});

router.put('/change-status/', async (req, res) => {
  passport.authenticate('jwt', { session: false });
  const coupons = await CouponService.changeStatus(req.body);
  res.json(coupons);
});

router.delete('/', async (req, res) => {
  passport.authenticate('jwt', { session: false });
  const coupons = await CouponService.destroy(req.body);
  res.json(coupons);
});

router.post('/:id/users', async (req, res) => {
  if (req.files && req.files.csv) {
    const path = req.files.csv.tempFilePath;
    const couponId = req.params.id;
    const users = await CouponUserService.storeMultipleFromCSV(path, couponId);
    res.json(users);
    return;
  }
  res.json('no file');
});

module.exports = router;
