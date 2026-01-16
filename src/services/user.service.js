const boom = require('@hapi/boom');

const { models } = require('../utils/sequelize.utils');

class UserService {
  static async find() {
    const rta = await models.User.findAll({
      include: ['customer'],
    });
    return rta;
  }

  static async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  static async findCustomer(id) {
    const user = await models.User.findOne({
      include: ['customer'],
      where: { id },
    });
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  static async getUserToValidate({ isAdmin, sub }, userQuery) {
    const id = isAdmin ? userQuery : sub;
    const user = await models.User.findOne({
      include: ['customer'],
      where: { id },
    });
    return user;
  }
}

module.exports = UserService;
