import { types, flow, cast } from 'mobx-state-tree';
import axios from 'axios';
import LoginModel from './LoginModel';
import UsersModel from './UserManagement';
import UserTypesModel from './UserManagement/UserTypesModel';

const RootStore = types
  .model('RootStore', {
    login: types.optional(LoginModel, {}),
    users: types.optional(UsersModel, {}),
  })
  .views((self) => ({
    get availableAccounts() {
      return this.accounts.state.filter((e) => !this.groups.state.reduce((a, b) => a.concat(b.Accounts.toJSON()), []).find((s) => s.id === e.id));
    },

    get hasRemainingEmployees() {
      return this.employees.state.filter((e) => !this.timelogs.state.find((s) => s.employee_id === e.id)).length !== 0;
    },

    get getNextEmployee() {
      return this.employees.state.filter((e) => !this.timelogs.state.find((s) => s.employee_id === e.id))[0];
    },

    get timelogsCondition() {
      return (self.timelogs.currentStatus !== 1 && self.login.user_type_id === 2) || self.timelogs.currentStatus === 3;
    },
  }))
  .actions((self) => ({
    setLanguage(locale) {
      self.language = locale;
      localStorage.setItem('lang', locale);
    },

    setLocale(locale) {
      localStorage.setItem('locale', locale);
    },

    initialize: flow(function* (name) {
      // This should check if the currently stored login data is still valid.
      var token = localStorage.getItem('token');
      var rememberMe = !!localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).rememberMe : 0;
      axios.defaults.headers.common['X-Auth-Token'] = token;
      // if there is a token, validate from server if not expired..

      const { data: result, status: responseStatus, statusText } = yield axios
        .post('/api/auth/token', { token, rememberMe })

        .then((response) => response)
        .catch((error) => error.response);

      if (responseStatus != 200) {
        localStorage.removeItem('token');
        token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('company');
      } else {
        localStorage.setItem('token', result.token);
      }

      var user = token ? JSON.parse(localStorage.getItem('user')) : {};
      console.log('🚀 ~ file: RootStore.js ~ line 63 ~ //setTimeout ~ user', user);

      self.login = LoginModel.create(
        token
          ? {
            id: user.id,
            token: token,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,

            user_type_id: user.user_type_id,
            fingerprint: user.fingerprint,
            type: user.type,
            phoneNumber: user.phoneNumber,
            rememberMe: user.rememberMe,

            isLoggedIn: true,
          }
          : {
            id: 0,
            token: localStorage.getItem('token') || '',
            email: '',
            firstName: '',
            lastName: '',

            user_type_id: 0,
            fingerprint: '',
            type: '',
            phoneNumber: '',
            rememberMe: 0,
            isLoggedIn: localStorage.getItem('token') ? true : false,
          }
      );
    }),

    FETCH_USERS: flow(function* () {
      try {
        const { data } = yield axios.get('/api/users');
        self.users = cast(data);
      } catch (err) {
        throw err;
      }
      return true;
    }),

    FETCH_USER_TYPES: flow(function* () {
      try {
        const { data } = yield axios.get('/api/users/types');
        self.userTypes = cast(data);
      } catch (err) {
        throw err;
      }
      return true;
    }),

    CREATE_USER: flow(function* (payload) {
      try {
        const { data } = yield axios.post('/api/users', payload);
        self.users.push(data);
      } catch (err) {
        throw err;
      }

      return true;
    }),

    UPDATE_USER: flow(function* (id, values) {
      try {
        const { data } = yield axios.put(`/api/users/${id}`, values);
        self.users.splice(
          self.users.findIndex((data) => data.id === id),
          1,
          data
        );

        return true;
      } catch (err) {
        throw err;
      }
    }),

    DELETE_USER: flow(function* (id) {
      try {
        const { result } = yield axios.delete('/api/users', { data: { ids: [id] } });
        self.users.splice(
          self.users.findIndex((data) => data.id === id),
          1
        );

        return true;
      } catch (err) {
        throw err;
      }
    }),
  }))

export default RootStore;
