/* eslint-disable */
/* prettier-ignore */
module.exports = [
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
    "check:lint",
    "rimraf coverage && eslint \"src/**\" --ext .ts"
  ],
  [
    "check:spell",
    "cspell -c .vscode/cspell.json --no-summary \"README.md\" \"src/**/*.ts\""
  ],
  [
    "check",
    "npm-run-all check:*"
  ],
  [
    "test:jest",
    "node --harmony node_modules/.bin/jest"
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
    "generate:docs",
    "rimraf docs/api && typedoc"
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
    "rimraf lib && tsc --extendedDiagnostics --project tsconfig.build.json"
  ],
  [
    "build",
    "npm-run-all build:*"
  ],
  [
    "release",
    "npm-run-all prepare check test build generate"
  ]
]