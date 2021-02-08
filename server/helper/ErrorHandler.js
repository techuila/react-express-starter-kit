const { NODE_ENV, DEV_EMAIL } = require('../enums/environment');
const mailer = require('../mailer');

module.exports = async (err, req, res, next) => {
  console.log(err);

  try {
    // If error received is code error, notify developer (only for development and production environments)
    if (err.name !== undefined && err.name !== null && NODE_ENV !== 'localhost') {
      await mailer.ServerError(DEV_EMAIL, err);

      res.status(500).json({ message: 'An internal error has occurred, our developers have already been notified.' });
    } else {
      // Or else, just send thrown error from Error Exception class
      res.status(err.status).json({ message: err.message, ...err.additional });
    }
  } catch (err) {
    console.log('Error inside try catch block on ErrorHandler js file.');
    // console.log(err);
    // Return this error if failed to notify developer (mail sending error)
    res.status(500).json({ message: 'An internal error has occurred, please contact technical support.' });
  }
};
