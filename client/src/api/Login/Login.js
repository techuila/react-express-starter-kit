export const onLoginFinishAPI = (values, t, setMessage, setEmail, setpassword, setremember, setIsOTPVisible, user, DeviceFingerPrint, history) => {
  //console.log("Success:", values); //{email: "valerie", password: "12345678$", remember: true}
  setMessage(t('Logging in...'));
  user.login(values.email, values.password, values.remember ? 1 : 0, DeviceFingerPrint).then((result) => {
    if (result.success === true) {
      history.push('/');
    } else {
      if (result.suspended) {
        setMessage(t('Your account is suspended.'));
        return;
      }
      if (result.newDevice === true) {
        setEmail(values.email);
        setpassword(values.password);
        setremember(values.remember ? 1 : 0);

        setMessage(t('You have logged-in using a new device. We have sent an email message containing a  pin code to verify your identity.'));
        setIsOTPVisible(true);
      } else setMessage(t('Invalid email or password.'));
    }
  });
};
