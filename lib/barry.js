'use strict';
/**
 *   This is barry
 *   =============
 *   This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node, based on [fflip](https://github.com/FredKSchott/fflip).
 *
 */
var RSVP = require('rsvp'),
    fflip = require('fflip'),
    _ = require('lodash-node'),
    self = module.exports = function (context, features) {
        var features={},
            data = {},
            criteria = {
            always: function (article, val) {
                return val;
            },
            isPaidUser: function (article, isPaid) {
                return (article.hasOwnProperty('prospectStage') && article['prospectStage'] === 'BASIC') === isPaid;
            },
            percentScale: function (article, mods) {
                var percentMin = mods.percentMin || 0,
                    percentMax = mods.percentMax || 100,
                    salt = mods.salt || 1,
                    testPhase = mods.testPhase || 'unknown test';
                percentMin = (percentMin < 1) ? percentMin : (percentMin / 100);
                percentMax = (percentMax < 1) ? percentMax : (percentMax / 100);
                console.log('======================================== :: index');
                console.log("(j.corns) (user.id*salt % 100)", (article.id * salt % 100));
                console.log("(j.corns) percentMin", percentMin);
                console.log("(j.corns) percentMax", percentMax);
                console.log("(j.corns) salt", salt);
                console.log('testPhase', testPhase);
                console.log("(j.corns) Math.min((user.id*salt)%100, percentMin)", Math.min((article.id * salt) % 100, percentMin));
                console.log("(j.corns) Math.max((user.id*salt), percentMax)%100", Math.max((article.id * salt) % 100, percentMax));
                var t = Math.min((article.id * salt) % 100, percentMin * 100) === percentMin * 100 && Math.max((article.id * salt) % 100, percentMax * 100) === percentMax * 100;
                console.log("(j.corns) t", t);
                console.log('======================================== :: end index');
                return t;
            },
            allowUserIDs: function (article, idArr) {
                return typeof idArr.indexOf !== 'undefined' && article.hasOwnProperty('id') && ~idArr.indexOf(article.id);
            }
        };
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
        var factory = {
            fflipExec: function () {
                if (socket.hasOwnProperty('handshake') && socket.handshake.hasOwnProperty('pid')) {
                    var pid = socket.handshake.pid;
                    return getRest('/people/' + pid).then(function (result) {
                        return fflip.userFeatures(result, '');
                    });
                } else {
                    return {}
                }
            }
        };
        return {
            setup: setup,
            getAll: getAllFlags,
            get: check,
            getCriteria: getCriteria
        }
    };
//for (var prop in self.features.features) {
//    if(self.features.features.hasOwnProperty(prop)){
//        var thisFeature = self.features['features'][prop],
//            dataHasFlag = (query['urlParams'] && query['urlParams'].hasOwnProperty(prop)),
//            featureHasFlag = (thisFeature.values[query['targetRoute'].toLowerCase()]),
//            _flagVal;
//        if ( dataHasFlag ) {
//            console.log('urlArg found: "' + prop + '" = ' + query['urlParams'][prop]);
//            _flagVal = query['urlParams'][prop];
//        } else if ( featureHasFlag ) {
//            _flagVal = thisFeature.values[query['targetRoute'].toLowerCase()];
//        } else {
//            _flagVal = thisFeature.values['default'];
//        }
//
//        flags[prop] = (
//            typeof _flagVal !== 'undefined' &&
//            _flagVal !== '' &&
//            _flagVal.toString().toLowerCase() !== "false" &&
//            _flagVal.toString() !== "-1" &&
//            _flagVal.toString().toLowerCase() !== "no" &&
//            _flagVal.toString().toLowerCase() !== "off"
//            );
//    }
//}