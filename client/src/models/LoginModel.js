import { types, flow, getRoot } from 'mobx-state-tree';
import axios from 'axios';

export default types
  .model('LoginModel', {
    id: types.optional(types.number, 0),
    token: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    firstName: types.optional(types.string, ''),
    lastName: types.optional(types.string, ''),
    phoneNumber: types.optional(types.string, ''),
    rememberMe: types.optional(types.number, 0),
    fingerprint: types.optional(types.string, ''),
    user_type_id: types.optional(types.number, 0),
    type: types.optional(types.string, ''),
    isLoggedIn: types.optional(types.boolean, false),
    active: types.optional(types.boolean, true),
  })

  .views((self) => ({
    get standard_user_restriction() {
      return self.user_type_id === 2 ? self.id : '';
    },
  }))
  .actions((self) => ({
    setId(id) {
      self.id = id;
    },

    setStatus(statusId) {
      self.isLoggedIn = statusId;
    },

    setToken(token) {
      self.token = token;
    },

    setEmail(email) {
      self.email = email;
    },

    setFirstName(firstName) {
      self.firstName = firstName;
    },

    setLastName(lastName) {
      self.lastName = lastName;
    },

    setUserTypeID(user_type_id) {
      self.user_type_id = user_type_id;
    },

    setType(type) {
      self.type = type;
    },

    setRememberMe(rememberMe) {
      self.rememberMe = rememberMe;
    },

    setFingerprint(fingerprint) {
      self.fingerprint = fingerprint;
    },

    setActive(trueorfalse) {
      self.active = trueorfalse;
    },

    setPhoneNumber(value) {
      self.phoneNumber = value;
    },

    login: flow(function* (email, password, rememberMe, fingerprint, pin) {
      try {
      } catch (err) {}

      const { data: result, status: responseStatus, statusText } = yield axios
        .post('/api/auth', {
          email,
          password,
          rememberMe,
          fingerprint,
        })

        .then((response) => response)
        .catch((error) => error.response);

      if (responseStatus != 200) return false;

      if (responseStatus == 200 && result.suspended) return { success: false, suspended: true };

      if (result.new) {
        return { success: false, newDevice: true };
      }
      if (result.token) {
        axios.defaults.headers.common['X-Auth-Token'] = result.token;
        localStorage.removeItem('token');

        localStorage.setItem('token', result.token);
        console.log(result);
        self.setToken(result.token);
        self.setEmail(result.user.email);
        self.setId(parseInt(result.user.id));
        self.setFirstName(result.user.firstName);
        self.setLastName(result.user.lastName);
        self.setType(result.user.type);
        self.setFingerprint(result.user.fingerprint);
        self.setRememberMe(result.user.rememberMe);
        self.setUserTypeID(result.user.user_type_id);
        self.setType(result.user.type);
        self.setPhoneNumber(result.user.phoneNumber);

        self.setStatus(true);

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true };
      } else return { success: false };
    }),

    logout: flow(function* () {
      localStorage.clear('token');
      localStorage.clear('user');

      self.setToken('');
      self.setEmail('');
      self.setId(0);
      self.setFirstName('');
      self.setLastName('');

      self.setStatus(false);

      self.setPhoneNumber('');
      self.setUserTypeID(0);
      self.setType('');
      self.setRememberMe(0);
      self.setFingerprint('');

      const store = getRoot(self);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return true;
    }),

    update: flow(function* (password, email, firstName, lastName, phoneNumber, position, companyId, portfoliosWithAccess = []) {
      const { data: result, status: responseStatus, statusText } = yield axios
        .put(`/api/users/${self.id}`, {
          password,
          email,
          firstName,
          lastName,
          phoneNumber,
        })

        .then((response) => response)
        .catch((error) => error.response);

      //setTimeout(function(){
      // self.status =isNaN(result)?1:result;
      if (responseStatus != 200) {
        console.log(statusText);
        return false;
      }
      var localUser = JSON.parse(localStorage.getItem('user'));
      if (self.id == localUser.id) {
        if (result.token) {
          self.setToken(result.token);
          axios.defaults.headers.common['X-Auth-Token'] = result.token;
          localStorage.removeItem('token');
          localStorage.setItem('token', result.token);
        }
      }
      if (result.passwordchanged) {
        self.logout();
        return true;
      }
      if (result.user) {
        if (self.id == localUser.id) {
          //self.setEmail(result.user.email);
          //self.setId(parseInt(result.user.id));
          self.setFirstName(result.user.firstName);
          self.setLastName(result.user.lastName);
          // self.setCompanyId(result.user.companyId);
          self.setPhoneNumber(result.user.phoneNumber);
          //self.setStatus(true);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        return true;
      } else return false;
    }),
    updateProfile: flow(function* (email, password, isEmailChanged) {
      try {
        console.log(password);
        const { data: result, status: responseStatus, statusText } = yield axios
          .put(`/api/users/${self.id}`, {
            email,
            password,
            fingerprint: self.fingerprint,
            rememberMe: self.rememberMe,
            isSelf: true,
            isEmailChanged,
          })
          .then((response) => response)
          .catch((error) => {
            throw error;
          });

        //setTimeout(function(){
        // self.status =isNaN(result)?1:result;
        if (responseStatus != 200) {
          console.log(statusText);
          return false;
        }
        var localUser = JSON.parse(localStorage.getItem('user'));
        if (self.id == localUser.id) {
          if (result.token) {
            self.setToken(result.token);
            axios.defaults.headers.common['X-Auth-Token'] = result.token;
            localStorage.removeItem('token');
            localStorage.setItem('token', result.token);
          }
        }
        if (result.passwordchanged) {
          self.logout();
          return true;
        }
        if (result.user) {
          if (self.id == localUser.id) {
            //self.setEmail(result.user.email);
            //self.setId(parseInt(result.user.id));
            self.setFirstName(result.user.firstName);
            self.setLastName(result.user.lastName);
            // self.setCompanyId(result.user.companyId);
            self.setPhoneNumber(result.user.phoneNumber);
            // self.setIsAdmin(result.user.isAdmin === "1");
            //self.setStatus(true);
            localStorage.setItem('user', JSON.stringify(result.user));
          }
          return true;
        } else return false;
      } catch (err) {
        throw err;
      }
    }),

    resetPassword: flow(function* (email) {
      //  return true;

      const { data: result, status: responseStatus, statusText } = yield axios
        .post('/api/auth/resetpassword', {
          email,
        })

        .then((response) => response)
        .catch((error) => error.response);

      //setTimeout(function(){
      // self.status =isNaN(result)?1:result;
      if (responseStatus != 200) return false;

      if (result.success) {
        return true;
      } else return false;
    }),

    loginOTP: flow(function* (email, password, rememberMe, fingerprint, pin) {
      const { data: result, status: responseStatus, statusText } = yield axios
        .post('/api/auth/logindevice', {
          email,
          password,
          rememberMe,
          fingerprint,
          pin,
        })

        .then((response) => response)
        .catch((error) => error.response);

      //setTimeout(function(){
      // self.status =isNaN(result)?1:result;
      if (responseStatus != 200) return false;

      if (result.token) {
        axios.defaults.headers.common['X-Auth-Token'] = result.token;
        localStorage.removeItem('token');

        localStorage.setItem('token', result.token);
        console.log(result);
        self.setToken(result.token);
        self.setEmail(result.user.email);
        self.setId(parseInt(result.user.id));
        self.setFirstName(result.user.firstName);
        self.setLastName(result.user.lastName);
        self.setType(result.user.type);
        self.setFingerprint(result.user.fingerprint);
        self.setRememberMe(result.user.rememberMe);
        self.setUserTypeID(result.user.user_type_id);
        self.setType(result.user.type);
        self.setPhoneNumber(result.user.phoneNumber);

        self.setStatus(true);

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true };
      } else return { success: false };
    }),
  }));
