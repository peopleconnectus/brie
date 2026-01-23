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

  describe('#hash_mod evaluation', function () {
    it('hash_mod returns consistent results for the same input', function () {
      const checkData = { userId: "test-user-123" };
      const features = {
        "hashModTest": {
          "criteria": [{
            "has": {
              "trait": "userId",
              "comparison": "hash_mod",
              "value": 50
            }
          }]
        }
      };
      const result1 = brie.setup({ data: checkData, features: features, showLogs: false }).get("hashModTest");
      const result2 = brie.setup({ data: checkData, features: features, showLogs: false }).get("hashModTest");
      const result3 = brie.setup({ data: checkData, features: features, showLogs: false }).get("hashModTest");
      assert.strictEqual(result1, result2, "hash_mod should return consistent results");
      assert.strictEqual(result2, result3, "hash_mod should return consistent results");
    });

    it('hash_mod with value 50 returns true for roughly half of sample set', function () {
      let trueCount = 0;
      const sampleSize = 1000;
      const features = {
        "fiftyPercentRollout": {
          "criteria": [{
            "has": {
              "trait": "userId",
              "comparison": "hash_mod",
              "value": 50
            }
          }]
        }
      };

      for (let i = 0; i < sampleSize; i++) {
        const checkData = { userId: `user-${i}-${Math.random().toString(36).substring(7)}` };
        const result = brie.setup({ data: checkData, features: features, showLogs: false }).get("fiftyPercentRollout");
        if (result) trueCount++;
      }

      const percentage = (trueCount / sampleSize) * 100;
      // Allow for statistical variance - should be roughly 50% (between 40% and 60%)
      assert(percentage >= 40 && percentage <= 60, `Expected ~50% true, got ${percentage}%`);
    });

    it('hash_mod works with various string formats (alphanumeric, UUIDs, etc.)', function () {
      const testStrings = [
        "simple",
        "user123",
        "550e8400-e29b-41d4-a716-446655440000",  // UUID format
        "abc-def-ghi",
        "12345",
        "UPPERCASE",
        "MixedCase123",
        "special!@#$%",
        ""  // empty string
      ];

      const features = {
        "hashModFormat": {
          "criteria": [{
            "has": {
              "trait": "testValue",
              "comparison": "hash_mod",
              "value": 50
            }
          }]
        }
      };

      testStrings.forEach(str => {
        const checkData = { testValue: str };
        // Should not throw an error for any string format
        const result = brie.setup({ data: checkData, features: features, showLogs: false }).get("hashModFormat");
        assert(typeof result === 'boolean', `hash_mod should return boolean for "${str}"`);
      });
    });

    it('hash_mod with value 0 always returns false', function () {
      const testStrings = ["test1", "test2", "test3", "550e8400-e29b-41d4-a716-446655440000", "random"];
      const features = {
        "zeroPercentRollout": {
          "criteria": [{
            "has": {
              "trait": "testValue",
              "comparison": "hash_mod",
              "value": 0
            }
          }]
        }
      };

      testStrings.forEach(str => {
        const checkData = { testValue: str };
        const result = brie.setup({ data: checkData, features: features, showLogs: false }).get("zeroPercentRollout");
        assert.strictEqual(result, false, `hash_mod with value 0 should always return false for "${str}"`);
      });
    });

    it('hash_mod with value 100 always returns true', function () {
      const testStrings = ["test1", "test2", "test3", "550e8400-e29b-41d4-a716-446655440000", "random"];
      const features = {
        "fullRollout": {
          "criteria": [{
            "has": {
              "trait": "testValue",
              "comparison": "hash_mod",
              "value": 100
            }
          }]
        }
      };

      testStrings.forEach(str => {
        const checkData = { testValue: str };
        const result = brie.setup({ data: checkData, features: features, showLogs: false }).get("fullRollout");
        assert.strictEqual(result, true, `hash_mod with value 100 should always return true for "${str}"`);
      });
    });

    it('hash_mod works with string value parameter', function () {
      const checkData = { userId: "test-user" };
      const features = {
        "stringValueTest": {
          "criteria": [{
            "has": {
              "trait": "userId",
              "comparison": "hash_mod",
              "value": "50"  // string instead of number
            }
          }]
        }
      };
      const result = brie.setup({ data: checkData, features: features, showLogs: false }).get("stringValueTest");
      assert(typeof result === 'boolean', "hash_mod should handle string value parameter");
    });
  });
};
