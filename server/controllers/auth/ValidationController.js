const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomize = require('randomatic');
const mailer = require('../../mailer');
const JWTController = require('./JWTController');
const ErrorException = require('../../helper/ErrorException');
const { Password } = require('../../utils');

module.exports = class ValidationController extends (
  JWTController
) {
  /**
   * @FUNCTIONS
   * @Validation
   * @desc
   * Check for:
   * 1. empty fields
   * 2. user exists
   * 3. password validation
   */
  static payload(user, rememberMe, fingerprint) {
    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        rememberMe: rememberMe,
        user_type_id: user.Type.id,
        type: user.Type.name,
        fingerprint,
      },
    };
  }

  static createToken(payload, rememberMe) {
    return jwt.sign(payload, ValidationController.keys.private, ValidationController.signOptions(rememberMe));
  }

  static async validate(body, db, isOnlyEmail = false) {
    // Check for empty fields
    Object.keys(body)
      .filter((property) => property != 'rememberMe')
      .forEach((property) => {
        if (body[property] === '' || body[property] === null) throw new ErrorException(400, `The field '${property}' is undefined`, { code: 0 });
      });

    return await db.Users.findOne({ include: [{ association: db.Users.Type }], where: { email: body.email } }).then(async (user) => {
      // Check if user doesn't exists
      if (!user) {
        throw new ErrorException(400, 'User does not exist', { code: 1 });
      }

      // Check if user is suspended
      if (user.active == false) {
        throw new ErrorException(401, 'User account suspended', { code: 3 });
      }

      if (!isOnlyEmail) {
        // Check if inputted password is correct
        const isMatch = await bcrypt.compare(body.password, user.password);

        if (!isMatch) {
          throw new ErrorException(400, 'Incorrect password', { code: 2 });
        }
      }

      return user;
    });
  }

  static async validateDevice(body, user, db, isSendEmail) {
    const payload = ValidationController.payload(user, body.rememberMe, body.fingerprint);

    if (!user.isEmailAuthenticate || (await db.UserFingerprints.findOne({ where: { user_id: user.id, fingerprint: body.fingerprint } }))) {
      const token = ValidationController.createToken(payload, body.rememberMe);

      return { ...payload, token };
    } else {
      //This is a new device login so request for pin code.
      var verification_token = randomize('0', 6);
      user.verification_token = verification_token;

      console.log('New device detected! \nVerification Token: ' + verification_token);
      const res = await user.save();

      if (res) {
        if (isSendEmail) {
          // Send Email (Verification Token)
          const data = { user, verification_token };
          mailer.DeviceRegistration(user.email, data);
        }

        return { ...payload, new: true };
      } else {
        throw new ErrorException(500, 'Could not generate pin');
      }
    }
  }

  static async verifyPin(body, user, db) {
    const payload = ValidationController.payload(user, body.rememberMe, body.fingerprint);

    if (user.verification_token === body.pin) {
      const token = ValidationController.createToken(payload, body.rememberMe);

      // Save device fingerprint on database and reset verification token of user
      await db.UserFingerprints.create({ user_id: user.id, fingerprint: body.fingerprint });
      user.verification_token = '';
      await user.save();

      return { ...payload, token };
    } else {
      throw new ErrorException(400, 'Invalid Verification Token!');
    }
  }

  static async verifyToken(body) {
    const { token } = body;
    if (!token) throw new ErrorException(401, 'Unauthorized');

    // Verify token
    try {
      return await jwt.verify(token, ValidationController.keys.public, ValidationController.signOptions(body.rememberMe));
    } catch (e) {
      throw new ErrorException(400, 'Token is not valid');
    }
  }

  static async sendResetPassword(body, user) {
    const [err, password, hash] = await Password.hash(Password.generate());

    if (err) throw err;

    user.password = password;
    return user
      .save()
      .then((success) => {
        if (success) {
          // Send Email
          mailer.ForgotPassword(body.email, { first_name: user.first_name, last_name: user.last_name, password });
          return { success: true, msg: 'Request for reset password sent.' };
        }
      })
      .catch((err) => {
        throw err;
      });
  }
};
