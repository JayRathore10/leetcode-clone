const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"], 
};