/**
 * @fileoverview r_engine - feature validation for Barry
 */
'use strict';
var _ = require('lodash');

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
var self = module.exports = {

    _features: {},
    _criteria: {},
    setup: function (params) {
        self._criteria = params.criteria || {};
        self._features = params.features || {};
    },
    hasFeature: function (context, featureName) {
        console.log('======================================== :: r_engine:hasFeature');
        var feature = self._features[featureName];
        console.log("(j.corns) feature", feature);
        console.log("(j.corns) typeof feature", typeof feature);
        if (typeof feature != 'object') {
            console.log('========================== not an object :: end r_engine:hasFeature');
            return null;
        }
        var featureCriteria = feature.criteria || {};
        console.log("(j.corns) featureCriteria", featureCriteria);
        var isEnabled = false;
        _.forEach(featureCriteria, function (value, key, collection) {
            console.log('======================================== :: r_engine:featureCriteriaLoop');
            console.log("(j.corns) value", value);
            console.log("(j.corns) key", key);
            console.log("(j.corns) collection", collection);
            console.log('======================================== :: end r_engine:featureCriteriaLoop');
            /*var criteriaArray = Object.keys(featureCriteria);
             console.log("(j.corns) criteriaArray", criteriaArray);
             console.log("(j.corns) criteriaArray.length", criteriaArray.length);
             var isEnabled = true;
             if (criteriaArray.length == 0) {
             console.log('========================= invalid length :: end r_engine:hasFeature');
             return false;
             }
             criteriaArray.forEach(function (cKey) {
             if (isEnabled) {
             var c_data = featureCriteria[cKey];
             var c_func = self._criteria[cKey];
             isEnabled = c_func(context, c_data);
             }
             });*/
        });
        console.log('======================================== :: end r_engine:hasFeature');
        return isEnabled;
    },
    allFeatures: function (context, overrides) {
        overrides = overrides || {};
        var featureReconcile = {};
        Object.keys(self._features).forEach(function (featureName) {
            if (overrides[featureName] !== undefined) {
                featureReconcile[featureName] = overrides[featureName];
            } else {
                featureReconcile[featureName] = self.hasFeature(context, featureName);
            }
        });
        return featureReconcile;
    }

};