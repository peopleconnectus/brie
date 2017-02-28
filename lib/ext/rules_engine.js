'use strict';
var forEach = require('lodash/forEach'),
  every = require('lodash/every'),
  some = require('lodash/some'),
  isEqual = require('lodash/isEqual'),
  isNil = require('lodash/isNil');
/*function setCriteria(configVal) {
 if (typeof configVal == 'object') {
 self._criteria = configVal;
 } else {
 self._criteria = self._criteria;
 }
 }*/
/*function setFeatures(configVal) {
 if (typeof configVal == 'object') {
 self._features = configVal;
 } else {
 self._features = self._features;
 }
 }*/
function makeBoolean(sCheck) {
  return { "true": 1, "1": 1, "yes": 1, "on": 1 }.hasOwnProperty(sCheck.toString().toLowerCase());
}
var self = module.exports = {
  _features: {},
  _criteria: {},
  setup: function (params) {
    self._criteria = params.criteria;
    self._features = params.features;
  },
  hasFeature: function (context, featureName) {
    var feature = self._features[featureName];
    if (typeof feature != 'object') {
      return null;
    }
    var featureCriteria = feature.criteria || [];
    var isEnabled = [];
    forEach(featureCriteria, function (value) {
      var criteriaArray = (typeof value === 'object') ? Object.keys(value) : [];
      if (criteriaArray.length == 0) {
        return [false];
      }
      var criteriaSuccess = [];
      criteriaArray.forEach(function (cKey) {
        var c_data = value[cKey];
        var c_func = self._criteria[cKey];
        criteriaSuccess.push(c_func(context, c_data));
      });
      isEnabled.push(every(criteriaSuccess));
    });
    return (isEqual(isEnabled, [])) ? [false] : isEnabled;
  },
  allFeatures: function (context, overrides) {
    var featureReconcile = {};
    forEach(self._features, function (value, key) {
      var enabled = isNil(value.enabled) ? true : value.enabled;
      if (enabled) {
        if (isNil(overrides[key])) {
          var featureMatch = self.hasFeature(context, key);
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
