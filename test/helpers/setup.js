var assert = require("assert");
var brie = require('../../lib/brie');
module.exports = function () {
  describe('Setup', function () {
    before(function () {

      this.checkData = {
        id: 123456789,
        hasStringValue: "a string check value",
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: new Date(),
        hasBooleanValue: true
      };
    });
    it('should return a live object', function () {

      var bSetup = brie.setup({
        data: this.checkData,
        features: {
          // always evaluator
          "canCheckAlways": {
            "criteria": [
              {
                "always": false
              }
            ]
          }
        },
        overrides: {},
        showLogs: false
      });
      assert(!!(bSetup));
    });
    it('should reject invalid feature', function () {
      var bSetup = brie.setup({
        data: this.checkData,
        features: { "invalidFeature": "no a valid type" },
        overrides: {},
        showLogs: true
      });
      assert(bSetup.get("invalidFeature"));
    });
    it('should handle disabled features', function () {

      var bSetup = brie.setup({
        data: this.checkData,
        features: {
          // always evaluator
          "canCheckAlways": {
            "criteria": [
              {
                "always": false
              }
            ]
          },
          "canCheckAnother": {
            "enabled": false,
            "criteria": [
              {
                "always": true
              }
            ]
          }
        },
        overrides: {}
      });
      assert(bSetup.getAll());
    });
    it('accepts missing criteria', function () {
      var bSetup = brie.setup({
        data: this.checkData,
        features: {
          "acceptsMissingCrits": {
          }
        },
        overrides: {},
        showLogs: false
      });
      assert(!bSetup.get('acceptsMissingCrits'));
    });
    it('should return false for simple criteria', function () {
      var bSetup = brie.setup({
        data: this.checkData,
        features: {
          "ignoresMissingCriteria": { "criteria": ["string"] }
        },
        overrides: {},
        showLogs: false
      });
      assert(bSetup.getAll());
    });
    it('should return false for missing criteria', function () {
      var bSetup = brie.setup({
        data: this.checkData,
        features: {
          "ignoresMissingCriteria": { "criteria": [{}] }
        },
        overrides: {},
        showLogs: false
      });
      assert(bSetup.getAll());
    });
    it('accepts missing features', function () {
      var bSetup = brie.setup({
        data: this.checkData,
        overrides: {},
        showLogs: false
      });
      assert(!!(bSetup));
    });
    it('accepts missing overrides', function () {
      var bSetup = brie.setup({
        data: this.checkData,
        features: {},
        showLogs: false
      });
      assert(bSetup.getAll());
    });
    it('accepts missing data', function () {
      var bSetup = brie.setup({
        overrides: {},
        features: {},
        showLogs: false
      });
      assert(!!(bSetup));
    });
  });
};
