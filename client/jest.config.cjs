const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: "jsdom",

  transform: {
    ...tsJestTransformCfg,
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  testMatch: ["<rootDir>/src/tests/**/*.test.tsx"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.app.json",
    },
  },
};