<p align="center"><img src="https://cdn.jsdelivr.net/gh/tagproject/art/packages/ts-package-shared-config/banner.svg" alt="Package logo"></p>

<p align="center">
    <a href="https://github.com/tagproject/ts-package-shared-config/actions"><img src="https://github.com/tagproject/ts-package-shared-config/actions/workflows/build.yml/badge.svg" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/@tagproject/ts-package-shared-config"><img alt="npm" src="https://img.shields.io/npm/v/@tagproject/ts-package-shared-config.svg"></a>
    <a href="https://github.com/keindev/standard-shared-config"><img src="https://img.shields.io/badge/standard--shared--config-nodejs%2Bts-green?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAfCAYAAACh+E5kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJQSURBVHgB1VftUcMwDFU4/tMNyAZ0A7IBbBA2CExAmIBjApcJChO0TFA2SJkgMIGRyDNV3TSt26RN353OX/LHUyTZIdoB1tqMZcaS0imBDzxkeWaJWR51SX0HrJ6pdsJyifpdb4loq3v9A+1CaBuWMR0Q502DzuJRFD34Y9z3DXIRNy/QPWKZY27COlM6BtZZHWMJ3CkVa28KZMTJkDpCVLOhs/oL2gMuEhYpxeenPPah9EdczLkvpwZgnQHWnlNLiNQGYiWx5gu6Ehz4m+WNN/2i9Yd75CJmeRDXogbIFxECrqQ2wIvlLBOXaViuYbGQNSQLFSGZyOnulb2wadaGnyoSSeC8GBJkNDf5kloESAhy2gFIIPG2+ufUMtivn/gAEi+Gy4u6FLxh/qer8/xbLq7QlNh6X4mbtr+A3pylDI0Lb43YrmLmXP5v3a4I4ABDRSI4xjB/ghveoj4BCVm37JQADhGDgOA+YJ48TSaoOwKpt27aOQG1WRES3La65WPU3dysTjE8de0Aj8SsKS5sdS9lqCeYI08bU6d8EALYS5OoDW4c3qi2gf7f+4yODfj2DIcqdVzYKnMtEUO7RP2gT/W1AImxXSC3i7R7rfRuMT5G2xzSYzaCDzOyyzDeuNHZx1a3fOdJJwh28fRwwT1QY6Xzf7TvWG6ob/BIGPQ59ymUngRyRn2El6Fy5T7G0zl+JmoC3KRQXyT1xpfiJKIeAemzqBl6U3V5ocZNf4hHg61u223wn4nOqF8IzvF9IxCMkyfQ+i/lnnhlmW6h9+Mqv1SmQhehji4JAAAAAElFTkSuQmCC" alt="Standard Shared Config"></a>
</p>

[Standard Shared Config](https://github.com/keindev/standard-shared-config) for `tagproject` packages with **Node.js** and **TypeScript**

## Install

```console
npm install @tagproject/ts-package-shared-config --save-dev
```

## Usage

- Add `"prepare:config": "ts-package-shared-config"` to `scripts` property in your `package.json`
- Rename your `prepare` scripts to `prepare:[NAME]`
- Add `"prepare": "run-s prepare:*"`
- Run `npm run prepare`

## Configs

## include shared configs:

- [@tagproject/docs-shared-config](https://www.npmjs.com/package/@tagproject/docs-shared-config): `1.x`
- [@tagproject/vscode-shared-config](https://www.npmjs.com/package/@tagproject/vscode-shared-config): `2.x`

### extract actions, hooks and configs:

- `.github/*`
- `.husky/*`
- `.vscode/*`
- `src/__tests__/.eslintrc`
- `src/__tests__/tsconfig.json`
- `.eslintrc`
- `codecov.yml`
- `jest.config.js`
- `tsconfig.json`

### merge files:

- `.husky/commit-msg`
- `.vscode/launch.json`
- `.gitignore`
- `.npmignore`
- `tsconfig.json`

### append to `package.json`:

#### scripts:

- `build` - build shared config
- `build:ts` - transpile `TS` files
- `generate` - run all `generate:*`
- `generate:changelog` - generate changelog
- `generate:ghinfo` - generate `.ghinfo` file
- `lint:eslint` - run `eslint` TS files linting
- `prepare:config` - rebuild local configs
- `prepare:husky` - install husky hooks
- `release` - lint, test, generate changelog and bump package version
- `test` - run all `test:*`
- `test:jest` - run `jest` tests

#### dependencies:

- [@tagproject/docs-shared-config](https://www.npmjs.com/package/@tagproject/docs-shared-config): `3.x`
- [@tagproject/vscode-shared-config](https://www.npmjs.com/package/@tagproject/vscode-shared-config): `3.x`
- [@types/jest](https://www.npmjs.com/package/@types/jest): `latest`
- [@types/node](https://www.npmjs.com/package/@types/node): `latest`
- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin): `6.x`
- [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser): `6.x`
- [changelog-guru](https://www.npmjs.com/package/changelog-guru): `4.x`
- [eslint](https://www.npmjs.com/package/eslint): `8.x`
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): `8.x`
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import): `2.x`
- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest): `27.x`
- [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node): `11.x`
- [eslint-plugin-optimize-regex](https://www.npmjs.com/package/eslint-plugin-optimize-regex): `1.x`
- [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise): `6.x`
- [ghinfo](https://www.npmjs.com/package/ghinfo): `latest`
- [husky](https://www.npmjs.com/package/husky): `8.x`
- [jest](https://www.npmjs.com/package/jest): `29.x`
- [rimraf](https://www.npmjs.com/package/rimraf): `latest`
- [ts-jest](https://www.npmjs.com/package/ts-jest): `29.x`
- [typescript](https://www.npmjs.com/package/typescript): `5.x`

#### configure:

```json
{
  "exports": "./lib/index.js",
  "type": "module",
  "types": "./lib/index.d.ts"
}
```
