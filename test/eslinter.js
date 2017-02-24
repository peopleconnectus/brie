var linter = require('mocha-eslint'),
    path = require('path'),
    rootDir = path.join(__dirname, '../'),
    patterns = [
        path.join(rootDir, 'lib'),
        path.join(rootDir, 'ext'),
        path.join(__dirname, 'eslinter.js')
    ],
    options = {
        alwaysWarn: false
    };

describe('Runs eslint against codebase', function () {
    linter(patterns, options);
});
