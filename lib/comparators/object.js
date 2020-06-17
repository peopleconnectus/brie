const isEqual = require('lodash/isEqual');
const cloneDeep = require('lodash/cloneDeep');
const isArray = require('lodash/isArray');
const difference = require('lodash/difference');
const keys = require('lodash/keys');
const size = require('lodash/size');
module.exports = function () {
  const brie = this;
  const object_comparator = {
    equals: function (baseObj, checkObj) {
      return isEqual(baseObj, checkObj);
    },
    above: function (baseObj, checkObj) {
      const b = cloneDeep(baseObj);
      const c = cloneDeep(checkObj);
      if (brie.determine.object.equals(b, c)) {
        return false;
      }
      if (isArray(b)) {
        if (isArray(c)) {
          return (isEqual(difference(c, b), [])); // compares simple difference between arrays with the empty array, essentially identifying that b contains c
        }
        return (isEqual(difference(keys(c), b), [])); // comparing, instead, the b array with the array of Keys from c
      } else {
        if (isArray(c)) {
          return (isEqual(difference(c, keys(b), [])));
        }
        return isEqual(Object.assign(c, b), b);
      }
    },
    below: function (baseObj, checkObj) {
      const b = cloneDeep(baseObj);
      const c = cloneDeep(checkObj);
      if (brie.determine.object.equals(b, c)) {
        return false;
      }
      if (isArray(b)) {
        if (isArray(c)) {
          return (isEqual(difference(b, c), [])); // compares simple difference between arrays with the empty array, essentially identifying that b contains c
        }
        return (isEqual(difference(keys(b), c), [])); // comparing, instead, the b array with the array of Keys from c
      } else {
        if (isArray(c)) {
          return (isEqual(difference(b, keys(c), [])));
        }
        return isEqual(Object.assign(b, c), c);
      }
    },
    shorter: function (baseObj, checkObj) {
      return size(baseObj) <= size(checkObj);
    },
    longer: function (baseObj, checkObj) {
      return size(baseObj) >= size(checkObj);
    }
  };
  Object.assign(brie.determine, { "object": object_comparator, "array": object_comparator });
};
