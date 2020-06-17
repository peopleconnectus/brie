'use strict';
const every = require('lodash/every');
const forEach = require('lodash/forEach');
const isEqual = require('lodash/isEqual');
const isNil = require('lodash/isNil');
const some = require('lodash/some');
function makeBoolean(sCheck) {
  return { "true": 1, "1": 1, "yes": 1, "on": 1 }.hasOwnProperty(sCheck.toString().toLowerCase());
}
const self = module.exports = {
  _features: {},
  _criteria: {},
  setup: function (params) {
    self._criteria = params.criteria;
    self._features = params.features;
  },
  hasFeature: function (context, featureName) {
    const feature = self._features[featureName];
    if (typeof feature != 'object') {
      return null;
    }
    const isEnabled = [];
    forEach((feature.criteria || []), function (value) {
      const criteriaArray = (typeof value === 'object') ? Object.keys(value) : [];
      if (criteriaArray.length == 0) {
        return [false];
      }
      const criteriaSuccess = [];
      criteriaArray.forEach(function (cKey) {
        const c_data = value[cKey];
        const c_func = self._criteria[cKey];
        criteriaSuccess.push(c_func(context, c_data));
      });
      isEnabled.push(every(criteriaSuccess));
    });
    return (isEqual(isEnabled, [])) ? [false] : isEnabled;
  },
  allFeatures: function (context, overrides) {
    const featureReconcile = {};
    forEach(self._features, function (value, key) {
      const enabled = isNil(value.enabled) ? true : value.enabled;
      if (enabled) {
        if (isNil(overrides[key])) {
          const featureMatch = self.hasFeature(context, key);
          featureReconcile[key] = (value.hasOwnProperty('criteriaLogic') && value['criteriaLogic'] === 'any')
            ? some(featureMatch)
            : every(featureMatch);
        } else {
          featureReconcile[key] = makeBoolean(overrides[key]);
        }
      }
    });
    return featureReconcile;
  }
};
