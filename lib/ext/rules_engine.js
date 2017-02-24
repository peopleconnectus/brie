/**
 * @fileoverview rules_engine - feature validation for Barry
 */
'use strict';
var _ = require('lodash');
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
function booleanify(sCheck) {
  return { "true": 1, "1": 1, "yes": 1, "on": 1 }.hasOwnProperty(sCheck.toString().toLowerCase());
}
var self = module.exports = {
  _features: {},
  _criteria: {},
  setup: function (params) {
    self._criteria = params.criteria || {};
    self._features = params.features || {};
  },
  hasFeature: function (context, featureName, csl) {
    csl.log('======================================== :: rules_engine::hasFeature');
    csl.log("(j.corns) featureName", featureName);
    var feature = self._features[featureName];
    csl.log("(j.corns) typeof feature", typeof feature);
    if (typeof feature != 'object') {
      csl.log('======================================== :: end rules_engine::hasFeature (null)');
      return null;
    }
    var featureCriteria = feature.criteria || [];
    csl.log("(j.corns) featureCriteria", featureCriteria);
    csl.log('======================================== :: end rules_engine::hasFeature');
    var isEnabled = [];
    _.forEach(featureCriteria, function (value, key, collection) {
      console.log('======================================== :: rules_engine::args');
      console.log("(j.corns) value", value);
      console.log("(j.corns) key", key);
      console.log("(j.corns) collection", collection);
      console.log('======================================== :: end rules_engine::args');
      var criteriaArray = (typeof value === 'object') ? Object.keys(value) : [];
      csl.log('======================================== :: rules_engine::forEach');
      csl.log("(j.corns) criteriaArray", criteriaArray);
      csl.log("(j.corns) criteriaArray.length", criteriaArray.length);
      if (criteriaArray.length == 0) {
        csl.log('======================================== :: end rules_engine::forEach (empty)');
        return [false];
      }
      var criteriaSuccess = [];
      criteriaArray.forEach(function (cKey) {
        var c_data = value[cKey];
        var c_func = self._criteria[cKey];
        criteriaSuccess.push(c_func(context, c_data));
      });
      csl.log('======================================== :: end rules_engine::forEach');
      isEnabled.push(_.every(criteriaSuccess));
    });
    return (_.isEqual(isEnabled, [])) ? [false] : isEnabled;
  },
  allFeatures: function (context, overrides, csl) {
    overrides = overrides || {};
    var featureReconcile = {};
    _.forEach(self._features, function (value, key, collection) {
      var enabled = !!value.enabled || true;
      if (enabled) {
        if (_.isNil(overrides[key])) {
          var featureMatch = self.hasFeature(context, key, csl);
          featureReconcile[key] = (value.hasOwnProperty('criteriaLogic') && value['criteriaLogic'] === 'any')
            ? _.some(featureMatch)
            : _.every(featureMatch);
        } else {
          featureReconcile[key] = booleanify(overrides[key]);
        }
      }
    });
    return featureReconcile;
  }
};
