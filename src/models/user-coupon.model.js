const { Model, DataTypes, Sequelize } = require('sequelize');

const { CUSTOMER_TABLE } = require('./customer.model');
const { COUPON_TABLE } = require('./coupon.model');

const USER_COUPON_TABLE = 'promotion_users';

const UserCouponSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  couponId: {
    field: 'promotion_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: COUPON_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
};

class UserCoupon extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_COUPON_TABLE,
      modelName: 'UserCoupon',
      timestamps: false,
    };
  }
}

module.exports = {
  UserCoupon,
  UserCouponSchema,
  USER_COUPON_TABLE,
};
