const { Model, DataTypes, Sequelize } = require('sequelize');

const { CUSTOMER_TABLE } = require('./customer.model');
const { COUPON_TABLE } = require('./coupon.model');

const CUSTOMER_COUPON_TABLE = 'promotions_customer';

const customerCouponSchema = {
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
  amountType: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'amount_type',
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

class CustomerCoupon extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_COUPON_TABLE,
      modelName: 'CustomerCoupon',
      timestamps: false,
    };
  }
}

module.exports = {
  CustomerCoupon,
  customerCouponSchema,
  CUSTOMER_COUPON_TABLE,
};
