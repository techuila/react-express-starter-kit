module.exports = class Upsert {
  static async init(Model, values, options, includes = {}) {
    return await Model.findOne({ where: { id: values.id || -1 }, ...includes }).then(async function (obj) {
      // console.log(values);
      if (options == null) options = {};

      if (obj) {
        // update
        const { fields, ...option } = options;
        await obj.update(values, { individualHooks: true, ...option });
        return await Model.findOne({ where: { id: values.id }, ...includes });
      } else {
        // insert
        // If include is not empty
        if (!!Object.keys(includes).length) {
          const result = await Model.create(values, { ...options }).then((resultEntity) => resultEntity.get({ plain: true }));
          return await Model.findOne({ where: { id: result.id }, ...includes });
        } else {
          return await Model.create(values, { ...options });
        }
      }
    });
  }
};
