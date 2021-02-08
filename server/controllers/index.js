const { Looper } = require('../utils');
const path = require('path');
const db = require('../models');
const controller = {};

Looper.init(__dirname, (file, fileName) => {
  controller[fileName] = new require(path.join(__dirname, file))(db);
});

module.exports = controller;
