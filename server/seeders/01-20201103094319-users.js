'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'sample@email.com',
          password: '$2a$10$3itom7BCgducXVGACTDZeumpRJ25kf0htD7OxZ/IGJfBzI3QY0RRW',
          user_type_id: 1,
          phone_number: '09152401964',
          active: true,
          isEmailAuthenticate: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
