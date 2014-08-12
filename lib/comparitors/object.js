var _ = require('lodash-node');
module.exports = function () {
    var barry=this;
    barry.determine = barry.determine || {};
    barry.determine.object = {
        equals: function (baseObj, checkObj) {
            return _.isEqual(baseObj, checkObj);
        },
        above: function (baseObj, checkObj) {
            if(barry.determine.object.equals(baseObj, checkObj)) {
                return false;
            }
            if (_.isArray(baseObj)) {
                if(_.isArray(checkObj)) {
                    return (_.isEqual(_.difference(checkObj, baseObj), [])); // compares simple difference between arrays with the empty array, essentially identifying that baseObj contains checkObj
                }
                return (_.isEqual(_.difference(_.keys(checkObj), baseObj), [])); // comparing, instead, the baseObj array with the array of Keys from checkObj
            } else {
                if(_.isArray(checkObj)) {
                    return (_.isEqual(_.difference(checkObj, _.keys(baseObj), [])));
                }
                return _.isEqual(_.extend(checkObj, baseObj), baseObj);
            }
        },
        below: function (baseObj, checkObj) {
            if(barry.determine.object.equals(baseObj, checkObj)) {
                return false;
            }
            if (_.isArray(baseObj)) {
                if(_.isArray(checkObj)) {
                    return (_.isEqual(_.difference(baseObj, checkObj), [])); // compares simple difference between arrays with the empty array, essentially identifying that baseObj contains checkObj
                }
                return (_.isEqual(_.difference(_.keys(baseObj), checkObj), [])); // comparing, instead, the baseObj array with the array of Keys from checkObj
            } else {
                if(_.isArray(checkObj)) {
                    return (_.isEqual(_.difference(baseObj, _.keys(checkObj), [])));
                }
                return _.isEqual(_.extend(baseObj, checkObj), checkObj);
            }
        },
        shorter: function(baseObj, checkObj) {
            return _.size(baseObj) <= _.size(checkObj);
        },
        longer: function (baseObj, checkObj) {
            return _.size(baseObj) >= _.size(checkObj);
        }
    }
};