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
    it('should read features', function () {
      assert((typeof d.features === "object" && typeof d.features.length === "undefined"));
    });
    it('should read data', function () {
      assert((typeof d.data === "object" && typeof d.data.length === "undefined"));
    });
    it('should have criterion', function () {
      assert(!!(d));
    });
    describe('#criterion are executable', function () {
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
            "always": false
          }
        ]
      },
      "canCheckHasString": {
        "criteria": [
          {
            "has": {
              "trait": "hasStringValue",
              "comparison": "equals",
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
              "comparison": "equals",
              "value": 181818
            }
          }
        ]
      },
      "canCheckHigherDate": {
        "criteria": [
          {
            "has": {
              "trait": "hasDateValue",
              "comparison": "older",
              "value": new Date()
            }
          }
        ]
      },
      "canCheckLowerDate": {
        "criteria": [
          {
            "has": {
              "trait": "hasDateValue",
              "comparison": "younger",
              "value": new Date(2000, 1, 1, 1, 22, 0)
            }
          }
        ]
      },
      "canCheckEqualDate": {
        "criteria": [
          {
            "has": {
              "trait": "hasDateValue",
              "comparison": "equal",
              "value": new Date()
            }
          }
        ]
      },
      "canCheckEqualObject": {
        "criteria": [
          {
            "has": {
              "trait": "hasObjectValue",
              "comparison": "equal",
              "value": {a: 1, b: 2}
            }
          }
        ]
      },
      "canCheckAboveObject": {
        "criteria": [
          {
            "has": {
              "trait": "hasObjectValue",
              "comparison": "above",
              "value": {some: "string", other: 1234, last: "3o8jsf"}
            }
          }
        ]
      },
      "canCheckBelowObject": {
        "criteria": [
          {
            "has": {
              "trait": "hasObjectValue",
              "comparison": "below",
              "value": {some: "string", other: 1234, last: "3o8jsf"}
            }
          }
        ]
      },
      "canCheckShorterObject": {
        "criteria": [
          {
            "has": {
              "trait": "hasObjectValue",
              "comparison": "shorter",
              "value": {some: "string", other: 1234, last: "3o8jsf"}
            }
          }
        ]
      },
      "canCheckLongerObject": {
        "criteria": [
          {
            "has": {
              "trait": "hasObjectValue",
              "comparison": "longer",
              "value": {some: "string", other: 1234, last: "3o8jsf"}
            }
          }
        ]
      },
      "canCheckComplexAll": {
        "criteria": [
          {
            "has": {
              "trait": "hasNumberValue",
              "comparison": "below",
              "value": 5
            }
          },
          {
            "has": {
              "trait": "hasStringValue",
              "comparison": "equals",
              "value": "a string check value"
            }
          }
        ]
      },
      "canCheckComplexAny": {
        "criteria": [
          {
            "has": {
              "trait": "hasNumberValue",
              "comparison": "below",
              "value": 9999999
            }
          },
          {
            "has": {
              "trait": "hasStringValue",
              "comparison": "equals",
              "value": "a string check value"
            }
          }
        ],
        "criteriaLogic": "any"
      },
      "canCheckAllowIds": {
        "criteria": [
          {
            "allowIDs": [1234, 5678, 91011, 123456789]
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
  describe('#feature evaluation', function () {
    var bSetup = barry.setup({
      data: checkData,
      features: features,
      overrides: {},
      showLogs: true
    });
    it('should pass the "getAll" features', function () {
      var allOut = bSetup.getAll();
      assert(!!(allOut));
    });
    for (var feature in features) {
      if (features.hasOwnProperty(feature)) {
        (function (f) {
          it('feature "' + f + '" should evaluate to boolean', function () {
            var getF = bSetup.get(f);
            assert((typeof bSetup.get(f) === 'boolean'));
          });
        })(feature);
      }
    }
    it('feature "canCheckAlways" should evaluate to false', function () {
      assert(!bSetup.get("canCheckAlways"));
    });
    it('feature "canCheckHasString" should evaluate to true', function () {
      assert(bSetup.get("canCheckHasString"));
    });
    it('feature "canCheckHigherNumber" should evaluate to true', function () {
      assert(bSetup.get("canCheckHigherNumber"));
    });
    it('feature "canCheckLowerNumber" should evaluate to true', function () {
      assert(bSetup.get("canCheckLowerNumber"));
    });
    it('feature "canCheckEqualNumber" should evaluate to true', function () {
      assert(bSetup.get("canCheckEqualNumber"));
    });
    it('feature "canCheckHigherDate" should evaluate to true', function () {
      assert(bSetup.get("canCheckHigherDate"));
    });
    it('feature "canCheckLowerDate" should evaluate to true', function () {
      assert(bSetup.get("canCheckLowerDate"));
    });
    it('feature "canCheckEqualDate" should evaluate to false', function () {
      assert(!bSetup.get("canCheckEqualDate"));
    });
    it('feature "canCheckEqualObject" should evaluate to false', function () {
      assert(!bSetup.get("canCheckEqualObject"));
    });
    it('feature "canCheckAboveObject" should evaluate to false', function () {
      assert(!bSetup.get("canCheckAboveObject"));
    });
    it('feature "canCheckBelowObject" should evaluate to false', function () {
      assert(!bSetup.get("canCheckBelowObject"));
    });
    it('feature "canCheckShorterObject" should evaluate to true', function () {
      assert(bSetup.get("canCheckShorterObject"));
    });
    it('feature "canCheckLongerObject" should evaluate to false', function () {
      assert(!bSetup.get("canCheckLongerObject"));
    });
    it('feature "canCheckComplexAll" should evaluate to false', function () {
      assert(!bSetup.get("canCheckComplexAll"));
    });
    it('feature "canCheckComplexAny" should evaluate to true', function () {
      assert(bSetup.get("canCheckComplexAny"));
    });
    it('feature "canCheckAllowIds" should evaluate to true', function () {
      assert(bSetup.get("canCheckAllowIds"));
    });
  });
});
