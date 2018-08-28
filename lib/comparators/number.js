var debug = require('debug')('brie:knows_number'),
  assign = require('lodash/assign'),
  cloneDeep = require('lodash/cloneDeep');

module.exports = function () {
  var brie = this,
    numberHandler = {
      equals: function (baseVal, checkVal) {
        checkVal = checkVal || 0;
        debug('Comparing "' + baseVal + '" === "' + checkVal + '": ' + (baseVal === parseInt(checkVal, 10)));
        return baseVal == parseInt(checkVal, 10);
      },
      below: function (baseVal, checkVal) {
        debug('Comparing "' + baseVal + '" <= "' + checkVal + '": ' + (baseVal <= parseInt(checkVal, 10)));
        return baseVal <= parseInt(checkVal, 10);
      },
      above: function (baseVal, checkVal) {
        debug('Comparing "' + baseVal + '" >= "' + checkVal + '": ' + (baseVal >= parseInt(checkVal, 10)));
        return baseVal >= parseInt(checkVal, 10);
      },
      between: function (baseVal, checkVal) {
        // NOTE: checkVal is a single-use argument, so won't need to be deep-cloned
        var toCheck = Array.isArray(checkVal) ? cloneDeep(checkVal) : [0, 0];
        // short-cutting to 1x2 array of zeros.  Will return false for mal-ormed requests.
        debug('Evaluating "' + baseVal + '" falls between "' + JSON.stringify(toCheck) + '"');
        debug('What is infinity, after all?' + Number.POSITIVE_INFINITY);
        debug('What is infinity, after all?' + Number.NEGATIVE_INFINITY);
        debug('What is infinity, after all?' + [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]);
        toCheck.push(baseVal);
        toCheck.sort(numericSort);
        return (baseVal === toCheck[1]);
      }
    };
  assign(brie.determine, { "number": numberHandler });
  brie.determine.number.longer = brie.determine.number.above;
  brie.determine.number.shorter = brie.determine.number.below;
};

var numericSort = function (a, b) {
  if (Number.isFinite(a) && Number.isFinite(b)) {
    return a - b;
  }
  return 0;
}
