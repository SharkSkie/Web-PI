'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Hash password before inserting
    // Clean up first to prevent unique constraint errors
    await queryInterface.bulkDelete('users', {
      email: ['user@demo.com', 'admin@demo.com']
    }, {});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Demo User',
        email: 'user@demo.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Admin Manager',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
