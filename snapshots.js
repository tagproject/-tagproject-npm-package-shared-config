/* eslint-disable */
/* prettier-ignore */
module.exports = [
  {
    "path": ".github/codeql/codeql-configuration.yml",
    "hash": "b73a6925843a63ac2cc54202ccec74ce7ca7ad44d5313a35162873dbc96e5fa1",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "name : CodeQL Configuration\n\npaths:\n  - './src'\n"
  },
  {
    "path": ".github/workflows/build.yml",
    "hash": "851dc9393a242bb4d7304a93b04c47c0733fd1d5e1228faf3990e87686f112fe",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "name: Build\n\non: [push, pull_request]\n\njobs:\n  triage-labels:\n    name: Add labels\n    if: ${{ github.event_name == 'pull_request' }}\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/labeler@main\n      with:\n        repo-token: \"${{ secrets.GITHUB_TOKEN }}\"\n        sync-labels: true\n\n  test:\n    name: Test\n    runs-on: ${{ matrix.os }}\n    strategy:\n      matrix:\n        node-version: [14.x, 15.x]\n        os: [ubuntu-latest]\n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v2\n\n    - name: Setup Node.js v${{ matrix.node-version }}\n      uses: actions/setup-node@v2\n      with:\n        node-version: ${{ matrix.node-version }}\n\n    - name: Cache node modules\n      id: cache-npm\n      uses: actions/cache@v2\n      with:\n        path: ~/.npm\n        key: npm-${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles('**/package-lock.json') }}\n\n    - name: Install Dependencies\n      run: npm ci\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n    - name: Lint and Test\n      run: |\n        npm run check\n        npm run test\n\n    - name: Cache coverage\n      if: ${{ success() && matrix.node-version == '15.x' }}\n      uses: actions/cache@v2\n      with:\n        path: coverage\n        key: coverage-${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles('src/**/*.*', '**/package-lock.json') }}\n\n  build:\n    name: Build\n    needs: [test]\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [15.x]\n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v2\n\n    - name: Use Node.js ${{ matrix.node-version }}\n      uses: actions/setup-node@v2\n      with:\n        node-version: ${{ matrix.node-version }}\n\n    - name: Cache node modules\n      id: cache-npm\n      uses: actions/cache@v2\n      with:\n        path: ~/.npm\n        key: npm-${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles('**/package-lock.json') }}\n\n    - name: Install Dependencies\n      run: npm ci\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n    - name: Build\n      run: npm run build\n\n  coverage:\n    name: Coverage\n    if: ${{ github.event_name == 'push' }}\n    needs: [build]\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [15.x]\n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v2\n\n    - name: Cache coverage\n      id: cache-coverage\n      uses: actions/cache@v2\n      with:\n        path: coverage\n        key: coverage-${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles('src/**/*.*', '**/package-lock.json') }}\n\n    - name: Setup Node.js v${{ matrix.node-version }}\n      if: steps.cache-coverage.outputs.cache-hit != 'true'\n      uses: actions/setup-node@v2\n      with:\n        node-version: ${{ matrix.node-version }}\n\n    - name: Cache node modules\n      if: steps.cache-coverage.outputs.cache-hit != 'true'\n      id: cache-npm\n      uses: actions/cache@v2\n      with:\n        path: ~/.npm\n        key: npm-${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles('**/package-lock.json') }}\n\n    - name: Test\n      if: steps.cache-coverage.outputs.cache-hit != 'true'\n      run: |\n        npm ci\n        npm run test\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n    - name: Send coverage report\n      uses: codecov/codecov-action@v1\n      with:\n        file: ./coverage/lcov.info\n\n  discord:\n    name: Discord notification\n    needs: [test, build, coverage]\n    if: ${{ always() }}\n    runs-on: ubuntu-latest\n    env:\n      DISCORD_USERNAME: github\n      DISCORD_ERROR_COLOR: 16726645\n      DISCORD_ERROR_AVATAR: https://cdn.jsdelivr.net/gh/tagproject/art/bot/bot-error.png\n      DISCORD_EVENT_COLOR: 53759\n      DISCORD_EVENT_AVATAR: https://cdn.jsdelivr.net/gh/tagproject/art/bot/bot-event.png\n    steps:\n    - name: Send error notification after push commit\n      if: ${{ contains(needs.*.result, 'failure') && github.event_name == 'push' }}\n      uses: sarisia/actions-status-discord@v1\n      with:\n        webhook: ${{ secrets.DISCORD_WEBHOOK }}\n        nodetail: true\n        username: ${{ env.DISCORD_USERNAME }}\n        avatar_url: ${{ env.DISCORD_ERROR_AVATAR }}\n        title: 'Build failed :confused:'\n        color: ${{ env.DISCORD_ERROR_COLOR }}\n        description: |\n          **Repository:** `${{ github.repository }}`\n          **Branch:** `${{ github.event.ref }}`\n          **Author:** [${{ github.event.head_commit.author.username }}](https://github.com/${{ github.event.head_commit.author.username }})\n          **Commit:** [${{ github.event.head_commit.id }}](${{ github.event.head_commit.url }})\n          **Message:**\n          `${{ github.event.head_commit.message }}`\n\n    - name: Send error notification for pull_request\n      if: ${{ contains(needs.*.result, 'failure') && github.event_name == 'pull_request' }}\n      uses: sarisia/actions-status-discord@v1\n      with:\n        webhook: ${{ secrets.DISCORD_WEBHOOK }}\n        nodetail: true\n        username: ${{ env.DISCORD_USERNAME }}\n        avatar_url: ${{ env.DISCORD_ERROR_AVATAR }}\n        title: 'Pull request build failed :confused:'\n        color: ${{ env.DISCORD_ERROR_COLOR }}\n        description: |\n          **Repository:** `${{ github.repository }}`\n          **Merge:** into `${{ github.event.pull_request.base.ref }}` from `${{ github.event.pull_request.head.ref }}`\n          **Title:** ${{ github.event.pull_request.title }} [#${{ github.event.pull_request.number }}](${{github.event.pull_request._links.html.href}})\n          **Assignees:** `${{ join(github.event.pull_request.assignees.*.login, ', ') }}`\n          **Labels:** `${{ join(github.event.pull_request.labels.*.name, ', ') }}`\n\n    - name: Send success notification for pull_request\n      if: ${{ !contains(needs.*.result, 'failure') && github.event_name == 'pull_request' }}\n      uses: sarisia/actions-status-discord@v1\n      with:\n        webhook: ${{ secrets.DISCORD_WEBHOOK }}\n        nodetail: true\n        username: ${{ env.DISCORD_USERNAME }}\n        avatar_url: ${{ env.DISCORD_EVENT_AVATAR }}\n        title: 'Pull request successfully build :face_with_monocle:'\n        color: ${{ env.DISCORD_EVENT_COLOR }}\n        description: |\n          **Repository:** `${{ github.repository }}`\n          **Merge:** into `${{ github.event.pull_request.base.ref }}` from `${{ github.event.pull_request.head.ref }}`\n          **Title:** ${{ github.event.pull_request.title }} [#${{ github.event.pull_request.number }}](${{github.event.pull_request._links.html.href}})\n          **Assignees:** `${{ join(github.event.pull_request.assignees.*.login, ', ') }}`\n          **Labels:** `${{ join(github.event.pull_request.labels.*.name, ', ') }}`\n\n\n\n"
  },
  {
    "path": ".github/workflows/release.yml",
    "hash": "beb571339c535c85c3ecfe33363dbfcb94545cd6f1e73c0105ecf8cac3ab1bd5",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "name: Release package\non:\n  push:\n    branches:\n      - master\n\njobs:\n  sync:\n    name: Sync labels\n    runs-on: ubuntu-latest\n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v2\n\n    - name: Sync project labels\n      uses: micnncim/action-label-syncer@v1\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n  publish:\n    name: Publish\n    needs: [sync]\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [15.x]\n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v1\n\n    - name: Setup Node.js v${{ matrix.node-version }}\n      uses: actions/setup-node@v1\n      with:\n        node-version: ${{ matrix.node-version }}\n\n    - name: Install Dependencies\n      run: npm ci\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n    - name: Lint and Test\n      run: |\n        npm run check\n        npm run test\n\n    - name: Build\n      run: npm run build\n\n    - name: Publish package\n      uses: JS-DevTools/npm-publish@v1\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n      with:\n        token: ${{ secrets.NPM_TOKEN }}\n\n  release:\n    name: Create Release\n    needs: [publish]\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [15.x]\n    steps:\n    - name: Checkout code\n      uses: actions/checkout@v2\n\n    - name: Use Node.js ${{ matrix.node-version }}\n      uses: actions/setup-node@v2\n      with:\n        node-version: ${{ matrix.node-version }}\n\n    - name: Get package version\n      run: node -p -e '`PACKAGE_VERSION=${require(\"./package.json\").version}`' >> $GITHUB_ENV\n\n    - name: Create Release\n      uses: softprops/action-gh-release@v1\n      env:\n        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n      with:\n        tag_name: v${{ env.PACKAGE_VERSION }}\n        body_path: CHANGELOG.md\n        draft: false\n        prerelease: false\n\n  discord:\n    name: Discord notification\n    needs: [publish, release]\n    if: ${{ always() }}\n    runs-on: ubuntu-latest\n    env:\n      DISCORD_USERNAME: github\n      DISCORD_ERROR_COLOR: 16726645\n      DISCORD_ERROR_AVATAR: https://cdn.jsdelivr.net/gh/tagproject/art/bot/bot-error.png\n      DISCORD_SUCCESS_COLOR: 969384\n      DISCORD_SUCCESS_AVATAR: https://cdn.jsdelivr.net/gh/tagproject/art/bot/bot-success.png\n    steps:\n    - name: Checkout code\n      uses: actions/checkout@v2\n\n    - name: Use Node.js ${{ matrix.node-version }}\n      uses: actions/setup-node@v2\n      with:\n        node-version: ${{ matrix.node-version }}\n\n    - name: Get package version\n      run: |\n        node -p -e '`PACKAGE_VERSION=${require(\"./package.json\").version}`' >> $GITHUB_ENV\n        node -p -e '`PACKAGE_NAME=${require(\"./package.json\").name}`' >> $GITHUB_ENV\n\n    - name: Send error notification\n      if: ${{ contains(needs.*.result, 'failure') && github.event_name == 'push' }}\n      uses: sarisia/actions-status-discord@v1\n      with:\n        webhook: ${{ secrets.DISCORD_WEBHOOK }}\n        nodetail: true\n        username: ${{ env.DISCORD_USERNAME }}\n        avatar_url: ${{ env.DISCORD_ERROR_AVATAR }}\n        title: 'Release failed :face_with_symbols_over_mouth:'\n        color: ${{ env.DISCORD_ERROR_COLOR }}\n        description: |\n          **Repository:** [${{ github.repository }}](https://github.com/${{ github.repository }}/releases)\n          **Version:** `v${{ env.PACKAGE_VERSION }}`\n\n    - name: Send success notification\n      if: ${{ !contains(needs.*.result, 'failure') && github.event_name == 'push' }}\n      uses: sarisia/actions-status-discord@v1\n      with:\n        webhook: ${{ secrets.DISCORD_WEBHOOK }}\n        nodetail: true\n        username: ${{ env.DISCORD_USERNAME }}\n        avatar_url: ${{ env.DISCORD_SUCCESS_AVATAR }}\n        title: 'Package successfully released :tada::tada::tada:'\n        color: ${{ env.DISCORD_SUCCESS_COLOR }}\n        description: |\n          **Repository:** [${{ github.repository }}](https://github.com/${{ github.repository }}/releases)\n          **Tag:** [v${{ env.PACKAGE_VERSION }}](https://github.com/${{ github.repository }}/releases/tag/v${{ env.PACKAGE_VERSION }})\n          **NPM:** [${{ env.PACKAGE_NAME }}](https://www.npmjs.com/package/${{ env.PACKAGE_NAME }}/v/${{ env.PACKAGE_VERSION }})\n"
  },
  {
    "path": ".github/workflows/scan.yml",
    "hash": "e0bc902fd75ae0fc738c1e874a42e2c125f17810c8a5607499d1cc01c9a8ecf9",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "name: CodeQL scanning\n\non:\n  push:\n  pull_request:\n  schedule:\n    - cron: '0 22 * * 5'\n\njobs:\n  scan:\n    runs-on: ubuntu-latest\n\n    steps:\n    - name: Checkout repository\n      uses: actions/checkout@v2\n      with:\n        fetch-depth: 2\n\n    - name: Initialize CodeQL\n      uses: github/codeql-action/init@v1\n      with:\n        config-file: ./.github/codeql/codeql-configuration.yml\n\n    - name: Autobuild\n      uses: github/codeql-action/autobuild@v1\n\n    - name: Perform CodeQL Analysis\n      uses: github/codeql-action/analyze@v1\n"
  },
  {
    "path": ".github/dependabot.yml",
    "hash": "f443dcae1dbc74b55ba07735cec459e1b1be65d8d5badc3b74a98c00911f7dfd",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "version: 2\nupdates:\n- package-ecosystem: npm\n  directory: \"/\"\n  schedule:\n    interval: weekly\n    day: friday\n    time: \"22:00\"\n  open-pull-requests-limit: 10\n  target-branch: dev\n  assignees:\n  - keindev\n  labels:\n  - dependencies\n"
  },
  {
    "path": ".github/labeler.yml",
    "hash": "71b032ffc4344427996011d1d51ca3828261bb5a65ad49d095b592b207e0cb3e",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "test:\n  - src/__mocks__/**/*.test.ts\n  - src/__tests__/**/*.test.ts\n\nworkflow:\n  - .github/**/*\n  - .gitignore\n  - .npmignore\n\nproject:\n  - package-lock.json\n  - package.json\n  - LICENSE\n\nsource:\n  - any: ['src/**/*', '!src/cli/*', '!src/__mocks__/*', '!src/__tests__/*']\n\napi:\n  - bin/**/*\n  - src/cli/**/*\n\ndocs:\n  - any: ['docs/**/*', '*.md', '.ghinfo']\n\nexample:\n  - example/**/*\n\nmedia:\n  - media/**/*\n"
  },
  {
    "path": ".github/labels.yml",
    "hash": "815a73e6a4c3410443f6f560e285faa1e20de000a7b9fca65e90c28eabe99a14",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "# Gray\n- name: docs\n  description: Pull requests that change documentation\n  color: BCBEC0\n- name: media\n  description: Pull requests that change media files\n  color: BCBEC0\n- name: example\n  description: Pull requests that change examples\n  color: BCBEC0\n# Violet\n- name: source\n  description: Pull requests that change sources\n  color: 4400B2\n- name: project\n  description: Pull requests that change main project files\n  color: 4400B2\n# Blue\n- name: release\n  description: Release candidate\n  color: 0260E8\n- name: test\n  description: Pull requests that change tests\n  color: 0260E8\n- name: feature\n  description: Feature request\n  color: E20338\n# Mint\n- name: dependencies\n  description: Pull requests that change a dependency file\n  color: 00DFC8\n- name: workflow\n  description: Pull requests that change workflow files\n  color: 00DFC8\n# Orange\n- name: api\n  description: Pull requests that change bin, cli commands or API\n  color: FE634E\n# Red\n- name: security\n  description: Pull requests that address a security vulnerability\n  color: E20338\n- name: bug\n  description: Bug reporting\n  color: E20338\n\n"
  },
  {
    "path": ".husky/commit-msg",
    "hash": "89bf22012c9e1649731a8e578b92678a771f144f6368b205797d3097c4491870",
    "merge": true,
    "executable": true,
    "type": "text",
    "content": "#!/bin/sh\n. \"$(dirname \"$0\")/_/husky.sh\"\n\nnpx --no-install changelog lint --message $1\n"
  },
  {
    "path": ".husky/pre-commit",
    "hash": "f529d2f2c5c36c65064bdd136dc1af646aef6234e3d3054b6dc113105b69b7be",
    "merge": false,
    "executable": true,
    "type": "text",
    "content": "#!/bin/sh\n. \"$(dirname \"$0\")/_/husky.sh\"\n\nnpm run check\nnpm run test\n"
  },
  {
    "path": ".vscode/cspell.json",
    "hash": "92f9b3d5eb95f912d954b0bdae7ecb18eb0e4fc686182ded5195b74820496671",
    "merge": [
      "words"
    ],
    "executable": false,
    "type": "json",
    "content": "{\n  \"language\": \"en\",\n  \"words\": [\n    \"codecov\",\n    \"dependabot\",\n    \"ghinfo\",\n    \"keindev\",\n    \"mediainfo\",\n    \"npmignore\",\n    \"opensource\",\n    \"tagproject\",\n    \"tasktree\"\n  ]\n}\n"
  },
  {
    "path": ".vscode/launch.json",
    "hash": "8b48944e06bffeffe996f5f0692c8c07c9cb51ba4cf5f3788fb4338efc9eaa27",
    "merge": [
      "configurations"
    ],
    "executable": false,
    "type": "json",
    "content": "{\n  \"version\": \"0.2.0\",\n  \"configurations\": [\n    {\n      \"name\": \"Jest\",\n      \"type\": \"node\",\n      \"request\": \"launch\",\n      \"program\": \"${workspaceFolder}/node_modules/.bin/jest\",\n      \"cwd\": \"${workspaceRoot}\",\n      \"args\": [\"--i\", \"--runInBand\", \"--coverage\", \"false\", \"${relativeFile}\"],\n      \"console\": \"integratedTerminal\",\n      \"internalConsoleOptions\": \"neverOpen\",\n      \"disableOptimisticBPs\": true,\n      \"windows\": {\n        \"program\": \"${workspaceFolder}/node_modules/jest/bin/jest\"\n      }\n    }\n  ]\n}\n"
  },
  {
    "path": ".vscode/settings.json",
    "hash": "e66ce61585ff5aaca7350ca7633224092a01b366607e32c5764d68a720090a22",
    "merge": false,
    "executable": false,
    "type": "json",
    "content": "{\n  \"typescript.tsdk\": \"./node_modules/typescript/lib\"\n}\n"
  },
  {
    "path": ".editorconfig",
    "hash": "2fc708a81febba0c704b78e2690a92459928e3c4a9206651933ebebe40c2c29c",
    "merge": false,
    "executable": false,
    "type": "text",
    "content": "root = true\n\n[*]\ninsert_final_newline = true\ncharset = utf-8\ntrim_trailing_whitespace = true\nend_of_line = lf\nmax_line_length  = 120\nindent_style = space\nindent_size = 2\n\n[*.{js}]\nindent_style = space\nindent_size = 2\n\n[*.{json}]\nindent_style = space\nindent_size = 2\n\n[*.{md,markdown}]\ntrim_trailing_whitespace = false\n"
  },
  {
    "path": ".eslintrc",
    "hash": "abe871bfd4070432368b18e0b2bf09fe5433b577d07abe97a07366316e6ccb23",
    "merge": false,
    "executable": false,
    "type": "text",
    "content": "{\n  \"root\": true,\n  \"env\": {\n    \"node\": true,\n    \"commonjs\": true\n  },\n  \"parser\": \"@typescript-eslint/parser\",\n  \"parserOptions\": {\n    \"project\": \"./tsconfig.eslint.json\",\n    \"tsconfigRootDir\": \".\"\n  },\n  \"extends\": [\n    \"eslint:recommended\",\n    \"plugin:node/recommended\",\n    \"plugin:@typescript-eslint/recommended\",\n    \"plugin:promise/recommended\",\n    \"plugin:jest/recommended\",\n    \"prettier\"\n  ],\n  \"plugins\": [\"@typescript-eslint\", \"optimize-regex\", \"jest\"],\n  \"rules\": {\n    \"@typescript-eslint/brace-style\": [\"error\", \"1tbs\"],\n    \"@typescript-eslint/explicit-function-return-type\": [\"error\", { \"allowExpressions\": true }],\n    \"@typescript-eslint/func-call-spacing\": [\"error\", \"never\"],\n    \"@typescript-eslint/indent\": [\"error\", 2, { \"SwitchCase\": 1 }],\n    \"@typescript-eslint/interface-name-prefix\": \"off\",\n    \"@typescript-eslint/member-delimiter-style\": [\"error\", { \"multiline\": { \"delimiter\": \"semi\" } }],\n    \"@typescript-eslint/member-ordering\": \"error\",\n    \"@typescript-eslint/naming-convention\": [\n      \"error\",\n      { \"selector\": \"interface\", \"format\": [\"PascalCase\"], \"custom\": { \"regex\": \"^I[A-Z]\", \"match\": true } }\n    ],\n    \"@typescript-eslint/no-magic-numbers\": [\n      \"error\",\n      {\n        \"ignoreNumericLiteralTypes\": true,\n        \"ignoreEnums\": true,\n        \"enforceConst\": true,\n        \"ignoreReadonlyClassProperties\": true,\n        \"ignoreArrayIndexes\": true,\n        \"ignoreDefaultValues\": true,\n        \"ignore\": [0, 1, 2, 8, 10, 16]\n      }\n    ],\n    \"@typescript-eslint/no-parameter-properties\": \"error\",\n    \"@typescript-eslint/no-shadow\": \"error\",\n    \"@typescript-eslint/no-unnecessary-type-arguments\": \"warn\",\n    \"@typescript-eslint/no-unused-vars\": [\"error\", { \"argsIgnorePattern\": \"^_\", \"varsIgnorePattern\": \"^_$\" }],\n    \"@typescript-eslint/no-useless-constructor\": \"error\",\n    \"@typescript-eslint/prefer-for-of\": \"warn\",\n    \"@typescript-eslint/prefer-function-type\": \"warn\",\n    \"@typescript-eslint/prefer-readonly\": \"warn\",\n    \"@typescript-eslint/semi\": [\"error\"],\n    \"@typescript-eslint/unbound-method\": \"off\",\n    \"array-bracket-newline\": [\"error\", { \"multiline\": true }],\n    \"arrow-body-style\": [\"error\", \"as-needed\"],\n    \"arrow-parens\": [\"error\", \"as-needed\"],\n    \"arrow-spacing\": \"error\",\n    \"block-scoped-var\": \"error\",\n    \"curly\": [\"error\", \"multi-line\"],\n    \"eol-last\": \"error\",\n    \"eqeqeq\": \"error\",\n    \"generator-star-spacing\": [\"error\", \"before\"],\n    \"import/extensions\": \"off\",\n    \"import/prefer-default-export\": \"off\",\n    \"indent\": \"off\",\n    \"key-spacing\": \"error\",\n    \"keyword-spacing\": \"error\",\n    \"lines-between-class-members\": \"off\",\n    \"max-classes-per-file\": [\"error\", 1],\n    \"max-len\": [\"error\", { \"code\": 120, \"ignoreComments\": true }],\n    \"max-lines-per-function\": [\"error\", { \"max\": 40 }],\n    \"new-parens\": \"error\",\n    \"no-alert\": \"warn\",\n    \"no-bitwise\": \"off\",\n    \"no-confusing-arrow\": [\"error\", { \"allowParens\": true }],\n    \"no-console\": \"warn\",\n    \"no-dupe-class-members\": \"off\",\n    \"no-else-return\": [\"error\", { \"allowElseIf\": false }],\n    \"no-labels\": \"error\",\n    \"no-lone-blocks\": \"error\",\n    \"no-magic-numbers\": \"off\",\n    \"no-multi-spaces\": \"error\",\n    \"no-multiple-empty-lines\": \"error\",\n    \"no-nested-ternary\": \"error\",\n    \"no-new\": \"error\",\n    \"no-new-func\": \"error\",\n    \"no-new-object\": \"error\",\n    \"no-new-wrappers\": \"error\",\n    \"no-plusplus\": \"off\",\n    \"no-return-await\": \"error\",\n    \"no-self-compare\": \"error\",\n    \"no-sequences\": \"error\",\n    \"no-shadow\": \"off\",\n    \"no-tabs\": \"error\",\n    \"no-template-curly-in-string\": \"error\",\n    \"no-throw-literal\": \"error\",\n    \"no-trailing-spaces\": \"error\",\n    \"no-underscore-dangle\": [\"error\", { \"allowAfterThis\": true }],\n    \"no-unneeded-ternary\": \"error\",\n    \"no-unused-expressions\": \"error\",\n    \"no-useless-call\": \"error\",\n    \"no-useless-computed-key\": \"error\",\n    \"no-useless-concat\": \"error\",\n    \"no-useless-rename\": \"error\",\n    \"no-useless-return\": \"error\",\n    \"no-var\": \"error\",\n    \"no-whitespace-before-property\": \"error\",\n    \"node/no-empty-function\": \"off\",\n    \"node/no-missing-import\": \"off\",\n    \"node/no-missing-require\": \"off\",\n    \"node/no-unsupported-features/es-syntax\": \"off\",\n    \"node/shebang\": \"off\",\n    \"object-curly-newline\": \"error\",\n    \"object-curly-spacing\": [\"error\", \"always\"],\n    \"object-shorthand\": [\"error\", \"always\"],\n    \"optimize-regex/optimize-regex\": \"warn\",\n    \"padding-line-between-statements\": [\n      \"error\",\n      { \"blankLine\": \"always\", \"prev\": \"*\", \"next\": \"return\" },\n      { \"blankLine\": \"always\", \"prev\": [\"const\", \"let\", \"var\"], \"next\": \"*\" },\n      { \"blankLine\": \"any\", \"prev\": [\"const\", \"let\", \"var\"], \"next\": [\"const\", \"let\", \"var\"] },\n      { \"blankLine\": \"always\", \"prev\": \"*\", \"next\": \"if\" },\n      { \"blankLine\": \"any\", \"prev\": \"if\", \"next\": \"if\" }\n    ],\n    \"prefer-arrow-callback\": \"error\",\n    \"prefer-const\": \"error\",\n    \"prefer-destructuring\": \"error\",\n    \"prefer-promise-reject-errors\": \"error\",\n    \"promise/prefer-await-to-then\": \"error\",\n    \"quotes\": [\"warn\", \"single\", { \"avoidEscape\": true }],\n    \"radix\": \"error\",\n    \"require-atomic-updates\": \"off\",\n    \"require-await\": \"error\",\n    \"rest-spread-spacing\": [\"error\", \"never\"],\n    \"semi\": \"off\",\n    \"semi-spacing\": \"error\",\n    \"space-before-blocks\": \"error\",\n    \"space-before-function-paren\": [\"error\", { \"anonymous\": \"always\", \"named\": \"never\", \"asyncArrow\": \"always\" }],\n    \"space-in-parens\": \"error\",\n    \"space-infix-ops\": \"error\",\n    \"space-unary-ops\": \"error\",\n    \"spaced-comment\": [\"error\", \"always\"],\n    \"switch-colon-spacing\": \"error\",\n    \"template-curly-spacing\": \"error\"\n  },\n  \"overrides\": [\n    {\n      \"files\": [\"*.test.ts\", \"*.mock.ts\"],\n      \"rules\": {\n        \"@typescript-eslint/no-explicit-any\": \"off\",\n        \"@typescript-eslint/no-magic-numbers\": \"off\",\n        \"max-lines-per-function\": [\"error\", { \"max\": 200 }],\n        \"no-underscore-dangle\": \"off\"\n      }\n    }\n  ],\n  \"settings\": {\n    \"import/resolver\": {\n      \"node\": {\n        \"paths\": [\"src\"],\n        \"extensions\": [\".ts\", \".d.ts\"]\n      }\n    }\n  }\n}\n"
  },
  {
    "path": ".prettierrc",
    "hash": "e2755cf17f65d187ea0713d4b115a4266a9aac86832d64721244a27e10ec9ee7",
    "merge": false,
    "executable": false,
    "type": "text",
    "content": "{\n  \"printWidth\": 120,\n  \"singleQuote\": true,\n  \"tabWidth\": 2,\n  \"endOfLine\": \"lf\",\n  \"trailingComma\": \"es5\",\n  \"arrowParens\": \"avoid\"\n}\n"
  },
  {
    "path": "babel.config.cjs",
    "hash": "6f04f141e34d7d5adb472a77ca6831887b5a0c019ae1a60d1f4f8a0213b42470",
    "merge": false,
    "executable": false,
    "type": "text",
    "content": "module.exports = {\n  presets: ['@babel/preset-env'],\n  plugins: ['@babel/plugin-transform-runtime'],\n};\n"
  },
  {
    "path": "codecov.yml",
    "hash": "e1329996258e102f0b45239cb3e3a19b8d8a30906a40831821ee99cf2891d38f",
    "merge": false,
    "executable": false,
    "type": "yaml",
    "content": "codecov:\n  max_report_age: off\ncoverage:\n  precision: 2\n  round: down\n  status:\n    project:\n      default:\n       enabled: no\n       threshold: 0.2\n       if_not_found: success\n    patch:\n      default:\n        enabled: no\n        if_not_found: success\n    changes:\n      default:\n        enabled: no\n        if_not_found: success\n"
  },
  {
    "path": "jest.config.cjs",
    "hash": "ddb3ac1872d35d1bf7b06a32cee147d3bfc557233c4c12d510961d13694a3171",
    "merge": false,
    "executable": false,
    "type": "text",
    "content": "const modules = require('./jest.modules');\n\nmodule.exports = {\n  preset: 'ts-jest',\n  testEnvironment: 'node',\n  collectCoverage: true,\n  coverageReporters: ['text-summary', 'lcov'],\n  testRegex: '(/__tests__/.*|(\\\\.|/)(test))\\\\.(tsx?)$',\n  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],\n  testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/node_modules/'],\n  transform: {\n    '^.+\\\\.(ts|tsx)?$': 'ts-jest',\n    '^.+\\\\.(js|jsx)$': 'babel-jest',\n  },\n  transformIgnorePatterns: [`/node_modules/(?!${modules.es6.join('|')})`],\n};\n"
  },
  {
    "path": "jest.modules.json",
    "hash": "7adf025d5e27fe58cdea26ab4cd190c62eddf5815dad195d22d2c6d3a26a8198",
    "merge": [
      "es6"
    ],
    "executable": false,
    "type": "json",
    "content": "{ \"es6\": [] }\n"
  },
  {
    "path": "tsconfig.eslint.json",
    "hash": "4eb098ac49a278db14cdaf2c506ea93e69355bb3e3c8f99c5026d827c4fbf9d0",
    "merge": false,
    "executable": false,
    "type": "json",
    "content": "{\n  \"extends\": \"./tsconfig.json\",\n  \"exclude\": [\"node_modules\"],\n  \"include\": [\"src/**/*\"]\n}\n"
  },
  {
    "path": "tsconfig.json",
    "hash": "b2ce7d0bce9dc2ea8413fc9da0523408aafb8f3f7f0727f5735895668c271b4c",
    "merge": false,
    "executable": false,
    "type": "json",
    "content": "{\n  \"compilerOptions\": {\n    \"target\": \"esnext\",\n    \"module\": \"esnext\",\n    \"moduleResolution\": \"node\",\n    \"outDir\": \"lib\",\n    \"newLine\": \"lf\",\n    \"allowSyntheticDefaultImports\": true,\n    \"allowUnreachableCode\": false,\n    \"declaration\": true,\n    \"esModuleInterop\": true,\n    \"incremental\": false,\n    \"noFallthroughCasesInSwitch\": true,\n    \"noImplicitReturns\": true,\n    \"noUncheckedIndexedAccess\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"preserveConstEnums\": true,\n    \"removeComments\": true,\n    \"resolveJsonModule\": true,\n    \"strict\": true\n  },\n  \"exclude\": [\"node_modules\", \"**/*.test.ts\", \"**/*.mock.ts\"],\n  \"include\": [\"src/**/*\"]\n}\n"
  },
  {
    "path": "typedoc.json",
    "hash": "41b25c290106a1b6d0ed30a0df806a6dbd359773e37327de172a407f648afc69",
    "merge": [
      "entryPoints"
    ],
    "executable": false,
    "type": "json",
    "content": "{\n  \"entryPoints\": [],\n  \"out\": \"docs/api\",\n  \"hideGenerator\": true,\n  \"hideBreadcrumbs\": true,\n  \"excludePrivate\": true,\n  \"excludeProtected\": true,\n  \"excludeInternal\": true,\n  \"disableSources\": true,\n  \"readme\": \"none\",\n  \"entryDocument\": \"index.md\",\n  \"exclude\": [\"**/__tests__/**/*\", \"**/__mocks__/**/*\"]\n}\n"
  },
  {
    "path": ".gitignore",
    "hash": "869805daac2c4211b1a19512c932f03b831a42e256fd576c4c3f30e19a0d0535",
    "merge": true,
    "executable": false,
    "type": "glob",
    "content": "*.log\n*.pid\n*.pid.lock\n*.seed\n*.tgz\n.editorconfig\n.env\n.eslintcache\n.eslintignore\n.eslintrc\n.prettierignore\n.prettierrc\n.yarn-integrity\n/.husky/\n/.vscode/\n/jest.modules.json\n/typedoc.json\nbabel.config.cjs\ncoverage\njest.config.cjs\nlib\nlogs\nnode_modules/\npids\ntsconfig.eslint.json\ntsconfig.json\ntsconfig.tsbuildinfo\nyarn-debug.log*\nyarn-error.log*"
  },
  {
    "path": ".npmignore",
    "hash": "9eaeb90db5b254c4f9c3596c816867324378ce0deda30655b38deafc73f483f0",
    "merge": true,
    "executable": false,
    "type": "glob",
    "content": "**/__mocks__/**\n**/__tests__/**\n.changelogrc.yml\n.config\n.editorconfig\n.env\n.eslintignore\n.eslintrc\n.ghinfo\n.gitattributes\n.github\n.husky\n.prettierignore\n.prettierrc\n.vscode\nCODE_OF_CONDUCT.md\nbabel.config.cjs\ncodecov.yml\ncodegen.yml\ncoverage/\ndocs/\nexample/\njest.config.cjs\njest.modules.json\nmedia/\nnode_modules/\nsrc/\ntsconfig.eslint.json\ntsconfig.json\ntypedoc.json"
  },
  {
    "path": ".eslintignore",
    "hash": "687bd74e57af0bef53ed592d29fdedc6db517619021562d3f41fc0a0a9c07995",
    "merge": false,
    "executable": false,
    "type": "glob",
    "content": "*.gql\n*.js\n/*.cjs\n__generated__\nlib"
  },
  {
    "path": ".prettierignore",
    "hash": "8f4fe2729d881ad860c93f7af99aaf12e72ba7aba8d0c3960b3b424ddf269f49",
    "merge": false,
    "executable": false,
    "type": "glob",
    "content": "lib/"
  }
]