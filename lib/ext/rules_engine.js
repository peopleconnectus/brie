/**
 * @fileoverview rules_engine - feature validation for Barry
 */
'use strict';
var _ = require('lodash-node');
function setCriteria(configVal) {
    if (typeof configVal == 'object') {
        self._criteria = configVal;
    } else {
        self._criteria = self._criteria;
    }
}
function setFeatures(configVal) {
    if (typeof configVal == 'object') {
        self._features = configVal;
    } else {
        self._features = self._features;
    }
}
function booleanify(sCheck) {
    switch(sCheck.toString().toLowerCase()) {
        case "true":
        case "1":
        case "yes":
        case "on":
            return true;
        default:
            return false;
    }
}
var self = module.exports = {

    _features: {},
    _criteria: {},
    setup: function (params) {
        self._criteria = params.criteria || {};
        self._features = params.features || {};
    },
    hasFeature: function (context, featureName) {
        var feature = self._features[featureName];
        if (typeof feature != 'object') {
            return null;
        }
        var featureCriteria = feature.criteria || {};
        var isEnabled = [];
        _.forEach(featureCriteria, function (value, key, collection) {
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
            isEnabled.push(_.every(criteriaSuccess));
        });
        return (_.isEqual(isEnabled, [])) ? [false] : isEnabled;
    },
    allFeatures: function (context, overrides) {
        overrides = overrides || {};
        var featureReconcile = {};
        _.forEach(self._features, function (value, key, collection) {
            var enabled = !!value.enabled || true;
            if (enabled) {
                if (overrides[key] !== undefined) {
                    featureReconcile[key] = booleanify(overrides[key]);
                } else {
                    var featureMatch = self.hasFeature(context, key);
                    featureReconcile[key] = (value.hasOwnProperty('criteriaLogic') && value['criteriaLogic'] === 'any')
                        ? _.some(featureMatch)
                        : _.every(featureMatch);
                }
            }
        });
        return featureReconcile;
    }
};
