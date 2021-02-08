const lp = require('./Looper');
const path = require('path');
const utils = {};

lp.init(__dirname, (file, fileName) => {
  utils[fileName] = new require(path.join(__dirname, file));
});

module.exports = utils;
