const { resolve } = require("path")

module.exports = {
  rootDir: resolve(__dirname),
  displayName: "root-tests",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  testEnvironment: "node",
  clearMocks: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/test/config/test-setup.ts"]
}
