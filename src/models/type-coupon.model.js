const { Model, DataTypes } = require('sequelize');

const TYPE_COUPON_TABLE = 'promotions_types';

const TypeCouponSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  abbreviation: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};

class TypeCoupon extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: TYPE_COUPON_TABLE,
      modelName: 'TypeCoupon',
      timestamps: false,
    };
  }
}

module.exports = {
  TypeCoupon,
  TypeCouponSchema,
  TYPE_COUPON_TABLE,
};
