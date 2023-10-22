"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("token", {
      id: {
        type: Sequelize.UUIDV4,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userToken: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("token")
  }
}
