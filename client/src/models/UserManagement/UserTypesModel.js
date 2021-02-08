import { types } from 'mobx-state-tree';

const UserTypesModel = types
  .model('UserTypesModel', {
    id: types.optional(types.number, 0),
    name: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setName(name) {
      self.name = name;
    },
  }));

export default UserTypesModel;
