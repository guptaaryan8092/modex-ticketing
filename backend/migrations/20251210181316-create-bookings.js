'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      show_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Shows',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      seats_requested: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seats_assigned: {
        type: Sequelize.JSONB, // Using JSONB for Postgres
        allowNull: true // Can be null if status is FAILED or PENDING initially
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};
