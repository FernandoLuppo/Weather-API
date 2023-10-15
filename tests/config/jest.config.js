const { resolve } = require("path")
const root = resolve(__dirname, "../../jest.config.js")
const rootConfig = require(`${root}/jest.config.js`)

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    displayName: "tests",
    setupFilesAfterEnv: ["<rootDir>/test/test-setup.ts"],
    testMatch: ["<rootDir>/test/**/*.test.ts"],
    preset: "@shelf/jest-mongodb"
  }
}
