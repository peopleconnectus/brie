const assert = require("assert");
const brie = require('../../lib/brie');
module.exports = function () {
  describe('#complex evaluation', function () {
    before(function () {
      this.checkData = {
        id: 123456789,
        hasStringValue: "a string check value",
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: new Date(),
        hasBooleanValue: true,
        altKey: 88787878787877,
      };
      this.features = {
        // combination comparisons
        // implied "all"
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
        // explicit "any"
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
        "canCheckSimpleAny": {
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
        // "for-ids" check
        "canCheckAllowIds": {
          "criteria": [
            {
              "allowIDs": [1234, 5678, 91011, 123456789]
            }
          ]
        },
        // "for-ids" check
        "canCheckNoInvalidAllowIds": {
          "criteria": [
            {
              "allowIDs": [1234, 5678, 91011]
            }
          ]
        },
        // "for-values" check
        "canCheckAllowValues": {
          "criteria": [
            {
              "allowValues": {
                "values": [1234, 5678, 91011, 123456789],
                "trait": "id"
              }
            }
          ]
        },
        // "for-values" check
        "canCheckAllowValuesCustom": {
          "criteria": [
            {
              "allowValues": {
                "values": [1234, 5678, 91011, 123456789, 88787878787877],
                "trait": "altKey"
              }
            }
          ]
        },
        // "for-values" check
        "canCheckNoInvalidAllowValuesCustom": {
          "criteria": [
            {
              "allowValues": {
                "values": [1234, 5678, 91011, 123456789],
                "trait": "altKey"
              }
            }
          ]
        },
        // "for-values" check
        "canCheckRejectValues": {
          "criteria": [
            {
              "rejectValues": {
                "values": [1234, 5678, 91011, 123456789],
                "trait": "id"
              }
            }
          ]
        },
        // "for-values" check
        "canCheckRejectValuesCustom": {
          "criteria": [
            {
              "rejectValues": {
                "values": [1234, 5678, 91011, 123456789, 88787878787877],
                "trait": "altKey"
              }
            }
          ]
        },
        // "for-values" check
        "canCheckNoInvalidRejectValuesCustom": {
          "criteria": [
            {
              "rejectValues": {
                "values": [5555, 6666, 7777],
                "trait": "altKey"
              }
            }
          ]
        },
        // for "percentScale" check
        "canCheckPercentScale": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 0,
                percentMax: .4,
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleNoMin": {
          "criteria": [
            {
              "percentScale": {
                percentMax: .4,
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleNoMax": {
          "criteria": [
            {
              "percentScale": {
                percentMin: .4,
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleBadMin": {
          "criteria": [
            {
              "percentScale": {
                percentMin: "zero",
                percentMax: .4,
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleBadMax": {
          "criteria": [
            {
              "percentScale": {
                percentMin: .1,
                percentMax: "point-four",
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleBigMin": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 22,
                percentMax: 72,
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleBigMax": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 1,
                percentMax: 50,
                salt: 9,
              }
            }
          ]
        },
        "canCheckPercentScaleNoSalt": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 1,
                percentMax: 50,
              }
            }
          ]
        },
        "canCheckPercentScaleNoLabel": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 1,
                percentMax: 50,
                salt: 9
              }
            }
          ]
        },
        "canCheckPercentScaleAlternateKey": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 1,
                percentMax: 10,
                salt: 44,
                "trait": "altKey"
              }
            }
          ]
        },
        "canCheckPercentScaleMissingKey": {
          "criteria": [
            {
              "percentScale": {
                percentMin: 1,
                percentMax: 10,
                salt: 44,
                "trait": "missing_key"
              }
            }
          ]
        },
        "fullCheckWithOverrides": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "equals",
                "value": "a string check value"
              }
            }
          ]
        }
      };
      this.bSetup = brie.setup({
        data: this.checkData,
        features: this.features,
        overrides: { "fullCheckWithOverrides": false },
        showLogs: false
      });

    });

    it('"canCheckComplexAll"                                  should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckComplexAll"));
    });
    it('"canCheckComplexAny"                                  should evaluate to true', function () {
      assert(this.bSetup.getAll());
    });
    it('"canCheckSimpleAny"                                   should evaluate to true', function () {
      assert(this.bSetup.get('canCheckSimpleAny'));
    });
    it('"fullCheckWithOverrides"                              should evaluate to false', function () {
      assert(!this.bSetup.getAll()['fullCheckWithOverrides']);
    });
    it('"canCheckAllowIds"                                    should evaluate to true', function () {
      assert(this.bSetup.get("canCheckAllowIds"));
    });
    it('"canCheckNoInvalidAllowIds"                           should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckNoInvalidAllowIds"));
    });
    it('"canCheckAllowValues"                                 should evaluate to true', function () {
      assert(this.bSetup.get("canCheckAllowValues"));
    });
    it('"canCheckAllowValuesCustom"                           should evaluate to true', function () {
      assert(this.bSetup.get("canCheckAllowValuesCustom"));
    });
    it('"canCheckNoInvalidAllowValuesCustom"                  should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckNoInvalidAllowValuesCustom"));
    });
    it('"canCheckRejectValues"                                should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckRejectValues"));
    });
    it('"canCheckRejectValuesCustom"                          should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckRejectValuesCustom"));
    });
    it('"canCheckNoInvalidRejectValuesCustom"                   should evaluate to true', function () {
      assert(this.bSetup.get("canCheckNoInvalidRejectValuesCustom"));
    });
    it('percentScale                                          should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScale") === 'boolean');
    });
    it('percentScale with no "minimum"                        should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleNoMin") === 'boolean');
    });
    it('percentScale with no "maximum"                        should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleNoMax") === 'boolean');
    });
    it('percentScale with bad "minimum"                       should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleBadMin") === 'boolean');
    });
    it('percentScale with bad "maximum"                       should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleBadMax") === 'boolean');
    });
    it('percentScale with minimum over 1                      should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleBigMin") === 'boolean');
    });
    it('percentScale with maximum over 1                      should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleBigMax") === 'boolean');
    });
    it('percentScale without salt                             should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleNoSalt") === 'boolean');
    });
    it('percentScale without label                            should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleNoLabel") === 'boolean');
    });
    it('percentScale with alternate key                       should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleAlternateKey") === 'boolean');
    });
    it('percentScale with alternate key missing               should evaluate as bool', function () {
      assert(typeof this.bSetup.get("canCheckPercentScaleMissingKey") === 'boolean');
    });
  });
};
