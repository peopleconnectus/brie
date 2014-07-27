'use strict';
/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node, based on [fflip](https://github.com/FredKSchott/fflip).
 *
 */
var fflip = require('fflip'),
    _ = require('lodash-node'),
    self = module.exports = (function () {
        var getAllFlags = function () {
                fflip.config({
                    criteria: self.criteria,
                    features: self.features
                });
                return fflip.userFeatures(self.data);
            },
            check = function (flagName) {
                return fflip.userHasFeature(this.data, flagName);
            },
            setup = function (opts) {
                var optCriteria = opts.criteria || {},
                    optFeatures = opts.features || {},
                    optContext = opts.data || {};
                self.showLogs = opts.showLogs || false;
                _.extend(self.criteria, optCriteria);
                _.extend(self.features, optFeatures);
                _.extend(self.data, optContext);
                return self;
            },
            factory = {
                getDiagnostics: function () {
                    return {'criteria': self.criteria, 'features': self.features, 'data': self.data};
                }
            };
        return {
            setup: setup,
            getAll: getAllFlags,
            get: check,
            diagnostics: factory.getDiagnostics
        }
    })();
self.showLogs = false;
self.features = {};
self.data = {};
self.criteria = {
    allowUserIDs: function (dataIn, idArr) {

        return typeof idArr.indexOf !== 'undefined' && dataIn.hasOwnProperty('id') && ~idArr.indexOf(dataIn.id);
    },
    always: function (dataIn, val) {
        return val;
    },
    isPaidUser: function (dataIn, isPaid) {
        return (dataIn.hasOwnProperty('prospectStage') && dataIn['prospectStage'] === 'BASIC') === isPaid;
    },
    percentScale: function (dataIn, mods) {
        var percentMin = mods['percentMin'] || 0,
            percentMax = mods['percentMax'] || 100,
            salt = mods['salt'] || 1,
            testPhase = mods['testPhase'] || 'unknown test';
        percentMin = (percentMin < 1) ? percentMin : (percentMin / 100);
        percentMax = (percentMax < 1) ? percentMax : (percentMax / 100);
        self.log('======================================== :: index');
        self.log("(j.corns) (user.id*salt % 100)", (dataIn.id * salt % 100));
        self.log("(j.corns) percentMin", percentMin);
        self.log("(j.corns) percentMax", percentMax);
        self.log("(j.corns) salt", salt);
        self.log('testPhase', testPhase);
        self.log("(j.corns) Math.min((user.id*salt)%100, percentMin)", Math.min((dataIn.id * salt) % 100, percentMin));
        self.log("(j.corns) Math.max((user.id*salt), percentMax)%100", Math.max((dataIn.id * salt) % 100, percentMax));
        var t = Math.min((dataIn.id * salt) % 100, percentMin * 100) === percentMin * 100 && Math.max((dataIn.id * salt) % 100, percentMax * 100) === percentMax * 100;
        self.log("(j.corns) t", t);
        self.log('======================================== :: end index');
        return t;
    }
};
self.log = function () {
    if (self.showLogs) {
        console.log.apply(this, arguments);
    }
};
self.check = function () {
    try {
        var testData = {'id': '123456789', 'prospectStage': 'NOT_BASIC'};
        self.criteria.allowUserIDs(testData, [123456789]);
        self.criteria.always(testData, true);
        self.criteria.isPaidUser(testData, true);
        self.criteria.percentScale(testData, {'testPhase': 'self check'});
    } catch (e) {
        // self.log('error in barry self-check: ', e.message);
    }
};