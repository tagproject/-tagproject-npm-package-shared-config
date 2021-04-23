/* eslint-disable */
/* prettier-ignore */
module.exports = [
  [
    "prepare:husky",
    "husky install"
  ],
  [
    "prepare:config",
    "ts-package-shared-config"
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
    "test",
    "jest"
  ],
  [
    "generate:docs",
    "rimraf docs/api && typedoc"
  ],
  [
    "generate:changelog",
    "changelog generate --bump"
  ],
  [
    "generate:ghinfo",
    "ghinfo generate -d media -t utils"
  ],
  [
    "generate",
    "npm-run-all generate:changelog generate:docs generate:ghinfo"
  ],
  [
    "build",
    "rimraf lib && tsc --extendedDiagnostics"
  ],
  [
    "release",
    "npm-run-all prepare check test build generate"
  ]
]