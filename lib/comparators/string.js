const isNil = require('lodash/isNil');
module.exports = function () {
  const brie = this;
  const nilHandler = (cVal) => {
    if (isNil(cVal)) cVal = "";
    return cVal;
  };
  const stringHandler = {
    equals: function (baseVal, checkVal) {
      return baseVal === nilHandler(checkVal).toString();
    },
    like: function (baseVal, checkVal) {
      return baseVal.toLowerCase() == nilHandler(checkVal).toString().toLowerCase();
    },
    below: function (baseVal, checkVal) {
      return (baseVal <= nilHandler(checkVal).toString());
    },
    above: function (baseVal, checkVal) {
      return (baseVal >= nilHandler(checkVal).toString());
    },
    longer: function (baseVal, checkVal) {
      return baseVal.length >= nilHandler(checkVal).toString().length;
    },
    shorter: function (baseVal, checkVal) {
      return baseVal.length <= nilHandler(checkVal).toString().length;
    }
  };
  Object.assign(brie.determine, { "string": stringHandler });
};
