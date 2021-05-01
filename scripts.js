/* eslint-disable */
/* prettier-ignore */
module.exports = [
  [
    "prepare:config",
    "ts-package-shared-config"
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
    "changelog generate --bump"
  ],
  [
    "generate:docs",
    "rimraf docs/api && typedoc"
  ],
  [
    "generate:ghinfo",
    "ghinfo generate -d media -t utils"
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
    "npm-run-all prepare check test build generate"
  ]
]