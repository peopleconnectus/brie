const _get = require('lodash/get');
const _hasIn = require('lodash/hasIn');
module.exports = function () {
  const brie = this;
  const reject_values = function (data_in, c_data = { trait: "id", values: [] }) {
    const hasPathedItem = _hasIn(data_in, c_data.trait);
    const pathedValue = _get(data_in, c_data.trait);
    return !!(hasPathedItem && c_data.values && c_data.values.includes && !c_data.values.includes(pathedValue));
  };
  Object.assign(brie.criteria, { rejectValues: reject_values });
};
