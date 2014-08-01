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
        var features = {},
            data = {},
            getAllFlags = function () {
                fflip.config({
                    criteria: criteria,
                    features: features
                });
                return fflip.userFeatures(data, overrides);
            },
            check = function (flagName) {
                return fflip.userHasFeature(this.data, flagName);
            },
            setup = function (opts) {
                var optCriteria = opts.criteria || {},
                    optFeatures = opts.features || {},
                    optContext = opts.data || {};
                self.showLogs = opts.showLogs || false;
                _.extend(criteria, optCriteria);
                _.extend(features, optFeatures);
                _.extend(data, optContext);
                return self;
            },
            factory = {
                getDiagnostics: function () {
                    return {'criteria': criteria, 'features': features, 'data': data};
                },
                isEqual: function (baseVal, checkVal) {
                    return((_.isString(baseVal) && _.isString(checkVal) && baseVal.toLowerCase() === checkVal.toLowerCase()) || _.isEqual(baseVal, checkVal));
                }
            },
            criteria = {
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
                    self.log('======================================== :: barry :: percentScale');
                    self.log("(barry) (dataIn.id*salt % 100)", (dataIn.id * salt % 100));
                    self.log("(barry) percentMin", percentMin);
                    self.log("(barry) percentMax", percentMax);
                    self.log("(barry) salt", salt);
                    self.log('testPhase', testPhase);
                    self.log("(barry) Math.min((dataIn.id*salt)%100, percentMin)", Math.min((dataIn.id * salt) % 100, percentMin));
                    self.log("(barry) Math.max((dataIn.id*salt), percentMax)%100", Math.max((dataIn.id * salt) % 100, percentMax));
                    var t = Math.min((dataIn.id * salt) % 100, percentMin * 100) === percentMin * 100 && Math.max((dataIn.id * salt) % 100, percentMax * 100) === percentMax * 100;
                    self.log("(barry) t", t);
                    self.log('======================================== :: end barry :: percentScale');
                    return t;
                },
                has: function (dataIn, mods) {
                    var traitVal = '',
                        hasProp = false;
                    self.log('======================================== :: barry :: has');
                    self.log("(barry) dataIn.hasOwnProperty(" + mods['trait'] + ")", dataIn.hasOwnProperty(mods['trait']));
                    self.log("(barry) dataIn['trait']", dataIn.hasOwnProperty(mods['trait']));
                    self.log("(barry) mods", mods);
                    if (mods.hasOwnProperty('trait') && dataIn.hasOwnProperty(mods['trait'])) {
                        traitVal = dataIn[mods['trait']];
                        hasProp = true;
                    }
                    self.log("(barry) dataIn has trait? ", hasProp);
                    self.log("(barry) Trait value (if found)", traitVal);
                    if (hasProp) {
                        if (mods.hasOwnProperty('equals')) {
                            self.log("(barry) mods['equals']", mods['equals']);
                            self.log('================================= equals :: end barry :: has');
                            return factory.isEqual(traitVal, mods['equals']);
                        } else if (mods.hasOwnProperty('oneOf')) {
                            // purposefully breaking conditional stages, here.  One call per criteria; this allows for both "and" and "or" rules to be established
                            self.log("(barry) mods['oneOf']", mods['oneOf']);
                            self.log('================================== oneOf :: end barry :: has');
                            return _.some(mods['oneOf'], function (v, idx, arr) {
                                return factory.isEqual(v, traitVal);
                            });
                        }
                        // TODO: else if :: contains
                    }
                    self.log('======================================== :: end barry :: has');
                    return hasProp;
                },
                hasMore: function (dataIn, mods) {
                    // TODO: numeric comparison
                    // TODO: date conversion and comparison
                    // TODO: count comparison (array length)
                    return false;
                },
                hasLess: function (dataIn, mods) {
                    // TODO: numeric comparison
                    // TODO: date conversion and comparison
                    // TODO: count comparison (array length)
                    return false;
                }
            },
            selfCheck = function () {
                try {
                    var testData = {'id': '123456789', 'prospectStage': 'NOT_BASIC'};
                    criteria.allowUserIDs(testData, [123456789]);
                    criteria.always(testData, true);
                    criteria.isPaidUser(testData, true);
                    criteria.percentScale(testData, {'testPhase': 'self check'});
                } catch (e) {
                    // self.log('error in barry self-check: ', e.message);
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
self.log = function () {
    if (self.showLogs) {
        console.log.apply(this, arguments);
    }
};