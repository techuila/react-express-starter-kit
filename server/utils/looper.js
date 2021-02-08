const fs = require('fs');

module.exports = class Looper {
  static init(location = null, cb, basename = []) {
    if (location === null) throw new Error('Path is not');
    fs.readdirSync(location)
      .filter((file) => {
        return file.indexOf('.') !== 0 && basename.concat(['index.js']).every((name) => name !== file) && file.slice(-3) === '.js';
      })
      .forEach((file) => {
        cb(file, file.split('.')[0]);
      });
  }
};
