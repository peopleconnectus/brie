var filter = require('lodash/filter'),
  size = require('lodash/size'),
  isArray = require('lodash/isArray'),
  assignIn = require('lodash/assignIn'),
  debug = require('debug')('brie:criteria_allowIds');
module.exports = function () {
  var brie = this,
    allow_ids = function (data_in, idArr) {
      debug('Validating inclusion of id in "' + idArr + '"');
      var idMatch = filter(data_in, function (d) {
        return parseInt(d, 10) === parseInt(data_in['id'], 10);
      });
      return (isArray(idArr) && data_in.hasOwnProperty('id') && size(idMatch) > 0);
    };
  assignIn(brie.criteria, { allowIDs: allow_ids });
};
