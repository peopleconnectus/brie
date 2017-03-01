var debug = require('debug')('brie:knows:is'),
  _ = require('lodash'),
  isNil = require('lodash/isNil'),
  isEmpty = require('lodash/isEmpty'),
  assignIn = require('lodash/assignIn');
module.exports = function () {
  var brie = this,
    handler = function (baseVal, isVal) {
      if (isEmpty(isVal)) { // will short-circuit earlier if "is" is null/undefined
        debug('No comparison provided.');
        return false;
      }
      if(isNil(isVal.type)) {
        debug('No type provided for comparison.');
        return false;
      }
      if(isNil(isVal.trait) || !(_.get(baseVal, isVal.trait))) {
        debug('No trait available for comparison.');
        return false;
      }

      var typeToCheck = isVal.type,
        _isHash = {
          is_array: _.isArray,
          is_boolean: _.isBoolean,
          is_date: _.isDate,
          is_empty: _.isEmpty,
          is_finite: _.isFinite,
          is_function: _.isFunction,
          is_integer: _.isInteger,
          is_nan: _.isNaN,
          is_nil: _.isNil,
          is_null: _.isNull,
          is_number: _.isNumber,
          is_object: _.isObject,
          is_regex: _.isRegExp,
          is_regular_expression: _.isRegExp,
          is_regexp: _.isRegExp,
          is_string: _.isString,
          is_undefined: _.isUndefined
        };
      var traitToCheck = _.get(baseVal, isVal.trait);
      typeToCheck = typeToCheck.toString().toLowerCase();
      debug('Checking if ' + JSON.stringify(traitToCheck) + ' is of type "' + typeToCheck + '"');
      if (_isHash.hasOwnProperty('is_' + typeToCheck)) {
        debug('checking ' + traitToCheck + ' against "is_' + typeToCheck + '"');
        return _isHash['is_' + typeToCheck].call(this, traitToCheck);
      }
      debug('No known type check for "' + typeToCheck + '".  Possible checks are (case-sensitive)');
      return false;
    };
  assignIn(brie.criteria, { "is": handler });
};
