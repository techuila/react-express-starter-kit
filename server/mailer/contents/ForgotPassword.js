const { APP_NAME, HOST } = require('../../enums/environment');

module.exports = (data) => {
  return {
    subject: `Anforderung zum Zurücksetzen des Passworts`,
    intro: `Guten Tag ${data.first_name} ${data.last_name}`,
    content: `
      <p>Dies ist ihr temporäres Passwort:  ${data.password}</p> 
      <p>Bitte ändern Sie dieses umgehend nach dem Login ins ${APP_NAME}.</p> <br>

      <a href="${HOST}">licken Sie hier, um sich anzumelden</a>
    `,
  };
};
