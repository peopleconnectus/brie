/**
 * Created by j.corns on 2/22/17.
 */

var assert = require("assert");
var barry = require('../../lib/barry');
module.exports = function () {

  describe('#date evaluation', function () {
    before(function () {
      this.checkData = {
        id: 123456789,
        hasStringValue: "a string check value",
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: new Date(),
        hasBooleanValue: true
      };
      this.features = {
        // date comparator
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
        }
      };
      this.bSetup = barry.setup({
        data: this.checkData,
        features: this.features,
        overrides: {},
        showLogs: false
      });
    });


    it('"canCheckHigherDate" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckHigherDate"));
    });
    it('"canCheckLowerDate" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckLowerDate"));
    });
    it('"canCheckEqualDate" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckEqualDate"));
    });
  });
};
