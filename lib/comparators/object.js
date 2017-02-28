var debug = require('debug')('barry:knows:object'),
  isEqual = require('lodash/isEqual'),
  cloneDeep = require('lodash/cloneDeep'),
  isArray = require('lodash/isArray'),
  difference = require('lodash/difference'),
  keys = require('lodash/keys'),
  assignIn = require('lodash/assignIn'),
  size = require('lodash/size');
module.exports = function () {
  var barry = this,
    object_comparator = {
      equals: function (baseObj, checkObj) {
        debug('Comparing "' + baseObj + '" with "' + checkObj + '": ' + isEqual(baseObj, checkObj));
        return isEqual(baseObj, checkObj);
      },
      above: function (baseObj, checkObj) {
        var b = cloneDeep(baseObj),
          c = cloneDeep(checkObj);
        debug('Comparing "' + baseObj + '" "above" "' + checkObj + '": ' + isEqual(baseObj, checkObj));
        if (barry.determine.object.equals(b, c)) {
          debug('Exiting "above" comparison, as both base and comparison objects are (deep) equal');
          return false;
        }
        if (isArray(b)) {
          if (isArray(c)) {
            debug('Comparing difference of "' + checkObj + '" (array) and "' + baseObj + '" (array) with the empty array');
            return (isEqual(difference(c, b), [])); // compares simple difference between arrays with the empty array, essentially identifying that b contains c
          }
          return (isEqual(difference(keys(c), b), [])); // comparing, instead, the b array with the array of Keys from c
        } else {
          if (isArray(c)) {
            return (isEqual(difference(c, keys(b), [])));
          }
          return isEqual(assignIn(c, b), b);
        }
      },
      below: function (baseObj, checkObj) {
        var b = cloneDeep(baseObj),
          c = cloneDeep(checkObj);
        debug('Comparing "' + baseObj + '" "below" "' + checkObj + '": ' + isEqual(baseObj, checkObj));
        if (barry.determine.object.equals(b, c)) {
          debug('Exiting "below" comparison, as both base and comparison objects are (deep) equal');
          return false;
        }
        if (isArray(b)) {
          if (isArray(c)) {
            debug('Comparing difference of "' + baseObj + '" (array) and "' + checkObj + '" (array) with the empty array');
            return (isEqual(difference(b, c), [])); // compares simple difference between arrays with the empty array, essentially identifying that b contains c
          }
          return (isEqual(difference(keys(b), c), [])); // comparing, instead, the b array with the array of Keys from c
        } else {
          if (isArray(c)) {
            return (isEqual(difference(b, keys(c), [])));
          }
          return isEqual(assignIn(b, c), c);
        }
      },
      shorter: function (baseObj, checkObj) {
        return size(baseObj) <= size(checkObj);
      },
      longer: function (baseObj, checkObj) {
        return size(baseObj) >= size(checkObj);
      }
    };
  assignIn(barry.determine, { "object": object_comparator, "array": object_comparator });
};
