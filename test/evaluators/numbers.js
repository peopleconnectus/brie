/**
 * Created by j.corns on 2/22/17.
 */
var assert = require("assert");
var barry = require('../../lib/barry');
module.exports = function () {

  describe('#number evaluation', function () {
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
        // number comparators
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
        "canCheckInvalidNumber": {
          "criteria": [
            {
              "has": {
                "trait": "hasNumberValue",
                "comparison": "equals",
                "value": null
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
    it('"canCheckHigherNumber" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckHigherNumber"));
    });
    it('"canCheckLowerNumber" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckLowerNumber"));
    });
    it('"canCheckEqualNumber" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckEqualNumber"));
    });
    it('"canCheckInvalidNumber" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckInvalidNumber"));
    });
  });
};
