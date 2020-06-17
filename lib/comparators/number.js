
module.exports = function () {
  const brie = this;
  const numberHandler = {
    equals: function (baseVal, checkVal = 0) {
      return baseVal == parseInt(checkVal, 10);
    },
    below: function (baseVal, checkVal) {
      return baseVal <= parseInt(checkVal, 10);
    },
    above: function (baseVal, checkVal) {
      return baseVal >= parseInt(checkVal, 10);
    }
  };
  Object.assign(brie.determine, { "number": numberHandler });
  brie.determine.number.longer = brie.determine.number.above;
  brie.determine.number.shorter = brie.determine.number.below;
};
