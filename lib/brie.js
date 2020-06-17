'use strict';


/**
 *   This is brie
 *   =============
 *   This Business Rules Engine (B.R.E, or "brie") is a transient Feature Flipping Criteria System for Node.
 *
 */
const rulesEngine = require('./ext/rules_engine');
const some = require('lodash/some');
const every = require('lodash/every');
const isDate = require('lodash/isDate');

const brie = module.exports = (function () {
  let features = {};
  let data = {};
  let overrides = {};
  let functionalCriteria = {};
  const getAllFlags = function () {
    return rulesEngine.allFeatures(data, overrides);
  };
  const check = function (flagName) {
    if (features.hasOwnProperty(flagName)) {
      const featureMatch = rulesEngine.hasFeature(data, flagName);
      return (features[flagName].hasOwnProperty('criteriaLogic') && features[flagName]['criteriaLogic'] === 'any')
        ? some(featureMatch)
        : every(featureMatch);
    }
    return false;
  };
  const setup = function (opts) {
    const optCriteria = opts.criteria || {};
    const optFeatures = opts.features || {};
    const optOverrides = opts.overrides || {};
    const optContext = opts.data || {};
    functionalCriteria = Object.assign({}, this.criteria);
    Object.assign(functionalCriteria, optCriteria);
    features = optFeatures;
    overrides = optOverrides;
    Object.assign(data, optContext);
    rulesEngine.setup({
      criteria: functionalCriteria,
      features: features
    });
    return brie;
  };
  const factory = {
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
        return (Array.isArray(ev)) ? "array" : (isDate(ev)) ? "date" : "object";
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
  .knows(require('./criteria/allowValues'))
  .knows(require('./criteria/rejectValues'))
  .knows(require('./criteria/has'))
  .knows(require('./reflection/is'))
  .knows(require('./criteria/percentScale'));
brie
  .knows(require('./comparators/number'))
  .knows(require('./comparators/object'))
  .knows(require('./comparators/string'))
  .knows(require('./comparators/date'))
  .knows(require('./reflection/is'));
