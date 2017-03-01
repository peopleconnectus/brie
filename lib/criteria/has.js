var assignIn = require('lodash/assignIn'),
  debug = require('debug')('barry:criteria:has');
module.exports = function () {
  var barry = this,
    getType = this.diagnostics().getType,
    has = function (data_in, c_data) {
      var traitVal,
        hasProp = false;
      debug('======================================== :: barry :: has');
      debug("\"has\" argument(s): ", c_data);
      if (c_data.hasOwnProperty('trait') && data_in.hasOwnProperty(c_data['trait'])) {
        traitVal = data_in[c_data['trait']];
        hasProp = true;
      }
      debug("Evaluation data has trait (" + c_data['trait'] + ")? ", hasProp);
      if (hasProp) {
        debug("Trait value (if found): ", traitVal);
        debug("Trait type: ", typeof traitVal);
        if (c_data.hasOwnProperty('comparison') && c_data.hasOwnProperty('value')) {
          var type = getType(data_in[c_data['trait']]).toLowerCase();
          try {
            var retOption = barry.determine[type][c_data['comparison']].apply(barry, [data_in[c_data['trait']], c_data['value']]);
            debug("Comparison outcome of barry.determine." + type + "." + c_data['comparison'] + "(" + [data_in[c_data['trait']], c_data['value']] + "):", retOption);
            debug('======================================== :: end barry :: has');
            return retOption;
          } catch (e) {
            debug('********** Exception handled in "has" method. **********');
            debug('Unrecognized type or comparator:\n       ', e.message);
            debug("Data Trait: ", c_data['trait']);
            debug("Trait Value: ", data_in[c_data['trait']]);
            debug("type: ", type);
            debug("comparator: ", c_data['comparison']);
            debug("Sorry.  Barry does not have a method called barry.determine." + type + "." + c_data['comparison'] + "()");
            debug("Returning boolean::false, by default.");
            debug('********** Exception handled in "has" method. **********');
            debug('======================================== :: end barry :: has');
            return false;
          }
        }
      }
      debug('======================================== :: end barry :: has');
      return hasProp;
    };
  assignIn(barry.criteria, { has: has });
};
