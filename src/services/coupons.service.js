const boom = require('@hapi/boom');
const { models } = require('../utils/sequelize.utils');
const sequelize = require('../utils/sequelize.utils');

class CouponService {
  static async findAll(query) {
    const data = await models.Coupon.findAll({
      include: ['additionals'],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(select count(id) from promotions_customer WHERE promotion_id = Coupon.id )`
            ),
            'customers',
          ],
        ],
      },
      where: {
        delete: 0,
        country_available: query.country ? query.country : [1, 2, 3, ''],
      },
      order: [['id', 'DESC']],
    });
    return data;
  }

  static async findByPromoCode(promoCode) {
    try {
      const coupon = await models.Coupon.findOne({
        where: { promo_code: promoCode, status: 1 },
      });
      return coupon;
    } catch (error) {
      throw boom.badData('El cupón ingresado no existe.');
    }
  }

  static async findOne(id) {
    const order = await models.Coupon.findByPk(id, {
      include: ['clients', 'additionals'],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(select count(id) from promotions_customer WHERE promotion_id = Coupon.id )`
            ),
            'customers',
          ],
        ],
      },
    });
    return order;
  }

  static async validateCoupon(couponName) {
    const promotion = await models.Coupon.findOne({
      where: { promo_code: couponName },
    });
    if (!promotion) {
      return 'Cupón no válido';
    }
    return promotion;
    // eslint-disable-next-line no-unreachable
    const abbr = await sequelize.query(
      `SELECT * FROM promotions_types WHERE id = ${promotion.type_id}`
    );
    return {
      abbr,
      data: promotion,
    };
  }

  static async index() {
    const promotion = await models.Coupon.findAll({
      where: { delete: 0 },
      order: [['id', 'DESC']],
    });
    // promotion.map(function(element){
    //   element.additionals = sequelize.query(`SELECT 'promotions_type_id as type' FROM promotions_types_list WHERE promotion_id = ${element.id}`)
    // })
    return promotion;
  }

  static async store(item) {
    try {
      const { additionals } = item;
      const isMultiple = additionals && additionals.length > 0 ? 1 : 0;
      const data = {
        type_id: item.type_id,
        status: '1',
        name: item.name,
        finish_at: item.finish_at,
        max: item.max,
        promo_code: item.promo_code,
        default_address_id: item.default_address_id,
        type_quantity: item.type_quantity,
        is_multiple: isMultiple,
        create_id: 1,
        update_id: 1,
        segments_available: item.segments_available,
        delete_id: 1,
        country_available: item.country_available,
        min_amount: item.min_amount,
      };

      const coupon = await models.Coupon.create(data);
      if (additionals) {
        console.log(additionals);
        const additionalObject = JSON.parse(additionals);
        additionalObject.forEach((element) => {
          models.Additionals.create({
            promotions_type_id: element.type,
            quantity: element.quantity,
            promotion_id: coupon.id,
          });
        });
      }
      const response = await models.Coupon.findByPk(coupon.id, {
        include: ['additionals'],
      });
      return response;
    } catch (error) {
      throw boom.badData(error);
    }
  }

  static async update(item) {
    const { additionals } = item;
    const isMultiple = additionals && additionals.length > 0 ? 1 : 0;
    try {
      const data = {
        type_id: item.type_id,
        status: '1',
        name: item.name,
        finish_at: item.finish_at,
        max: item.max,
        promo_code: item.promo_code,
        default_address_id: item.default_address_id,
        type_quantity: item.type_quantity,
        is_multiple: isMultiple,
        create_id: 1,
        update_id: 1,
        segments_available: item.segments_available,
        delete_id: 1,
        country_available: item.country_available,
        min_amount: item.min_amount,
      };
      await models.Coupon.update(data, { where: { id: item.id } });
      const coupon = await models.Coupon.findByPk(item.id);
      if (additionals) {
        models.Additionals.destroy({ where: { promotion_id: item.id } });
        const additionalObject = JSON.parse(additionals);
        additionalObject.forEach((element) => {
          models.Additionals.create({
            promotions_type_id: element.type,
            quantity: element.quantity,
            promotion_id: coupon.id,
          });
        });
      }
      const response = await models.Coupon.findByPk(coupon.id, {
        include: ['additionals'],
      });
      return response;
    } catch (error) {
      throw boom.badData(error);
    }
  }

  static async changeStatus(item) {
    const result = await models.Coupon.update(
      {
        status: item.status,
        update_id: 1,
      },
      { where: { id: item.id } }
    ).catch((err) => err);
    return result;
  }

  static async destroy(item) {
    const result = await models.Coupon.update(
      {
        delete: 1,
        delete_id: 1,
      },
      { where: { id: item.id } }
    ).catch((err) => err);
    return result;
  }

  static async getTypes() {
    const types = await sequelize.query(
      `SELECT id,name,abbreviation FROM promotions_types WHERE "delete" = 0`
    );
    const additionals = await sequelize.query(
      'SELECT id,name,abbreviation FROM promotions_types WHERE id NOT IN  ("1","2","3","8","9")'
    );
    const offices = await sequelize.query('SELECT name FROM branch_offices');
    return {
      types: types[0],
      additionals: additionals[0],
      offices: offices[0],
    };
  }

  static async getValidatedCoupon(promoCode) {
    const coupon = await models.Coupon.findOne({
      where: { promo_code: promoCode },
      include: ['typeCoupon'],
    });

    const abbr = coupon.typeCoupon.abbreviation;
    const typePackage = {
      dpd: 'package_trial',
      pd: 'package_essential',
    };

    return {
      results: {
        status: 'active',
        data: {
          apply_store: 'MEALS',
          type_package: typePackage[abbr],
          content: {
            id: coupon.id,
            coupon_value: coupon.type_quantity,
            coupon_name: coupon.name,
            coupon_code: coupon.promo_code,
            coupon_subtype: coupon.typeCoupon.name,
            abbr: coupon.typeCoupon.abbreviation,
            coupon_text: coupon.typeCoupon.name,
          },
        },
      },
    };
  }

  static async findAllFilter(where, status = 1) {
    const coupon = await models.Coupon.findAll({
      where: { status, ...where },
    });
    if (!coupon) {
      throw boom.notFound('user not found');
    }
    return coupon;
  }

  static async findOneFilter(id) {
    const coupon = await models.Coupon.findByPk(id);
    if (!coupon) {
      throw boom.notFound('user not found');
    }
    return coupon;
  }
}

module.exports = CouponService;
