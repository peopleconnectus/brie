const linter = require('mocha-eslint');
const path = require('path');
const rootDir = path.join(__dirname, '../');
const patterns = [
  path.join(rootDir, 'lib'),
  path.join(rootDir, 'ext'),
  path.join(__dirname, 'eslinter.js')
];
const options = {
  alwaysWarn: false
};

describe('Runs eslint against codebase', function () {
  linter(patterns, options);
});
