"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("token", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_token: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("token")
  }
}
