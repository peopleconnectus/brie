const assert = require("assert");
const brie = require('../../lib/brie');
module.exports = function () {

  describe('#simple evaluation', function () {
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
        // always evaluator
        "canCheckAlways": {
          "criteria": [
            {
              "always": false
            }
          ]
        },
        "canCheckHas": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue"
              }
            }
          ]
        },
        "canCheckHasNot": {
          "criteria": [
            {
              "has": {
                "trait": "doesNotHaveThis"
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

    it('"getAll" features method                              should succeed', function () {
      const allOut = this.bSetup.getAll();
      assert(!!(allOut));
    });
    it('"canCheckAlways"                                      should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckAlways"));
    });
    it('an unknown feature flag name                          should evaluate to false', function () {
      assert(!this.bSetup.get('noCheckFunction'))
    });
  });
};
