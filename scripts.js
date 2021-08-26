/* eslint-disable */
/* prettier-ignore */
export default [
  [
    "prepare:config",
    "node --experimental-specifier-resolution=node node_modules/.bin/ts-package-shared-config"
  ],
  [
    "prepare:husky",
    "husky install"
  ],
  [
    "prepare",
    "npm-run-all prepare:*"
  ],
  [
    "lint:eslint",
    "rimraf coverage && eslint \"src/**\" --ext .ts"
  ],
  [
    "lint:spell",
    "cspell -c .vscode/cspell.json --no-summary \"README.md\" \"src/**/*.ts\""
  ],
  [
    "lint",
    "npm-run-all lint:*"
  ],
  [
    "test:jest",
    "node --experimental-vm-modules node_modules/.bin/jest"
  ],
  [
    "test",
    "npm-run-all test:*"
  ],
  [
    "generate:changelog",
    "node --experimental-specifier-resolution=node node_modules/.bin/changelog generate --bump"
  ],
  [
    "generate:ghinfo",
    "node --experimental-specifier-resolution=node node_modules/.bin/ghinfo generate -d media -t utils"
  ],
  [
    "generate",
    "npm-run-all generate:*"
  ],
  [
    "build:ts",
    "rimraf lib && tsc --extendedDiagnostics"
  ],
  [
    "build",
    "npm-run-all build:*"
  ],
  [
    "release",
    "npm-run-all prepare lint test build generate"
  ]
]