var assignIn = require('lodash/assignIn'),
  debug = require('debug')('barry:criteria:always');
module.exports = function () {
  var barry = this,
    always = function (data_in, val) {
      debug('Simple execution for "' + JSON.stringify(data_in) + '" always: "' + val.toString() + '"');
      return val;
    };
    assignIn(barry.criteria, { always: always });
};
