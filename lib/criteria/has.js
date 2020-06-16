var assignIn = require('lodash/assignIn'),
  debug = require('debug')('brie:criteria_has');
module.exports = function () {
  var brie = this,
    getType = this.diagnostics().getType,
    has = function (data_in, c_data) {
      var traitVal,
        traitKey,
        hasProp = false;
      debug('======================================== :: brie :: has');
      debug("\"has\" argument(s): ", c_data);
      if (c_data.hasOwnProperty('trait')) {
        traitKey = c_data['trait'];
        if (data_in.hasOwnProperty(traitKey)) {
          traitVal = data_in[traitKey];
          hasProp = true;
        } else {
          // if the trait key contains '.', assume it is nested
          if (traitKey.indexOf('.') > -1) {
            var keys = traitKey.split('.');
            var obj = data_in;
            for (var i = 0, len = keys.length; i < len; i++) {
              if (!obj || !obj.hasOwnProperty(keys[i])) {
                hasProp = false;
              } else {
                obj = obj[keys[i]];
                traitVal = obj;
                hasProp = true;
              }
            }
          }
        }
      }
      debug("Evaluation data has trait (" + c_data['trait'] + ")? ", hasProp);
      if (hasProp) {
        debug("Trait value (if found): ", traitVal);
        debug("Trait type: ", typeof traitVal);
        if (c_data.hasOwnProperty('comparison') && c_data.hasOwnProperty('value')) {
          var type = getType(traitVal).toLowerCase();
          try {
            var retOption = brie.determine[type][c_data['comparison']].apply(brie, [traitVal, c_data['value']]);
            debug("Comparison outcome of brie.determine." + type + "." + c_data['comparison'] + "(" + [traitVal, c_data['value']] + "):", retOption);
            debug('======================================== :: end brie :: has');
            return retOption;
          } catch (e) {
            debug('********** Exception handled in "has" method. **********');
            debug('Unrecognized type or comparator:\n       ', e.message);
            debug("Data Trait: ", c_data['trait']);
            debug("Trait Value: ", traitVal);
            debug("type: ", type);
            debug("comparator: ", c_data['comparison']);
            debug("Sorry.  brie does not have a method called brie.determine." + type + "." + c_data['comparison'] + "()");
            debug("Returning boolean::false, by default.");
            debug('********** Exception handled in "has" method. **********');
            debug('======================================== :: end brie :: has');
            return false;
          }
        }
      }
      debug('======================================== :: end brie :: has');
      return hasProp;
    };
  assignIn(brie.criteria, { has: has });
};
