'use strict';
/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node.
 *
 */
var flr = require('./ext/r_engine'),
    _ = require('lodash-node'),
    barry = module.exports = (function () {
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
                barry.showLogs = opts.showLogs || false;
                _.extend(criteria, optCriteria);
                _.extend(features, optFeatures);
                _.extend(data, optContext);
                return barry;
            },
            factory = {
                getDiagnostics: function () {
                    return {'criteria': criteria, 'features': features, 'data': data};
                },
                getType: function (ev) {
                    if (typeof ev === 'object') {
                        return (_.isArray(ev)) ? "array" : (_.isDate(ev)) ? "date" : "object";
                    }
                    return (typeof ev);
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
                    barry.log('======================================== :: barry :: percentScale');
                    barry.log("(barry) (dataIn.id*salt % 100)", (dataIn.id * salt % 100));
                    barry.log("(barry) percentMin", percentMin);
                    barry.log("(barry) percentMax", percentMax);
                    barry.log("(barry) salt", salt);
                    barry.log('(barry) testPhase', testPhase);
                    barry.log("(barry) Math.min((dataIn.id*salt)%100, percentMin)", Math.min((dataIn.id * salt) % 100, percentMin));
                    barry.log("(barry) Math.max((dataIn.id*salt), percentMax)%100", Math.max((dataIn.id * salt) % 100, percentMax));
                    var t = Math.min((dataIn.id * salt) % 100, percentMin * 100) === percentMin * 100 && Math.max((dataIn.id * salt) % 100, percentMax * 100) === percentMax * 100;
                    barry.log("(barry) t", t);
                    barry.log('======================================== :: end barry :: percentScale');
                    return t;
                },
                has: function (dataIn, c_data) {
                    var _self=this,
                        traitVal,
                        hasProp = false;
                    barry.log('======================================== :: barry :: has');
                    barry.log("(barry) \"has\" argument(s): ", c_data);
                    if (c_data.hasOwnProperty('trait') && dataIn.hasOwnProperty(c_data['trait'])) {
                        traitVal = dataIn[c_data['trait']];
                        hasProp = true;
                    }
                    barry.log("(barry) Evaluation data has trait (" + c_data['trait'] + ")? ", hasProp);
                    if (hasProp) {
                        barry.log("(barry) Trait value (if found): ", traitVal);
                        barry.log("(barry) Trait type: ", typeof traitVal);
                        if (c_data.hasOwnProperty('comparison') && c_data.hasOwnProperty('value')) {
                            var type = factory.getType(dataIn[c_data['trait']]).toLowerCase();
                            try {
                                var retOption = barry.determine[type][c_data['comparison']].apply(barry, [dataIn[c_data['trait']], c_data['value']]);
                                barry.log("(barry) Comparison outcome of barry.determine." + type + "." + c_data['comparison'] + "(" + [dataIn[c_data['trait']], c_data['value']] + "):", retOption);
                                barry.log('======================================== :: end barry :: has');
                                return retOption;
                            } catch (e) {
                                barry.log('(barry) ********** Exception handled in "has" method. **********');
                                barry.log('(barry) Unrecognize type or comparitor:\n       ', e.message);
                                barry.log("(barry) Data Trait: ", c_data['trait']);
                                barry.log("(barry) Trait Value: ", dataIn[c_data['trait']]);
                                barry.log("(barry) type: ", type);
                                barry.log("(barry) comparitor: ", c_data['comparison']);
                                barry.log("(barry) Sorry.  Barry does not have a method called barry.determine." + type + "." + c_data['comparison'] + "()");
                                barry.log("(barry) Returning boolean::false, by default.");
                                barry.log('(barry) ********** Exception handled in "has" method. **********');
                                barry.log('======================================== :: end barry :: has');
                                return false;
                            }
                        }
                    }
                    barry.log('======================================== :: end barry :: has');
                    return hasProp;
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
barry.showLogs = false;
barry.log = function () {
    if (barry.showLogs) {
        console.log.apply(this, arguments);
    }
};
barry.knows = function (f) {
    f.apply(barry);
    return barry;
};
//barry.comp = {};
barry
//    .knows(require('./comparitors/exist'))
//    .knows(require('./comparitors/chain'))
//    .knows(require('./comparitors/bool'))
    .knows(require('./comparitors/number'))
    .knows(require('./comparitors/object'))
//    .knows(require('./comparitors/eql'))
//    .knows(require('./comparitors/type'))
    .knows(require('./comparitors/string'))
//    .knows(require('./comparitors/property'))
//    .knows(require('./comparitors/match'))
//    .knows(require('./comparitors/contain'))
;