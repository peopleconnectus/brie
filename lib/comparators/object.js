var _ = require('lodash');
module.exports = function () {
  var barry = this,
    object_comparator = {
      equals: function (baseObj, checkObj) {
        return _.isEqual(baseObj, checkObj);
      },
      above: function (baseObj, checkObj) {
        var b = _.clone(baseObj),
          c = _.clone(checkObj);
        if (barry.determine.object.equals(b, c)) {
          return false;
        }
        if (_.isArray(b)) {
          if (_.isArray(c)) {
            return (_.isEqual(_.difference(c, b), [])); // compares simple difference between arrays with the empty array, essentially identifying that b contains c
          }
          return (_.isEqual(_.difference(_.keys(c), b), [])); // comparing, instead, the b array with the array of Keys from c
        } else {
          if (_.isArray(c)) {
            return (_.isEqual(_.difference(c, _.keys(b), [])));
          }
          return _.isEqual(_.extend(c, b), b);
        }
      },
      below: function (baseObj, checkObj) {
        var b = _.clone(baseObj),
          c = _.clone(checkObj);
        if (barry.determine.object.equals(b, c)) {
          return false;
        }
        if (_.isArray(b)) {
          if (_.isArray(c)) {
            return (_.isEqual(_.difference(b, c), [])); // compares simple difference between arrays with the empty array, essentially identifying that b contains c
          }
          return (_.isEqual(_.difference(_.keys(b), c), [])); // comparing, instead, the b array with the array of Keys from c
        } else {
          if (_.isArray(c)) {
            return (_.isEqual(_.difference(b, _.keys(c), [])));
          }
          return _.isEqual(_.extend(b, c), c);
        }
      },
      shorter: function (baseObj, checkObj) {
        return _.size(baseObj) <= _.size(checkObj);
      },
      longer: function (baseObj, checkObj) {
        return _.size(baseObj) >= _.size(checkObj);
      }
    };
  _.assign(barry.determine, { "object": object_comparator, "array": object_comparator });
};
