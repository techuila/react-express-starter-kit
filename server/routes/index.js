const path = require('path');
const cors = require('cors');
const { Looper } = require('../utils');
const rw = require('../helper/RouterMethodWrapper');
const ErrorHandler = require('../helper/ErrorHandler');

module.exports = class Routes {
  constructor(express, HOST) {
    this.app = express();
    this.express = express;
    this.HOST = HOST;

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  initializeMiddleware() {
    // Cors
    this.app.use(cors({ origin: this.HOST }));

    // BodyparserMiddleware
    this.app.use(this.express.json());
    this.app.use(this.express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // Use looper (custom script) to loop the files on a folder to initialize the routes for this server
    Looper.init(__dirname, (file, fileName) => {
      this.app.use(`/api/${fileName}`, require(path.join(__dirname, file))(this.express.Router(), rw));
    });

    // Error Handler Catches on "next()"
    this.app.use(ErrorHandler);
  }
};
