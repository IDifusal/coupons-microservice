const { Coupon, CouponSchema } = require('./coupon.model');
const { Customer, CustomerSchema } = require('./customer.model');
const { User, UserSchema } = require('./user.model');
const { UserCoupon, UserCouponSchema } = require('./user-coupon.model');
const { TypeCoupon, TypeCouponSchema } = require('./type-coupon.model');

const {
  CustomerCoupon,
  CustomerCouponSchema,
} = require('./customer-coupon.model');
const { Additionals, AdditionalsSchema } = require('./additionals.model');

function setupModels(sequelize) {
  Coupon.init(CouponSchema, Coupon.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  User.init(UserSchema, User.config(sequelize));
  UserCoupon.init(UserCouponSchema, UserCoupon.config(sequelize));
  CustomerCoupon.init(CustomerCouponSchema, CustomerCoupon.config(sequelize));
  Additionals.init(AdditionalsSchema, Additionals.config(sequelize));
  TypeCoupon.init(TypeCouponSchema, TypeCoupon.config(sequelize));

  Coupon.associate(sequelize.models);
  User.associate(sequelize.models);
}

module.exports = setupModels;
