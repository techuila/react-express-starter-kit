const { COMPANY_NAME, COMPANY_ADDRESS, COMPANY_NUMBER } = require('../enums/environment');

module.exports = (intro, content) => {
  return `
    <body style="margin: 0; padding: 0; width: 100%; height: 100%; background-color: #f0f0f0 !important;" bgcolor="#f0f0f0">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0px;margin:0px;">
        <tr>
          <td style="padding:0px;margin:0px;width:100%">
            <div style="display: flex; justify-content: center; flex-direction: column; margin: 0; color: #70787d; margin: 50px 0 100px 0;">
              <div style="text-align: center">
                  <h1 style="color: #c1202e; text-decoration: none;"> 
                      <span style="display: flex; justify-content: center; align-items: center;"><img src="cid:logo" alt="logo" style="height: 80px;" height=80></span> 
                  </h1>
              </div>
                
              <table cellpadding="0" cellspacing="0" border="0" style="padding:0px;margin:0px;width:100%;">
                <tr><td colspan="3" style="padding:0px;margin:0px;font-size:20px;height:20px;" height="20">&nbsp;</td></tr>
                <tr>
                  <td style="padding:0px;margin:0px;">&nbsp;</td>
                  <td style="padding:0px; font-family: Arial !important; background-color: #ffffff; padding: 32px; margin: 10px auto; border: 1px solid #e0e0e0; border-radius: 3px;" width="600">

                    <div style="display: flex;flex-direction: column;">
                      <div style="font-family: Arial !important;">
                        <font face="Helvetica">
                          <h4 style="margin-bottom: 25px">${intro}</h4>

                          <!-- ======== BODY CONTENT ======== -->
                          ${content}
                          <!-- ======== BODY CONTENT END ======== -->

                          </div>
                          <br />
                        </font>
                    </div> 

                  </td>
                  <td style="padding:0px;margin:0px;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:0px;margin:0px;">&nbsp;</td>
                  <td  style="margin: 10px auto; padding: 12px; color: #777777; font-family: Arial !important; font-size: 12px; text-align: center" width="600">
                    <p style="margin-top: 10px; margin-bottom: 10px;">@ ${new Date().getFullYear()} ${COMPANY_NAME} All rights reserved.</p>
                    <p style="margin-top: 10px; margin-bottom: 10px;">${COMPANY_ADDRESS}</p>
                    <p style="margin-top: 10px; margin-bottom: 10px;">${COMPANY_NUMBER}</p>
                  </td>
                </tr>
                <tr><td colspan="3" style="padding:0px;margin:0px;font-size:20px;height:20px;" height="20">&nbsp;</td></tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </body>
  `;
};
