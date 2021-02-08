require('custom-env').env(true);
require('custom-env').env(process.env.NODE_ENV);

let env = {
  APP_NAME: process.env.APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_EMAIL_PASS: process.env.FROM_EMAIL_PASS,
  DEV_EMAIL: process.env.DEV_EMAIL,
  COMPANY_NAME: process.env.COMPANY_NAME,
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS,
  COMPANY_NUMBER: process.env.COMPANY_NUMBER,
};

env = {
  ...env,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
};

module.exports = Object.freeze(env);
