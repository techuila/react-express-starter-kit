const ValidationController = require('./auth/ValidationController');

module.exports = (db) =>
  class AuthenticateController extends ValidationController {
    static async authenticateUser(payload) {
      const user = await AuthenticateController.validate(payload, db);
      const data = await AuthenticateController.validateDevice(payload, user, db, true);

      return data;
    }

    static async loginDevice(payload) {
      const user = await AuthenticateController.validate(payload, db);
      const data = await AuthenticateController.verifyPin(payload, user, db);

      return data;
    }

    static async authenticateToken(payload) {
      const decode = await AuthenticateController.verifyToken(payload);
      const user = await AuthenticateController.validate(decode.user, db, true);
      const data = await AuthenticateController.validateDevice(decode.user, user, db, false);

      return data;
    }

    static async resetPassword(payload) {
      const user = await AuthenticateController.validate(payload, db, true);
      const data = await AuthenticateController.sendResetPassword(payload, user);

      return data;
    }
  };
