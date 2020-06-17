const assert = require("assert");
const brie = require('../../lib/brie');
module.exports = function () {
  describe('#string evaluation', function () {
    before(function () {
      const checkData = {
        id: 4,
        hasStringValue: "a string check value"
      };
      const features = {
        // simple string
        "canCheckHasString": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue"
              }
            }
          ]
        },
        "canCheckStringEqual": {
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
        "canCheckNullComparison": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "equals",
                "value": null
              }
            }
          ]
        },
        "similarStrings": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "like",
                "value": "A String Check Value"
              }
            }
          ]
        },
        "similarStringsNull": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "like",
                "value": null
              }
            }
          ]
        },
        "stringsBelow": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "below",
                "value": "A different string value"
              }
            }
          ]
        },
        "stringsBelowNull": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "below",
                "value": null
              }
            }
          ]
        },
        "stringsAbove": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "above",
                "value": "A different string value"
              }
            }
          ]
        },
        "stringsAboveNull": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "above",
                "value": null
              }
            }
          ]
        },
        "stringsLonger": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "longer",
                "value": "A different string value"
              }
            }
          ]
        },
        "stringsLongerNull": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "longer",
                "value": null
              }
            }
          ]
        },
        "stringsShorter": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "shorter",
                "value": "A different string value"
              }
            }
          ]
        },
        "stringsShorterNull": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "shorter",
                "value": null
              }
            }
          ]
        }
      };
      this.bSetup = brie.setup({
        data: checkData,
        features: features,
        overrides: {},
        showLogs: false
      });
    });
    it('"canCheckHasString"                                   should evaluate to true', function () {
      assert(this.bSetup.get("canCheckHasString"));
    });
    it('"canCheckStringEqual"                                 should evaluate to true', function () {
      assert(this.bSetup.get("canCheckStringEqual"));
    });
    it('"canCheckNullComparison"                              should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckNullComparison"));
    });
    it('string "like" comparison                              should evaluate to true', function () {
      assert(this.bSetup.get('similarStrings'));
    });
    it('string "like" comparison against null value           should evaluate to false', function () {
      assert(!this.bSetup.get('similarStringsNull'));
    });
    it('string "below" comparison                             should evaluate to false', function () {
      assert(!this.bSetup.get('stringsBelow'));
    });
    it('string "below" comparison with a null value           should evaluate to false', function () {
      assert(!this.bSetup.get('stringsBelowNull'));
    });
    it('string "above" comparison                             should evaluate to true', function () {
      assert(this.bSetup.get('stringsAbove'));
    });
    it('string "above" comparison with a null value           should evaluate to true', function () {
      assert(this.bSetup.get('stringsAboveNull'));
    });
    it('string "longer" comparison                            should evaluate to false', function () {
      assert(!this.bSetup.get('stringsLonger'));
    });
    it('string "longer" comparison with a null value          should evaluate to true', function () {
      assert(this.bSetup.get('stringsLongerNull'));
    });
    it('string "shorter" comparison                           should evaluate to true', function () {
      assert(this.bSetup.get('stringsShorter'));
    });
    it('string "shorter" comparison with a null value         should evaluate to false', function () {
      assert(!this.bSetup.get('stringsShorterNull'));
    });
  });
};
