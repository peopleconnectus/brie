'use strict';


/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node.
 *
 */
var flr = require('./ext/rules_engine'),
  some = require('lodash/some'),
  every = require('lodash/every'),
  cloneDeep = require('lodash/cloneDeep'),
  extend = require('lodash/assignIn'),
  concat = require('lodash/concat'),
  isArray = require('lodash/isArray'),
  isDate = require('lodash/isDate'),
  size = require('lodash/size'),
  debug = require('debug')('barry:core'),

  barry = module.exports = (function () {
    var features = {},
      data = {},
      overrides = {},
      functionalCriteria = {},
      getAllFlags = function () {
        return flr.allFeatures(data, overrides);
      },
      check = function (flagName) {
        if (features.hasOwnProperty(flagName)) {
          var featureMatch = flr.hasFeature(data, flagName);
          return (features[flagName].hasOwnProperty('criteriaLogic') && features[flagName]['criteriaLogic'] === 'any')
            ? some(featureMatch)
            : every(featureMatch);
        }
        return false;
      },
      setup = function (opts) {
        var optCriteria = opts.criteria || {},
          optFeatures = opts.features || {},
          optOverrides = opts.overrides || {},
          optContext = opts.data || {};
        functionalCriteria = cloneDeep(this.criteria, true);
        extend(functionalCriteria, optCriteria);
        features = optFeatures;
        overrides = optOverrides;
        extend(data, optContext);
        flr.setup({
          criteria: functionalCriteria,
          features: features
        });
        return barry;
      },
      factory = {
        getDiagnostics: function () {
          return {
            'criteria': this.criteria,
            'features': features,
            'data': data,
            'getType': factory.getType
          };
        },
        getType: function (ev) {
          if (typeof ev === 'object') {
            return (isArray(ev)) ? "array" : (isDate(ev)) ? "date" : "object";
          }
          return (typeof ev);
        }
      };
    return {
      setup: setup,
      getAll: getAllFlags,
      get: check,
      diagnostics: factory.getDiagnostics
    }
  })();


barry.knows = function (f) {
  f.apply(barry);
  return barry;
};
//barry.comp = {};
barry.criteria = {};
barry.determine = {};
barry
  .knows(require('./criteria/always'))
  .knows(require('./criteria/allowIds'))
  .knows(require('./criteria/has'))
  .knows(require('./reflection/is'))
  .knows(require('./criteria/percentScale'));
barry
//    .knows(require('./comparators/exist'))
//    .knows(require('./comparators/chain'))
//    .knows(require('./comparators/bool'))
  .knows(require('./comparators/number'))
  .knows(require('./comparators/object'))
  //    .knows(require('./comparators/eql'))
  .knows(require('./comparators/string'))
  .knows(require('./comparators/date'))
  .knows(require('./reflection/is'));
