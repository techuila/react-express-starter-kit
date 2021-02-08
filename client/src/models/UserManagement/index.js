import { types, flow, cast } from 'mobx-state-tree';
import UserTypesModel from './UserTypesModel';
import UsersModel from './UsersModel';
import axios from 'axios';

export default types
  .model('UsersState', {
    state: types.optional(types.array(UsersModel), []),
    userTypes: types.optional(types.array(UserTypesModel), []),
    updatedAt: types.optional(types.string, ''),
  })
  .actions((self) => ({
    FETCH_DATA: flow(function* () {
      try {
        const { data } = yield axios.get('/api/users');
        self.state = cast(data);
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

    SEND_EMAIL: flow(function* (payload) {
      yield axios.post('/api/users/sendEmail', payload);
    }),

    ADD: flow(function* (payload) {
      try {
        const { data } = yield axios.post('/api/users', payload);
        self.state.push(data);
      } catch (err) {
        throw err;
      }

      return true;
    }),

    UPDATE: flow(function* (id, values) {
      try {
        const { data } = yield axios.put(`/api/users/${id}`, values);
        self.state.splice(
          self.state.findIndex((data) => data.id === id),
          1,
          data
        );

        return true;
      } catch (err) {
        throw err;
      }
    }),

    DELETE: flow(function* (id) {
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
  .views((self) => ({}));
