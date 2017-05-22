var assignIn = require('lodash/assignIn'),
  debug = require('debug')('brie:criteria_always');
module.exports = function () {
  var brie = this,
    always = function (data_in, val) {
      debug('Simple execution for always: "' + val.toString() + '"');
      return val;
    };
    assignIn(brie.criteria, { always: always });
};
