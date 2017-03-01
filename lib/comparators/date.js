var debug = require('debug')('brie:knows:date'),
  isDate = require('lodash/isDate'),
  assign = require('lodash/assign');

module.exports = function () {
  var brie = this,
    date = {
      equals: function (baseVal, checkVal) {
        debug('Comparing "' + baseVal + '" === "' + checkVal + '": ' + (baseVal <= checkVal));
        if (isDate(checkVal)) {
          return baseVal === checkVal;
        }
        if (!isNaN(checkVal)) {
          debug('Comparing date "' + baseVal + '" against number "' + checkVal + '".  Assuming "now()" as current date and "day" as the numeric differentiation.');
          return (((new Date()).getTime() - (new Date(baseVal)).getTime() / 86400000) === checkVal);
        }
        return false;
      },
      older: function (baseVal, checkVal) {
        debug('Comparing "' + baseVal + '" <= "' + checkVal + '": ' + (baseVal <= checkVal));
        if (isDate(checkVal)) {
          return baseVal <= checkVal;
        }
        if (!isNaN(checkVal)) {
          debug('Comparing date "' + baseVal + '" against number "' + checkVal + '".  Assuming "now()" as current date and "day" as the numeric differentiation.');
          return (((new Date()).getTime() - (new Date(baseVal)).getTime()) / 86400000 >= checkVal);
        }
        return false;
      },
      younger: function (baseVal, checkVal) {
        debug('Comparing "' + baseVal + '" >= "' + checkVal + '": ' + (baseVal >= checkVal));
        if (isDate(checkVal)) {
          return baseVal >= checkVal;
        }
        if (!isNaN(checkVal)) {
          debug('Comparing date "' + baseVal + '" against number "' + checkVal + '".  Assuming "now()" as current date and "day" as the numeric differentiation.');
          return ((((new Date()).getTime() - (new Date(baseVal)).getTime()) / 86400000) <= checkVal);
        }
        return false;
      }
    };
  assign(brie.determine, { date: date });
  brie.determine.date.longer = brie.determine.date.above = brie.determine.date.older;
  brie.determine.date.shorter = brie.determine.date.below = brie.determine.date.younger;
};
