'use strict';
/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node.
 *
 */
var flr = require('./ext/rules_engine'),
    _ = require('lodash-node'),
    barry = module.exports = (function () {
        var features = {},
            data = {},
            overrides = {},
            functionalCriteria = {},
            getAllFlags = function () {
                return flr.allFeatures(data, overrides);
            },
            check = function (flagName) {
                if (features.hasOwnProperty(flagName)) {
                    var featureMatch = flr.hasFeature(data, flagName);
                    return (features[flagName].hasOwnProperty('criteriaLogic') && features[flagName]['criteriaLogic'] === 'any')
                        ? _.some(featureMatch)
                        : _.every(featureMatch);
                }
                return false;
            },
            setup = function (opts) {
                var optCriteria = opts.criteria || {},
                    optFeatures = opts.features || {},
                    optOverrides = opts.overrides || {},
                    optContext = opts.data || {};
                barry.showLogs = opts.showLogs || false;
                functionalCriteria = _.clone(criteria, true);
                _.extend(functionalCriteria, optCriteria);
                features = optFeatures;
                overrides = optOverrides;
                _.extend(data, optContext);
                flr.setup({
                    criteria: functionalCriteria,
                    features: features
                });
                return barry;
            },
            factory = {
                getDiagnostics: function () {
                    return {'criteria': criteria, 'features': features, 'data': data};
                },
                getType: function (ev) {
//                    if(typeof ev === 'string') {
//                        return ((new Date(ev) === "Invalid Date"))?"string":"date";
//                    }
                    if (typeof ev === 'object') {
                        return (_.isArray(ev)) ? "array" : (_.isDate(ev)) ? "date" : "object";
                    }
                    return (typeof ev);
                }
            },
            criteria = {
                allowIDs: function (dataIn, idArr) {
                    return (typeof idArr.indexOf !== 'undefined' && dataIn.hasOwnProperty('id') && (_.filter(dataIn, function (d) {
                        return parseInt(d, 10) === parseInt(dataIn['id'], 10);
                    }).length > 0));
                },
                always: function (dataIn, val) {
                    return val;
                },
                percentScale: function (dataIn, c_data) {
                    var percentMin = (typeof c_data['percentMin'] === 'number')?c_data['percentMin']:0,
                        percentMax = (typeof c_data['percentMax'] === 'number')?c_data['percentMax']:100,
                        salt = c_data['salt'] || 1,
                        testPhase = c_data['testPhase'] || 'unknown test';
                    percentMin = (percentMin < 1) ? percentMin * 100 : percentMin;
                    percentMax = (percentMax < 1) ? percentMax * 100 : percentMax;
                    barry.log('======================================== :: barry :: percentScale');
                    barry.log("(barry) (dataIn.id*salt % 100)", (dataIn.id * salt % 100));
                    barry.log("(barry) percentMin", percentMin);
                    barry.log("(barry) percentMax", percentMax);
                    barry.log("(barry) salt", salt);
                    barry.log("(barry) dataIn.id", dataIn.id);
                    barry.log('(barry) testPhase', testPhase);
                    barry.log("(barry) Math.min((dataIn.id*salt)%100, percentMin)", Math.min((dataIn.id * salt) % 100, percentMin));
                    barry.log("(barry) Math.max((dataIn.id*salt), percentMax)%100", Math.max((dataIn.id * salt) % 100, percentMax));
                    var t = Math.min((dataIn.id * salt) % 100, percentMin) === percentMin && Math.max((dataIn.id * salt) % 100, percentMax) === percentMax;
                    barry.log("(barry) t", t);
                    barry.log('======================================== :: end barry :: percentScale');
                    return t;
                },
                has: function (dataIn, c_data) {
                    var _self = this,
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
                                barry.log('(barry) Unrecognized type or comparator:\n       ', e.message);
                                barry.log("(barry) Data Trait: ", c_data['trait']);
                                barry.log("(barry) Trait Value: ", dataIn[c_data['trait']]);
                                barry.log("(barry) type: ", type);
                                barry.log("(barry) comparator: ", c_data['comparison']);
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
            };
        return {
            setup: setup,
            getAll: getAllFlags,
            get: check,
            diagnostics: factory.getDiagnostics
        }
    })
    ();
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
//    .knows(require('./comparators/exist'))
//    .knows(require('./comparators/chain'))
//    .knows(require('./comparators/bool'))
    .knows(require('./comparators/number'))
    .knows(require('./comparators/object'))
//    .knows(require('./comparators/eql'))
//    .knows(require('./comparators/type'))
    .knows(require('./comparators/string'))
    .knows(require('./comparators/date'))
//    .knows(require('./comparators/property'))
//    .knows(require('./comparators/match'))
//    .knows(require('./comparators/contain'))
;
