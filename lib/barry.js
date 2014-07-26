'use strict';

/**
 *   getFeatureFlags
 */
var RSVP=require('rsvp'),
    fflip=require('fflip');

var self = module.exports = function getFeatureFlags (data) {

    console.log('======================================== :: index');
    console.log('inbound data: ', data.scribe.result.pid);
    console.log('======================================== :: end index');


    var featureFlags = cmatesConfig.get('featureFlags.features'),
        criteria = {
            always: function (user, val) {
                return val;
            },
            isPaidUser: function (user, isPaid) {
                return (user.hasOwnProperty('prospectStage') && user['prospectStage'] === 'BASIC') === isPaid;
            },
            percentScale: function (user, mods) {
                var percentMin = mods.percentMin || 0,
                    percentMax = mods.percentMax || 100,
                    salt = mods.salt || 1,
                    testPhase = mods.testPhase || 'unknown test';
                percentMin = (percentMin < 1) ? percentMin : (percentMin / 100);
                percentMax = (percentMax < 1) ? percentMax : (percentMax / 100);
                console.log('======================================== :: index');
                console.log("(j.corns) (user.id*salt % 100)", (user.id * salt % 100));
                console.log("(j.corns) percentMin", percentMin);
                console.log("(j.corns) percentMax", percentMax);
                console.log("(j.corns) salt", salt);
                console.log('testPhase', testPhase);
                console.log("(j.corns) Math.min((user.id*salt)%100, percentMin)", Math.min((user.id * salt) % 100, percentMin));
                console.log("(j.corns) Math.max((user.id*salt), percentMax)%100", Math.max((user.id * salt) % 100, percentMax));
                var t = Math.min((user.id * salt) % 100, percentMin * 100) === percentMin * 100 && Math.max((user.id * salt) % 100, percentMax * 100) === percentMax * 100;
                console.log("(j.corns) t", t);
                console.log('======================================== :: end index');
                return t;
            },
            allowUserIDs: function (user, idArr) {
                for (var i = 0; i < idArr.length; i++) {
                    if (user.id == idArr[i])
                        return true;
                }
                return false;
            }
        };
    var getAllFlags = function () {
            return new RSVP.Promise(function (resolve, reject) {
                try {
                } catch (e) {
                    nUtil.log('FeatureFlag evaluation failed: ' + e.message);
                }
                resolve(flags);
            });
        },
        get = function (flagName) {
            if (featureFlags && featureFlags.hasOwnProperty(flagName)) {
                return new RSVP.Promise(function (resolve, reject) {
                    var flagCheck = featureFlags[flagName];
                    fflip.config({
                        features: flagCheck
                    });
                    factory.fflipExec().then(function (ffOut) {
                        // do stuff
                        resolve({});
                    });
                })
            }
            fflip.config({
                features: featureFlags
            });
            return false;
        },
        getCriteria = function () {
            return featureFlags;
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
    fflip.config({
        criteria: criteria,
        features: featureFlags
    });
    return {
        getAll: getAllFlags,
        get: get,
        getCriteria: getCriteria
    }
};




//for (var prop in featureFlags.features) {
//    if(featureFlags.features.hasOwnProperty(prop)){
//        var thisFeature = featureFlags['features'][prop],
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