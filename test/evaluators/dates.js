/**
 * Created by j.corns on 2/22/17.
 */
var assert = require("assert");
var brie = require('../../lib/brie');
module.exports = function () {

  describe('#date evaluation', function () {
    before(function () {
      this.staticDate = new Date();
      this.pastDate = new Date(this.staticDate-604800000);
      this.checkData = {
        id: 123456789,
        hasStringValue: "a string check value",
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: this.staticDate,
        hasOldDate: this.pastDate,
        hasBooleanValue: true
      };
      this.features = {
        // date comparator
        "canCheckEqualDate": {
          "criteria": [
            {
              "has": {
                "trait": "hasDateValue",
                "comparison": "equals",
                "value": this.staticDate
              }
            }
          ]
        },
        "canCheckEqualDateNumber": {
          "criteria": [
            {
              "has": {
                "trait": "hasDateValue",
                "comparison": "equals",
                "value": 949396920000
              }
            }
          ]
        },
        "canCheckEqualDateString": {
          "criteria": [
            {
              "has": {
                "trait": "hasDateValue",
                "comparison": "equals",
                "value": "any non-numeric string"
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
        "canCheckHigherDateNumber": {
          "criteria": [
            {
              "has": {
                "trait": "hasDateValue",
                "comparison": "older",
                "value": 0.000000011574074074074073 // decimal representation of 1 millisecond.
              }
            }
          ]
        },
        "canCheckHigherDateString": {
          "criteria": [
            {
              "has": {
                "trait": "hasDateValue",
                "comparison": "older",
                "value": "any non-numeric string"
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
        "canCheckLowerDateNumber": {
          "criteria": [
            {
              "has": {
                "trait": "hasOldDate",
                "comparison": "younger",
                "value": 10
              }
            }
          ]
        },
        "canCheckLowerDateString": {
          "criteria": [
            {
              "has": {
                "trait": "hasDateValue",
                "comparison": "younger",
                "value": "any non-numerica string"
              }
            }
          ]
        }
      };
      this.bSetup = brie.setup({
        data: this.checkData,
        features: this.features,
        overrides: {},
        showLogs: false
      });
    });
    it('Date equality comparison', function () {
      assert(this.bSetup.get("canCheckEqualDate"));
    });
    it('Date equality comparison against a number', function () {
      assert(!this.bSetup.get("canCheckEqualDateNumber"));
    });
    it('Date equality comparison against string', function () {
      assert(!this.bSetup.get("canCheckEqualDateString"));
    });
    it('Date difference comparison (older)', function () {
      assert(this.bSetup.get("canCheckHigherDate"));
    });
    it('Date difference comparison against a number (older)', function () {
      assert(this.bSetup.get("canCheckHigherDateNumber"));
    });
    it('Date equality comparison against string (older)', function () {
      assert(!this.bSetup.get("canCheckHigherDateString"));
    });
    it('Date difference comparison (younger)', function () {
      assert(this.bSetup.get("canCheckLowerDate"));
    });
    it('Date difference comparison against a number (younger)', function () {
      assert(this.bSetup.get("canCheckLowerDateNumber"));
    });
    it('Date difference comparison against string (younger)', function () {
      assert(!this.bSetup.get("canCheckLowerDateString"));
    });
  });
};
