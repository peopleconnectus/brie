const _get = require('lodash/get');
module.exports = function () {
  const brie = this;
  const p_scale = function (data_in, c_data) {
    const perc_p = c_data.trait || 'id';
    const percentMinGiven = (typeof c_data['percentMin'] === 'number') ? c_data['percentMin'] : 0,
      percentMaxGiven = (typeof c_data['percentMax'] === 'number') ? c_data['percentMax'] : 100,
      salt = c_data['salt'] || 1,
      // uses lodash "_get" in case our trait is at a deep path
      data_check_value = _get(data_in, perc_p) || Number.MIN_SAFE_INTEGER,
      percentMin = (percentMinGiven < 1) ? percentMinGiven * 100 : percentMinGiven,
      percentMax = (percentMaxGiven < 1) ? percentMaxGiven * 100 : percentMaxGiven;
    const t = Math.min((data_check_value * salt) % 100, percentMin) === percentMin && Math.max((data_check_value * salt) % 100, percentMax) === percentMax;
    return t;
  };
  Object.assign(brie.criteria, { percentScale: p_scale });
};
