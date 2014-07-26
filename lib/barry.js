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
                console.log("(j.corns) self.criteria", self.criteria);
                console.log("(j.corns) self.features", self.features);
                console.log("(j.corns) self.data", self.data);
                return fflip.userFeatures(self.data);
            },
            check = function (flagName) {
                return fflip.userHasFeature(this.data, flagName);
            },
            getCriteria = function () {
                return self.features;
            },
            setup = function (opts) {
                var optCriteria = opts.criteria || {},
                    optFeatures = opts.features || {},
                    optContext = opts.data || {};
                _.extend(self.criteria, optCriteria);
                _.extend(self.features, optFeatures);
                _.extend(self.data, optContext);
                return self;
            };
        return {
            setup: setup,
            getAll: getAllFlags,
            get: check,
            getCriteria: getCriteria
        }
    })();
self.features = {};
self.data = {};
self.criteria = {
    allowUserIDs: function (idArr) {
        return typeof idArr.indexOf !== 'undefined' && self.data.hasOwnProperty('id') && ~idArr.indexOf(self.data.id);
    },
    always: function (val) {
        return val;
    },
    isPaidUser: function (isPaid) {
        return (self.data.hasOwnProperty('prospectStage') && self.data['prospectStage'] === 'BASIC') === isPaid;
    },
    percentScale: function (mods) {
        var percentMin = mods['percentMin'] || 0,
            percentMax = mods['percentMax'] || 100,
            salt = mods['salt'] || 1,
            testPhase = mods['testPhase'] || 'unknown test';
        percentMin = (percentMin < 1) ? percentMin : (percentMin / 100);
        percentMax = (percentMax < 1) ? percentMax : (percentMax / 100);
        console.log('======================================== :: index');
        console.log("(j.corns) (user.id*salt % 100)", (self.data.id * salt % 100));
        console.log("(j.corns) percentMin", percentMin);
        console.log("(j.corns) percentMax", percentMax);
        console.log("(j.corns) salt", salt);
        console.log('testPhase', testPhase);
        console.log("(j.corns) Math.min((user.id*salt)%100, percentMin)", Math.min((self.data.id * salt) % 100, percentMin));
        console.log("(j.corns) Math.max((user.id*salt), percentMax)%100", Math.max((self.data.id * salt) % 100, percentMax));
        var t = Math.min((self.data.id * salt) % 100, percentMin * 100) === percentMin * 100 && Math.max((self.data.id * salt) % 100, percentMax * 100) === percentMax * 100;
        console.log("(j.corns) t", t);
        console.log('======================================== :: end index');
        return t;
    }
};
self.check = function(){
    try {
        self.data = {'id':'123456789', 'prospectStage': 'NOT_BASIC'};
        self.criteria.allowUserIDs([123456789]);
        self.criteria.always(true);
        self.criteria.isPaidUser(true);
        self.criteria.percentScale({'testPhase':'self check'});
    } catch(e) {
        // console.log('error in barry self-check: ', e.message);
    }
};