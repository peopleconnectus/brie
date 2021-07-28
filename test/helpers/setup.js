const assert = require("assert");
const brie = require('../../lib/brie');
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

      const bSetup = brie.setup({
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
      const bSetup = brie.setup({
        data: this.checkData,
        features: { "invalidFeature": "no a valid type" },
        overrides: {},
        showLogs: true
      });
      assert(bSetup.get("invalidFeature"));
    });
    it('should handle disabled features', function () {

      const bSetup = brie.setup({
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
      const bSetup = brie.setup({
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
      const bSetup = brie.setup({
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
      const bSetup = brie.setup({
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
      const bSetup = brie.setup({
        data: this.checkData,
        overrides: {},
        showLogs: false
      });
      assert(!!(bSetup));
    });
    it('accepts missing overrides', function () {
      const bSetup = brie.setup({
        data: this.checkData,
        features: {},
        showLogs: false
      });
      assert(bSetup.getAll());
    });
    it('accepts missing data', function () {
      const bSetup = brie.setup({
        overrides: {},
        features: {},
        showLogs: false
      });
      assert(!!(bSetup));
    });

    it("replaces data when called twice", function () {
        const fakeNumber = '8675309'
        const features = {
          allowId:{
            criteria: [{
              allowValues: {
                trait: "aId",
                values: [
                  fakeNumber
                ]
              }
            }]
          }
        }
  
        const b1 = brie.setup({
          data: {
            aId: fakeNumber
          },
          overrides: {},
          features,
        });

        assert.deepEqual(b1.get('allowId'), true)

        const b2 = b1.setup({
          data: {
            wrongId: "555555"
          },
          overrides: {},
          features,
        });

        assert.deepEqual(b2.get('allowId'), false)
    })
  });
};
