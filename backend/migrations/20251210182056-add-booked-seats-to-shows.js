'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Shows', 'booked_seats', {
      type: Sequelize.JSONB, // Using JSONB for array of integers to be safe/flexible or specialized Array(Integer)
      // Postgres supports ARRAY(INTEGER), but JSONB is also fine. Let's strictly stick to what user prompt implied or standard usage.
      // User said "seats table or booked_seats column per show... (json or int array)".
      // Let's use ARRAY(INTEGER) for Postgres potential.
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
      defaultValue: []
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Shows', 'booked_seats');
  }
};
