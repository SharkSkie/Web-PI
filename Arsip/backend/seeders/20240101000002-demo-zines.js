'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('zines', null, {});

    // Dynamically find the demo user ID
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'user@demo.com' LIMIT 1"
    );

    if (users.length === 0) {
      console.log('Skipping zine seed: Demo user not found');
      return;
    }

    const demoUserId = users[0].id;

    await queryInterface.bulkInsert('zines', [
      {
        user_id: demoUserId,
        title: 'Navigating Anxiety in a Digital World',
        description: 'A deeply personal reflection on managing screen time and finding peace offline.',
        file_path: 'demo-zine-1.pdf',
        status: 'approved',
        created_at: new Date()
      },
      {
        user_id: demoUserId,
        title: 'Colors of my Mind',
        description: 'A visual journal of my emotional landscape throughout the winter.',
        file_path: 'demo-zine-2.pdf',
        status: 'pending',
        created_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('zines', null, {});
  }
};
