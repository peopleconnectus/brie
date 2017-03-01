var debug = require('debug')('brie:knows:number'),
  assign = require('lodash/assign');
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
      }
    };
  assign(brie.determine, { "number": numberHandler });
  brie.determine.number.longer = brie.determine.number.above;
  brie.determine.number.shorter = brie.determine.number.below;
};
