
module.exports = function () {
    var barry=this;
    barry.determine = barry.determine || {};
    barry.determine.number = {
        below: function (baseVal, checkVal) {
            barry.log('(barry) Comparing "' + baseVal + '" <= "' + checkVal + '": ' + (baseVal<=checkVal));
            return baseVal <= checkVal;
        },
        above: function (baseVal, checkVal) {
            barry.log('(barry) Comparing "' + baseVal + '" >= "' + checkVal + '": ' + (baseVal>=checkVal));
            return baseVal >= checkVal;
        }
    };
    barry.determine.number.longer = barry.determine.number.above;
    barry.determine.number.shorter = barry.determine.number.below;
};