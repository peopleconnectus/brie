/**
 * Testing Harness for Barry
 *
 * Run as:
 *
 * @example
 * // exit code 0
 * node tests/test.js
 *
 * Created by j.corns on 3/3/15.
 */

require('./eslinter');
require('./helpers/diagnostics')();
require('./helpers/setup')();
describe('Execution', function () {
  require('./evaluators/complex')();
  require('./evaluators/dates')();
  require('./evaluators/numbers')();
  require('./evaluators/objects')();
  require('./evaluators/simple')();
  require('./evaluators/strings')();
  require('./reflection/is')();
});
