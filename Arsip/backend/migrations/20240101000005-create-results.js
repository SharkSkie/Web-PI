'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questionnaire_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questionnaires',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      internal_score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      external_score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      conclusion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('results');
  }
};
