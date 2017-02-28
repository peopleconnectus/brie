var debug = require('debug')('barry:knows:date'),
  isDate = require('lodash/isDate'),
  assign = require('lodash/assign');

module.exports = function () {
  var barry = this,
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
  assign(barry.determine, { date: date });
  barry.determine.date.longer = barry.determine.date.above = barry.determine.date.older;
  barry.determine.date.shorter = barry.determine.date.below = barry.determine.date.younger;
};
