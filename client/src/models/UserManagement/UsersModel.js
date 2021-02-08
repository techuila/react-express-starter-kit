import { types, flow, getRoot, cast } from 'mobx-state-tree';
import UserTypesModel from './UserTypesModel';
import axios from 'axios';

const UsersModel = types
  .model('UsersModel', {
    id: types.optional(types.number, 0),
    email: types.optional(types.string, ''),
    first_name: types.optional(types.string, ''),
    last_name: types.optional(types.string, ''),
    user_type_id: types.optional(types.number, 0),
    phoneNumber: types.optional(types.string, ''),
    Type: types.optional(UserTypesModel, {}),
    active: types.optional(types.boolean, true),
  })
  .views((self) => ({
    get name() {
      return self.first_name + ' ' + self.last_name;
    },
  }))
  .actions((self) => ({
    SET_STATE(values) {
      console.log(self);
      self = {
        ...self,
        ...values,
      };
    },

    UPDATE: flow(function* (id, values) {
      const { data } = yield axios.put(`/api/users/${id}`, values);
      self = Object.assign(self, data);
    }),
  }));

export default UsersModel;
