const { Op } = require('sequelize');
const ErrorException = require('../helper/ErrorException');

module.exports = class ExistingHandler {
  /**
   * @FUNCTIONS
   * @Validation
   * @desc
   * Arguements:
   * 1. Database model : sequelize model
   * 2. p_where condition (Columns that should be unique) : Object
   */

  static async init(model, p_where, id) {
    if (ExistingHandler.isValid(p_where)) {
      // Arrange object to Add Or condition on query
      const c_where = Object.entries(p_where).reduce((a, b) => {
        if (!a[Op.or]) a[Op.or] = [];
        a[Op.or].push({ [b[0]]: b[1] });

        return a;
      }, {});

      // Query result if condition exists
      const where = Object.assign(c_where, !!id ? { id: { [Op.not]: id } } : {});
      const result = await model.findOne({ where });

      if (result) {
        for (const property in p_where) {
          // Validate if result query is equals to the value of the passed object's property (p_where)
          if (result[property].toLowerCase().trim() === p_where[property].toLowerCase().trim())
            return [new ErrorException(409, `${property} already exists!`, { property })];
        }
      }
    }

    return [null];
  }

  static isValid(p_where) {
    return Object.values(p_where).every((e) => typeof e !== 'undefined' && typeof e !== null);
  }
};
