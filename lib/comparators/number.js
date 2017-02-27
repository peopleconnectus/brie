var _ = require('lodash');
module.exports = function () {
  var barry = this,
    numberHandler = {
      equals: function (baseVal, checkVal) {
        checkVal = checkVal || 0;
        barry.log('(barry) Comparing "' + baseVal + '" === "' + checkVal + '": ' + (baseVal === parseInt(checkVal, 10)));
        return baseVal == parseInt(checkVal, 10);
      },
      below: function (baseVal, checkVal) {
        barry.log('(barry) Comparing "' + baseVal + '" <= "' + checkVal + '": ' + (baseVal <= parseInt(checkVal, 10)));
        return baseVal <= parseInt(checkVal, 10);
      },
      above: function (baseVal, checkVal) {
        barry.log('(barry) Comparing "' + baseVal + '" >= "' + checkVal + '": ' + (baseVal >= parseInt(checkVal, 10)));
        return baseVal >= parseInt(checkVal, 10);
      }
    };
  _.assign(barry.determine, { "number": numberHandler });
  barry.determine.number.longer = barry.determine.number.above;
  barry.determine.number.shorter = barry.determine.number.below;
};
