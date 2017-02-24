var _ = require('lodash');
module.exports = function () {
  var barry = this,
    date = {
      equals: function (baseVal, checkVal) {
        barry.log('(barry) Comparing "' + baseVal + '" === "' + checkVal + '": ' + (baseVal <= checkVal));
        if (_.isDate(checkVal)) {
          return baseVal === checkVal;
        }
        if (!isNaN(checkVal)) {
          barry.log('(barry) Comparing date "' + baseVal + '" against number "' + checkVal + '".  Assuming "now()" as current date and "day" as the numeric differentiation.');
          return (((new Date()).getTime() - (new Date(baseVal)).getTime() / 86400000) === checkVal);
        }
        return false;
      },
      older: function (baseVal, checkVal) {
        barry.log('(barry) Comparing "' + baseVal + '" <= "' + checkVal + '": ' + (baseVal <= checkVal));
        if (_.isDate(checkVal)) {
          return baseVal <= checkVal;
        }
        if (!isNaN(checkVal)) {
          barry.log('(barry) Comparing date "' + baseVal + '" against number "' + checkVal + '".  Assuming "now()" as current date and "day" as the numeric differentiation.');
          return (((new Date()).getTime() - (new Date(baseVal)).getTime() / 86400000) <= checkVal);
        }
        return true;
      },
      younger: function (baseVal, checkVal) {
        barry.log('(barry) Comparing "' + baseVal + '" >= "' + checkVal + '": ' + (baseVal >= checkVal));
        if (_.isDate(checkVal)) {
          return baseVal >= checkVal;
        }
        if (!isNaN(checkVal)) {
          barry.log('(barry) Comparing date "' + baseVal + '" against number "' + checkVal + '".  Assuming "now()" as current date and "day" as the numeric differentiation.');
          return (((new Date()).getTime() - (new Date(baseVal)).getTime() / 86400000) >= -1 * checkVal);
        }
        return true;
      }
    };
  _.assign(barry.determine, {date: date});
  barry.determine.date.longer = barry.determine.date.above = barry.determine.date.older;
  barry.determine.date.shorter = barry.determine.date.below = barry.determine.date.younger;
};
