const fs = require('fs');
const path = require('path');
const { FROM_EMAIL, HOST } = require('../../enums/environment');

module.exports = class JWTController {
  static keys = {
    private: fs.readFileSync(path.resolve(__dirname, '../../keys/private.key'), 'utf8'),
    public: fs.readFileSync(path.resolve(__dirname, '../../keys/public.key'), 'utf8'),
  };

  /*  Modify jwt expiration depending on remember me value
   *  If remember me is true: 2 weeks expiration
   *  otherwise 1 hour
   **/
  static signOptions(rememberMe) {
    return {
      issuer: 'Start Temlpate',
      subject: FROM_EMAIL,
      audience: HOST,
      expiresIn: !!rememberMe ? '14d' : '1h',
      algorithm: 'RS256',
    };
  }
};
