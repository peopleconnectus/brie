'use strict';


/**
 *   This is brie
 *   =============
 *   This Business Rules Engine (B.R.E, or "brie") is a transient Feature Flipping Criteria System for Node.
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
  debug = require('debug')('brie:core'),

  brie = module.exports = (function () {
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
        return brie;
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


brie.knows = function (f) {
  f.apply(brie);
  return brie;
};
//brie.comp = {};
brie.criteria = {};
brie.determine = {};
brie
  .knows(require('./criteria/always'))
  .knows(require('./criteria/allowIds'))
  .knows(require('./criteria/has'))
  .knows(require('./reflection/is'))
  .knows(require('./criteria/percentScale'));
brie
  .knows(require('./comparators/number'))
  .knows(require('./comparators/object'))
  .knows(require('./comparators/string'))
  .knows(require('./comparators/date'))
  .knows(require('./reflection/is'));
