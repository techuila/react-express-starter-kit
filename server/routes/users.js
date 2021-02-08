const { UserController } = require('../controllers');

module.exports = (router, rw) => {
  router.get('/', rw(UserController.index));

  router.get('/types', rw(UserController.showTypes));

  router.get('/:id', rw(UserController.show));

  router.post('/', rw(UserController.create));

  router.post('/sendEmail', rw(UserController.sendEmail));

  router.put('/:id', rw(UserController.edit));

  router.delete('/', rw(UserController.destroy));

  return router;
};
