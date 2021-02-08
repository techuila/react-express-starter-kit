const { Upsert, Password } = require('../utils');
const mailer = require('../mailer');
const ErrorException = require('../helper/ErrorException');
const ValidationController = require('./auth/ValidationController');

module.exports = (db) => {
  const options = {
    attributes: ['id', 'first_name', 'last_name', 'user_type_id', 'email', 'active'],
    include: [
      { association: db.Users.Type },
    ],
    order: [['id', 'ASC']]
  };

  return class UserController extends ValidationController {
    static async index() {
      return await db.Users.findAll(options);
    }

    static async show(id) {
      return await db.Users.findOne({ where: { id } });
    }

    static async showTypes() {
      return await db.UserTypes.findAll();
    }

    // BusinessUnits property should be present if user type is Standard User
    static async create(payload) {
      // Check if email exists
      const user = await db.Users.findOne({ where: { email: payload.email } });

      if (user) throw new ErrorException(409, 'Email already exists!');

      // If user type is a standard user, Business unit is required
      const opt = payload.user_type_id == 2 ? { include: [{ association: db.Users.UserBusinessUnits }] } : {};

      // Create User
      const data = await Upsert.init(db.Users, payload, opt, options);

      // Send Invitation email if checked
      if (payload.sendInviteEmail) mailer.SendAccount(payload.email, payload);

      return data;
    }

    static async edit({ id }, payload) {
      // Check if email exists (changed email)
      if (payload.isEmailChanged) {
        const user = await db.Users.findOne({ where: { email: payload.email } });
        if (user) throw new ErrorException(409, 'Email already exists!');
      }

      // Delete password property if it's empty
      if (payload.hasOwnProperty('password')) if (payload.password.trim() === '') delete payload.password;

      if (!payload.isSelf && !payload.hasOwnProperty('active')) {
        // Create bulk for Business Unit
        await db.UserBusinessUnits.destroy({ where: { user_id: id } }).then(async (data) => {
          return await db.UserBusinessUnits.bulkCreate(payload.UserBusinessUnit);
        });
      }

      // Update user
      const user = await Upsert.init(db.Users, Object.assign(payload, { id }), {}, options);

      // If user update is self then resend token
      if (payload.isSelf) {
        const payload_token = UserController.payload(user, payload.rememberMe, payload.fingerprint);
        const token = await UserController.createToken(payload_token, payload.rememberMe);

        return {
          token,
          user: payload_token.user,
          passwordchanged: !!payload.password,
        };
      }

      // Send Invitation email if checked
      if (payload.sendInviteEmail) mailer.SendAccount(payload.email, payload);

      return user;
    }

    static async sendEmail(payload) {
      const [err, password, hash] = await Password.hash(Password.generate());
      payload = { ...payload, password };

      // Send email to newly created user
      mailer.SendAccount(payload.email, payload);

      return await UserController.edit(payload.id, payload);
    }

    static async destroy({ ids }) {
      return await !!db.Users.destroy({ where: { id: ids } });
    }
  };
};
