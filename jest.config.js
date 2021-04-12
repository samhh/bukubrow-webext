const tsconfig = require("./tsconfig.json")
const { pathsToModuleNameMapper } = require("ts-jest/utils")

module.exports = {
  transform: {
    "\\.tsx?$": "ts-jest",
  },
  testRegex: "^.+\\.test.tsx?$",
  moduleFileExtensions: ["js", "ts", "tsx"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
}
