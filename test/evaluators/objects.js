/**
 * Created by j.corns on 2/22/17.
 */

var assert = require("assert");
var barry = require('../../lib/barry');
module.exports = function () {

  describe('#object evaluation', function () {
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
        // object comparator
        "canCheckEqualObject": {
          "criteria": [
            {
              "has": {
                "trait": "hasObjectValue",
                "comparison": "equal",
                "value": { a: 1, b: 2 }
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
                "value": { some: "string", other: 1234, last: "3o8jsf" }
              }
            }
          ]
        },
        "canCheckAboveEqualObject": {
          "criteria": [
            {
              "has": {
                "trait": "hasObjectValue",
                "comparison": "above",
                "value": { a: 1, b: 2 }
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
                "value": { some: "string", other: 1234, last: "3o8jsf" }
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
                "value": { some: "string", other: 1234, last: "3o8jsf" }
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
                "value": { some: "string", other: 1234, last: "3o8jsf" }
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

    it('"canCheckEqualObject" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckEqualObject"));
    });
    it('"canCheckAboveObject" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckAboveObject"));
    });
    it('"canCheckAboveObject" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckAboveEqualObject"));
    });
    it('"canCheckBelowObject" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckBelowObject"));
    });
    it('"canCheckShorterObject" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckShorterObject"));
    });
    it('"canCheckLongerObject" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckLongerObject"));
    });
  });
};
