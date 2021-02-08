const express = require('express');
const router = express.Router();

/**
 * This is a catch wrapper to lessen code on wrapping try and catch block on
 * every method on a controller
 */

module.exports = (fn) => (req, res, next) => {
  const payload = req.route.path.includes(':') ? [req.params, req.body] : [req.body];

  fn(...payload)
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};
