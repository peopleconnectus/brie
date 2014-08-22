
module.exports = function () {
    var barry=this;
    barry.determine = barry.determine || {};
    barry.determine.number = {
        equals: function (baseVal, checkVal) {
            if(_.isNull(checkVal)) checkVal = 0;
            return baseVal === parseInt(checkVal, 10);
        },
        below: function (baseVal, checkVal) {
            barry.log('(barry) Comparing "' + baseVal + '" <= "' + checkVal + '": ' + (baseVal <= parseInt(checkVal, 10)));
            return baseVal <= parseInt(checkVal, 10);
        },
        above: function (baseVal, checkVal) {
            barry.log('(barry) Comparing "' + baseVal + '" >= "' + checkVal + '": ' + (baseVal >= parseInt(checkVal, 10)));
            return baseVal >= parseInt(checkVal, 10);
        }
    };
    barry.determine.number.longer = barry.determine.number.above;
    barry.determine.number.shorter = barry.determine.number.below;
};