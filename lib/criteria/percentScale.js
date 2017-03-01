var assignIn = require('lodash/assignIn'),
  debug = require('debug')('brie:criteria:percentScale');
module.exports = function () {
  var brie = this,
    p_scale = function (data_in, c_data) {
      var percentMin = (typeof c_data['percentMin'] === 'number') ? c_data['percentMin'] : 0,
        percentMax = (typeof c_data['percentMax'] === 'number') ? c_data['percentMax'] : 100,
        salt = c_data['salt'] || 1,
        testPhase = c_data['testPhase'] || 'unknown test';
      percentMin = (percentMin < 1) ? percentMin * 100 : percentMin;
      percentMax = (percentMax < 1) ? percentMax * 100 : percentMax;
      debug('======================================== :: brie :: percentScale');
      debug("(data_in.id*salt % 100)", (data_in.id * salt % 100));
      debug("percentMin", percentMin);
      debug("percentMax", percentMax);
      debug("salt", salt);
      debug("data_in.id", data_in.id);
      debug('testPhase', testPhase);
      debug("Math.min((data_in.id*salt)%100, percentMin)", Math.min((data_in.id * salt) % 100, percentMin));
      debug("Math.max((data_in.id*salt), percentMax)%100", Math.max((data_in.id * salt) % 100, percentMax));
      var t = Math.min((data_in.id * salt) % 100, percentMin) === percentMin && Math.max((data_in.id * salt) % 100, percentMax) === percentMax;
      debug("t", t);
      debug('======================================== :: end brie :: percentScale');
      return t;
    };
  assignIn(brie.criteria, { percentScale: p_scale });
};
