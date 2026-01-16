const { Model, DataTypes } = require('sequelize');

const COUPON_TABLE = 'promotions';

const CouponSchema = {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  finish_at: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  max: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  is_multiple: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  type_quantity: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  promo_code: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'promo_code',
  },
  default_address_id: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  type_id: {
    allowNull: true,
    type: DataTypes.INTEGER,
    defaultValue: '1',
  },
  delete: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  create_id: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  update_id: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  delete_id: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  country_available: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  segments_available: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  min_amount: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  min_credits_amount: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  max_credits_amount: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  require_plan: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  },
  require_points: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  },
};

class Coupon extends Model {
  static associate(models) {
    this.belongsToMany(models.Customer, {
      as: 'clients',
      through: models.CustomerCoupon,
      foreignKey: 'promotion_id',
      otherKey: 'customer_id',
    });
    this.hasMany(models.Additionals, {
      as: 'additionals',
      foreignKey: 'promotion_id',
    });

    this.belongsTo(models.TypeCoupon, {
      as: 'typeCoupon',
      foreignKey: 'type_id',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COUPON_TABLE,
      modelName: 'Coupon',
      timestamps: false,
    };
  }
}

module.exports = { COUPON_TABLE, CouponSchema, Coupon };
