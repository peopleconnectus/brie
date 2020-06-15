const isDate = require('lodash/isDate');

module.exports = function () {
  const brie = this;
  const date = {
    equals: function (baseVal, checkVal) {
      if (isDate(checkVal)) {
        return baseVal === checkVal;
      }
      if (!isNaN(checkVal)) {
        return (((new Date()).getTime() - (new Date(baseVal)).getTime() / 86400000) === checkVal);
      }
      return false;
    },
    older: function (baseVal, checkVal) {
      if (isDate(checkVal)) {
        return baseVal <= checkVal;
      }
      if (!isNaN(checkVal)) {
        return (((new Date()).getTime() - (new Date(baseVal)).getTime()) / 86400000 >= checkVal);
      }
      return false;
    },
    younger: function (baseVal, checkVal) {
      if (isDate(checkVal)) {
        return baseVal >= checkVal;
      }
      if (!isNaN(checkVal)) {
        return ((((new Date()).getTime() - (new Date(baseVal)).getTime()) / 86400000) <= checkVal);
      }
      return false;
    }
  };
  Object.assign(brie.determine, { date: date });
  brie.determine.date.longer = brie.determine.date.above = brie.determine.date.older;
  brie.determine.date.shorter = brie.determine.date.below = brie.determine.date.younger;
};
