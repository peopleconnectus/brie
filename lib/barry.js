'use strict';


/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node.
 *
 */
var flr = require('./ext/rules_engine'),
  some = require('lodash/some'),
  every = require('lodash/every'),
  cloneDeep = require('lodash/cloneDeep'),
  extend = require('lodash/assignIn'),
  filter = require('lodash/filter'),
  concat = require('lodash/concat'),
  isArray = require('lodash/isArray'),
  isDate = require('lodash/isDate'),
  size = require('lodash/size'),
  debug = require('debug')('barry:core'),

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
            ? some(featureMatch)
            : every(featureMatch);
        }
        return false;
      },
      setup = function (opts) {
        var optCriteria = opts.criteria || {},
          optFeatures = opts.features || {},
          optOverrides = opts.overrides || {},
          optContext = opts.data || {};
        functionalCriteria = cloneDeep(criteria, true);
        extend(functionalCriteria, optCriteria);
        features = optFeatures;
        overrides = optOverrides;
        extend(data, optContext);
        flr.setup({
          criteria: functionalCriteria,
          features: features
        });
        return barry;
      },
      factory = {
        getDiagnostics: function () {
          return { 'criteria': criteria, 'features': features, 'data': data, 'getType': factory.getType };
        },
        getType: function (ev) {
//                    if(typeof ev === 'string') {
//                        return ((new Date(ev) === "Invalid Date"))?"string":"date";
//                    }
          if (typeof ev === 'object') {
            return (isArray(ev)) ? "array" : (isDate(ev)) ? "date" : "object";
          }
          return (typeof ev);
        }
      },
      criteria = {
        allowIDs: function (dataIn, idArr) {
          var idMatch = filter(dataIn, function (d) {
            return parseInt(d, 10) === parseInt(dataIn['id'], 10);
          });
          return (typeof idArr.indexOf !== 'undefined' && dataIn.hasOwnProperty('id') && size(idMatch) > 0);
        },
        always: function (dataIn, val) {
          return val;
        },
        percentScale: function (dataIn, c_data) {
          var percentMin = (typeof c_data['percentMin'] === 'number') ? c_data['percentMin'] : 0,
            percentMax = (typeof c_data['percentMax'] === 'number') ? c_data['percentMax'] : 100,
            salt = c_data['salt'] || 1,
            testPhase = c_data['testPhase'] || 'unknown test';
          percentMin = (percentMin < 1) ? percentMin * 100 : percentMin;
          percentMax = (percentMax < 1) ? percentMax * 100 : percentMax;
          debug('======================================== :: barry :: percentScale');
          debug("(dataIn.id*salt % 100)", (dataIn.id * salt % 100));
          debug("percentMin", percentMin);
          debug("percentMax", percentMax);
          debug("salt", salt);
          debug("dataIn.id", dataIn.id);
          debug('testPhase', testPhase);
          debug("Math.min((dataIn.id*salt)%100, percentMin)", Math.min((dataIn.id * salt) % 100, percentMin));
          debug("Math.max((dataIn.id*salt), percentMax)%100", Math.max((dataIn.id * salt) % 100, percentMax));
          var t = Math.min((dataIn.id * salt) % 100, percentMin) === percentMin && Math.max((dataIn.id * salt) % 100, percentMax) === percentMax;
          debug("t", t);
          debug('======================================== :: end barry :: percentScale');
          return t;
        },
        has: function (dataIn, c_data) {
          var traitVal,
            hasProp = false;
          debug('======================================== :: barry :: has');
          debug("\"has\" argument(s): ", c_data);
          if (c_data.hasOwnProperty('trait') && dataIn.hasOwnProperty(c_data['trait'])) {
            traitVal = dataIn[c_data['trait']];
            hasProp = true;
          }
          debug("Evaluation data has trait (" + c_data['trait'] + ")? ", hasProp);
          if (hasProp) {
            debug("Trait value (if found): ", traitVal);
            debug("Trait type: ", typeof traitVal);
            if (c_data.hasOwnProperty('comparison') && c_data.hasOwnProperty('value')) {
              var type = factory.getType(dataIn[c_data['trait']]).toLowerCase();
              try {
                var retOption = barry.determine[type][c_data['comparison']].apply(barry, [dataIn[c_data['trait']], c_data['value']]);
                debug("Comparison outcome of barry.determine." + type + "." + c_data['comparison'] + "(" + [dataIn[c_data['trait']], c_data['value']] + "):", retOption);
                debug('======================================== :: end barry :: has');
                return retOption;
              } catch (e) {
                debug('********** Exception handled in "has" method. **********');
                debug('Unrecognized type or comparator:\n       ', e.message);
                debug("Data Trait: ", c_data['trait']);
                debug("Trait Value: ", dataIn[c_data['trait']]);
                debug("type: ", type);
                debug("comparator: ", c_data['comparison']);
                debug("Sorry.  Barry does not have a method called barry.determine." + type + "." + c_data['comparison'] + "()");
                debug("Returning boolean::false, by default.");
                debug('********** Exception handled in "has" method. **********');
                debug('======================================== :: end barry :: has');
                return false;
              }
            }
          }
          debug('======================================== :: end barry :: has');
          return hasProp;
        }
      };
    return {
      setup: setup,
      getAll: getAllFlags,
      get: check,
      diagnostics: factory.getDiagnostics
    }
  })();

barry.knows = function (f) {
  f.apply(barry);
  return barry;
};
//barry.comp = {};
barry.determine = {};
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
