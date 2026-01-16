const Joi = require('joi');

// eslint-disable-next-line no-unused-vars
const id = Joi.string().min(3);
const promoCode = Joi.string().min(3);
const name = Joi.string().alphanum().min(3).max(15);
const price = Joi.number().integer().min(10);

const createCouponDTO = Joi.object({
  id: Joi.string(),
  name: Joi.string().min(3),
  promo_code: Joi.string().required(),
  type_quantity: Joi.number().required(),
  type_id: Joi.number().required(),
  min_amount: Joi.number().required(),
  finish_at: Joi.required(),
  max: Joi.number().min(1).required(),
  additionals: Joi.string(),
  customers: Joi.number(),
  require_plan: Joi.boolean(),
  require_points: Joi.boolean(),
  country_available: Joi.string().required(),
  segments_available: Joi.array(),
  minim_credits: Joi.string(),
  max_credits: Joi.string(),
  default_address_id: Joi.string(),
  csv: Joi.any(),
  status: Joi.string(),
});

const updateCouponDTO = Joi.object({
  name: name.required(),
  price: price.required(),
});

const getCouponDTO = Joi.object({
  promoCode: promoCode.required(),
});

module.exports = { createCouponDTO, updateCouponDTO, getCouponDTO };
