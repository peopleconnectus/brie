/**
 * Testing Harness for Barry
 *
 * Run as:
 *
 * @example
 * // exit code 0
 * node tests/test.js
 *
 * Created by j.corns on 3/3/15.
 */

var assert = require("assert");
var barry = require('../lib/barry');
describe('Diagnostics', function () {
  describe('#exist', function () {
    var d = barry.diagnostics();
    it('should return some value', function () {
      assert.ok(d);
    });
    it('should have clean features', function () {
      assert.deepEqual(d.features, {});
    });
    it('should have clean data', function () {
      assert.deepEqual(d.data, {});
    });
    it('should have criterion', function () {
      assert(!!(d));
    });
    describe('#criterion are executable', function () {
      var d = barry.diagnostics();
      for (var c in d.criteria) {
        if (d.criteria.hasOwnProperty(c)) {
          (function (cta) {
            it('criteria "' + cta + '" should be a function', function () {
              var k = typeof d.criteria[cta] === 'function';
              assert(k);
            });
          })(c);
        }
      }
    });
  });
});
describe('Execution', function () {
  var checkData = {
      id: 123456789,
      hasStringValue: "a string check value",
      hasNumberValue: 181818,
      hasObjectValue: {a: 1, b: 2},
      hasDateValue: new Date(),
      hasBooleanValue: true
    },
    features = {
      "canCheckAlways": {
        "criteria": [
          {
            "always": true
          }
        ]
      },
      "canCheckHasString": {
        "criteria": [
          {
            "has": {
              "trait": "hasStringValue",
              "comparison": "equal",
              "value": "a string check value"
            }
          }
        ]
      },
      "canCheckHigherNumber": {
        "criteria": [
          {
            "has": {
              "trait": "hasNumberValue",
              "comparison": "above",
              "value": 1
            }
          }
        ]
      },
      "canCheckLowerNumber": {
        "criteria": [
          {
            "has": {
              "trait": "hasNumberValue",
              "comparison": "below",
              "value": 9999999
            }
          }
        ]
      },
      "canCheckEqualNumber": {
        "criteria": [
          {
            "has": {
              "trait": "hasNumberValue",
              "comparison": "below",
              "value": 181818
            }
          }
        ]
      }
    };
  describe('#setup', function () {
    it('should return a live object', function () {
      var bSetup = barry.setup({
        data: checkData,
        features: features,
        overrides: {},
        showLogs: false
      });
      assert(!!(bSetup));
    });
  });
  describe('#setup', function () {
    it('should pass the "getAll" features', function () {
      var bSetup = barry.setup({
          data: checkData,
          features: features,
          overrides: {},
          showLogs: false
        }),
        allOut = bSetup.getAll();
      console.log('======================================== :: test');
      console.log("(j.corns) allOut", allOut);
      console.log('======================================== :: end test');
      assert(!!(allOut));
      describe('#boolean responses', function() {

      });
    });
  });
});
