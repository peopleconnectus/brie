const _hasIn = require('lodash/hasIn');
const _get = require('lodash/get');
module.exports = function () {
  const brie = this;
  const getType = this.diagnostics().getType;
  const has = function (data_in, c_data = {trait: "id", values: []}) {
    let hasProp = false;
    if (_hasIn(data_in, c_data.trait)) {
      const pathedValue = _get(data_in, c_data.trait);
      if (c_data.hasOwnProperty('comparison') && c_data.hasOwnProperty('value')) {
        const type = getType(pathedValue).toLowerCase();
        try {
          return brie.determine[type][c_data['comparison']].apply(brie, [_get(data_in, c_data['trait']), c_data['value']]);
        } catch (e) {
          console.error('********** Exception handled in "has" method. **********');
          console.error('Unrecognized type or comparator:\n       ', e.message);
          console.error("Data Trait: ", c_data['trait']);
          console.error("Trait Value: ", _get(data_in, c_data['trait']));
          console.error("type: ", type);
          console.error("comparator: ", c_data['comparison']);
          console.error("Sorry.  brie does not have a method called brie.determine." + type + "." + c_data['comparison'] + "()");
          console.error("Returning boolean::false, by default.");
          console.error('********** Exception handled in "has" method. **********');
          return false;
        }
      }
      return true; // without 'comparison' check, the question is, "does the data 'has' the value". Here we know the answer is "yes".
    }
    return false; // without 'comparison' check, the question is, "does the data 'has' the value". Here we know the answer is "no".
  };
  Object.assign(brie.criteria, { has: has });
};
