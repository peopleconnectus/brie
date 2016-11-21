var _ = require('lodash-node');
module.exports = function () {
    var barry=this;
    barry.determine = barry.determine || {};
    barry.determine.string = {
        equals: function (baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = "";
            return baseVal === checkVal.toString();
        },
        like: function (baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = "";
            return baseVal.toLowerCase() == checkVal.toString().toLowerCase();
        },
        below: function (baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = "";
            barry.log('(barry) Performing string comparison using ">" or "<".  This may not be the comparison you are looking for.');
            barry.log('(barry) Comparing "' + baseVal + '" <= "' + checkVal.toString() + '": ' + (baseVal<=checkVal.toString()));
            return (baseVal<=checkVal.toString());
        },
        above: function (baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = "";
            barry.log('(barry) Performing string comparison using ">" or "<" is probably not be the comparison you are looking for.');
            barry.log('(barry) Comparing "' + baseVal + '" >= "' + checkVal.toString() + '": ' + (baseVal>=checkVal.toString()));
            return (baseVal>=checkVal.toString());
        },
        longer: function(baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = "";
            return baseVal.length >= checkVal.toString().length;
        },
        shorter: function(baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = "";
            return baseVal.length <= checkVal.toString().length;
        }
    };
};