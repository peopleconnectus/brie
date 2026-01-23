const isNil = require('lodash/isNil');
module.exports = function () {
  const brie = this;
  const nilHandler = (cVal) => {
    if (isNil(cVal)) cVal = "";
    return cVal;
  };

  /**
   * Deterministic hash function (djb2 algorithm)
   * @param {string} str - The string to hash
   * @returns {number} - A positive 32-bit integer hash
   */
  const hashString = (str) => {
    const DJB2_SEED = 5381;
    let hash = DJB2_SEED;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
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
    },
    /**
     * Hash-based modulo comparison for percentage-based rollouts
     * Hashes the input string deterministically and checks if bucket < checkVal
     * @param {string} baseVal - The string to hash (e.g., userId, UUID)
     * @param {number|string} checkVal - The percentage threshold (0-100)
     * @returns {boolean} - true if the hashed bucket is less than checkVal
     */
    hash_mod: function (baseVal, checkVal) {
      const hash = hashString(String(baseVal));
      const bucket = hash % 100;
      return bucket < parseInt(checkVal, 10);
    }
  };
  Object.assign(brie.determine, { "string": stringHandler });
};
