const { Model, DataTypes } = require('sequelize');

const ADDITIONALS_TABLE = 'promotions_types_list';

const AdditionalsSchema = {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  promotion_id: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  promotions_type_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
};
// eslint-disable-next-line camelcase
class Additionals extends Model {
  static associate() {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: ADDITIONALS_TABLE,
      modelName: 'Additionals',
      timestamps: false,
    };
  }
}

module.exports = { ADDITIONALS_TABLE, AdditionalsSchema, Additionals };
