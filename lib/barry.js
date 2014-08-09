'use strict';
/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node.
 *
 */
var flr = require('./ext/r_engine'),
    _ = require('lodash-node'),
    self = module.exports = (function () {
        var features = {},
            data = {},
            getAllFlags = function () {
                flr.setup({
                    criteria: criteria,
                    features: features
                });
                return flr.allFeatures(data);
            },
            check = function (flagName) {
                return flr.hasFeature(this.data, flagName);
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
                percentScale: function (dataIn, c_data) {
                    var percentMin = c_data['percentMin'] || 0,
                        percentMax = c_data['percentMax'] || 100,
                        salt = c_data['salt'] || 1,
                        testPhase = c_data['testPhase'] || 'unknown test';
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
                has: function (dataIn, c_data) {
                    var traitVal = '',
                        hasProp = false;
                    self.log('======================================== :: barry :: has');
                    self.log("(barry) dataIn.hasOwnProperty(" + c_data['trait'] + ")", dataIn.hasOwnProperty(c_data['trait']));
                    self.log("(barry) c_data", c_data);
                    if (c_data.hasOwnProperty('trait') && dataIn.hasOwnProperty(c_data['trait'])) {
                        traitVal = dataIn[c_data['trait']];
                        hasProp = true;
                    }
                    self.log("(barry) dataIn has trait? ", hasProp);
                    self.log("(barry) Trait value (if found)", traitVal);
                    if (hasProp) {
                        if (c_data.hasOwnProperty('equals')) {
                            self.log("(barry) c_data['equals']", c_data['equals']);
                            self.log('================================= equals :: end barry :: has');
                            return factory.isEqual(traitVal, c_data['equals']);
                        } else if (c_data.hasOwnProperty('oneOf')) {
                            self.log("(barry) c_data['oneOf']", c_data['oneOf']);
                            self.log('================================== oneOf :: end barry :: has');
                            return _.some(c_data['oneOf'], function (v, idx, arr) {
                                return factory.isEqual(v, traitVal);
                            });
                        }
                    }
                    self.log('======================================== :: end barry :: has');
                    return hasProp;
                },
                hasMore: function (dataIn, c_data) {
                    // TODO: numeric comparison
                    // TODO: date conversion and comparison
                    // TODO: count comparison (array length)
                    return false;
                },
                hasLess: function (dataIn, c_data) {
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