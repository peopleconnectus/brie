var debug = require('debug')('brie:knows:string'),
  isNil = require('lodash/isNil'),
  assignIn = require('lodash/assignIn');
module.exports = function () {
  var brie = this,
    stringHandler = {
      equals: function (baseVal, checkVal) {
        if (isNil(checkVal)) checkVal = "";
        return baseVal === checkVal.toString();
      },
      like: function (baseVal, checkVal) {
        if (isNil(checkVal)) checkVal = "";
        return baseVal.toLowerCase() == checkVal.toString().toLowerCase();
      },
      below: function (baseVal, checkVal) {
        if (isNil(checkVal)) checkVal = "";
        debug('Performing string comparison using ">" or "<".  This may not be the comparison you are looking for.');
        debug('Comparing "' + baseVal + '" <= "' + checkVal.toString() + '": ' + (baseVal <= checkVal.toString()));
        return (baseVal <= checkVal.toString());
      },
      above: function (baseVal, checkVal) {
        if (isNil(checkVal)) checkVal = "";
        debug('Performing string comparison using ">" or "<" is probably not be the comparison you are looking for.');
        debug('Comparing "' + baseVal + '" >= "' + checkVal.toString() + '": ' + (baseVal >= checkVal.toString()));
        return (baseVal >= checkVal.toString());
      },
      longer: function (baseVal, checkVal) {
        if (isNil(checkVal)) checkVal = "";
        return baseVal.length >= checkVal.toString().length;
      },
      shorter: function (baseVal, checkVal) {
        if (isNil(checkVal)) checkVal = "";
        return baseVal.length <= checkVal.toString().length;
      }
    };
  assignIn(brie.determine, { "string": stringHandler });
};
