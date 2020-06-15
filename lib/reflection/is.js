const _ = require('lodash');
const isNil = require('lodash/isNil');
const isEmpty = require('lodash/isEmpty');
module.exports = function () {
  const brie = this;
  const handler = function (baseVal, isVal) {
    if (isEmpty(isVal)) { // will short-circuit earlier if "is" is null/undefined
      return false;
    }
    if (isNil(isVal.type)) {
      return false;
    }
    if (isNil(isVal.trait) || !(_.get(baseVal, isVal.trait))) {
      return false;
    }

    const typeToCheck = isVal.type.toString().toLowerCase();
    const _isHash = {
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
    const traitToCheck = _.get(baseVal, isVal.trait);
    if (_isHash.hasOwnProperty(`is_${typeToCheck}`)) {
      return _isHash[`is_${typeToCheck}`].call(this, traitToCheck);
    }
    return false;
  };
  Object.assign(brie.criteria, { "is": handler });
};
