const _get = require('lodash/get');
module.exports = function () {
  const brie = this;
  const allow_values = function (data_in, c_data = { trait: "id", values: [] }) {
    const pathedValue = _get(data_in, c_data.trait);
    return pathedValue && c_data.values && c_data.values.includes && c_data.values.includes(pathedValue);
  };
  Object.assign(brie.criteria, { allowValues: allow_values });
};
