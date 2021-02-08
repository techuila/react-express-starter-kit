const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { FROM_EMAIL, FROM_EMAIL_PASS, COMPANY_NAME } = require('../enums/environment');

const template = require('./template');
const { Looper } = require('../utils');

const directory = path.resolve(__dirname + '/contents');

const mail = {};

// Loop all files in contents folder and store it on an object
Looper.init(directory, (file, fileName) => {
  mail[fileName] = async (email, data) => {
    try {
      let transporter = nodemailer.createTransport({
        host: 'mail.cyon.ch',
        port: 587,
        auth: {
          user: FROM_EMAIL,
          pass: FROM_EMAIL_PASS,
        },
        secure: false,
        tls: { rejectUnauthorized: false },
        debug: true,
      });

      // Fetch contents and paste it on the template email
      const { intro, content, subject } = require(path.join(directory, file))(data);

      const output = template(intro, content);

      const info = await transporter.sendMail({
        from: `"${COMPANY_NAME}" <${FROM_EMAIL}>`,
        to: email,
        subject: subject,
        html: output,
        attachments: [
          {
            filename: 'logo.png',
            path: path.resolve(__dirname, './assets/logo.png'),
            cid: 'logo',
          },
        ],
      });

      log(`[Mail Sent] \n${JSON.stringify(info)}`);

      return info;
    } catch (error) {
      log(`[Mail Error] \nError Name: ${error.name}\nError Message: ${error.message}`);
      throw error;
    }
  };
});

// Mail logs
function log(data) {
  fs.writeFile(path.resolve(__dirname + '/mail.logs'), `[${new Date()}]\n${data}`, { flag: 'a+' }, (err) => {
    if (err) console.log(err);

    console.log('Mail Logged');
  });
}

module.exports = mail;
