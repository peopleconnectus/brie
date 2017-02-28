var debug = require('debug')('barry:knows:number'),
  assign = require('lodash/assign');
module.exports = function () {
  var barry = this,
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
      }
    };
  assign(barry.determine, { "number": numberHandler });
  barry.determine.number.longer = barry.determine.number.above;
  barry.determine.number.shorter = barry.determine.number.below;
};
