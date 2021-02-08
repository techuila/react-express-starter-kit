const { COMPANY_NAME, HOST, APP_NAME } = require('../../enums/environment');

module.exports = (data) => {
  return {
    subject: `Kontoregistrierung`,
    intro: `Guten Tag ${data.first_name} ${data.last_name}`,
    content: `
      <p>Ihr Konto für ${COMPANY_NAME} ${APP_NAME} wurde erfolgreich erstellt.</p>
      <p>Hier sind Ihre Kontoanmeldeinformationen: </p>
      <b>E-mail:</b> ${data.email} <br> 
      <b>Passwort</b> ${data.password} <br> <br>

      <a href="${HOST}">Klicken Sie hier, um sich anzumelden</a>
    `,
  };
};
