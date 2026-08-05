'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Hash password before inserting
    // Clean up first to prevent unique constraint errors
    await queryInterface.bulkDelete('users', {
      email: ['user@demo.com', 'admin@demo.com', 'rian@gmail.com', 'admin@mindzine.com']
    }, {});

    const salt = await bcrypt.genSalt(10);
    const demoHashed = await bcrypt.hash('password', salt);
    const rianHashed = await bcrypt.hash('Password123', salt);
    const adminHashed = await bcrypt.hash('Admin123', salt);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Demo User',
        email: 'user@demo.com',
        password: demoHashed,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Admin Manager',
        email: 'admin@demo.com',
        password: demoHashed,
        role: 'admin',
        created_at: new Date()
      },
      {
        name: 'Rian',
        email: 'rian@gmail.com',
        password: rianHashed,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Admin',
        email: 'admin@mindzine.com',
        password: adminHashed,
        role: 'admin',
        created_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
