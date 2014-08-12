
module.exports = function () {
    var barry=this;
    barry.determine = barry.determine || {};
    barry.determine.string = {
        equals: function (baseVal, checkVal) {
            return baseVal === checkVal.toString();
        },
        like: function (baseVal, checkVal) {
            return baseVal.toLowerCase() == checkVal.toString().toLowerCase();
        },
        below: function (baseVal, checkVal) {
            barry.log('(barry) Performing string comparison using ">" or "<".  This may not be the comparison you are looking for.');
            barry.log('(barry) Comparing "' + baseVal + '" <= "' + checkVal.toString() + '": ' + (baseVal<=checkVal.toString()));
            return barry.determine.string.shorter(baseVal, checkVal);
        },
        above: function (baseVal, checkVal) {
            barry.log('(barry) Performing string comparison using ">" or "<" is probably not be the comparison you are looking for.');
            barry.log('(barry) Evaluating by length comparison instead.');
            return barry.determine.string.longer(baseVal, checkVal);
        },
        longer: function(baseVal, checkVal) {
            return baseVal.length >= checkVal.toString().length;
        },
        shorter: function(baseVal, checkVal) {
            return baseVal.length <= checkVal.toString().length;
        }
    };
};