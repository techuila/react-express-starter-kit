const { AuthenticateController } = require('../controllers');

module.exports = (router, rw) => {
  router.post('/', rw(AuthenticateController.authenticateUser));

  router.post('/logindevice', rw(AuthenticateController.loginDevice));

  router.post('/token', rw(AuthenticateController.authenticateToken));

  router.post('/resetpassword', rw(AuthenticateController.resetPassword));

  return router;
};
