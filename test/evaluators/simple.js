/**
 * Created by j.corns on 2/22/17.
 */

var assert = require("assert");
var barry = require('../../lib/barry');
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
      this.bSetup = barry.setup({
        data: this.checkData,
        features: this.features,
        overrides: {},
        showLogs: false
      });
    });
    for (var feature in this.features) {
      if (this.features.hasOwnProperty(feature)) {
        (function (f) {
          it('"' + f + '" should evaluate to boolean', function () {
            var getF = this.bSetup.get(f);
            assert((typeof this.bSetup.get(f) === 'boolean'));
          });
        })(feature);
      }
    }
    it('"canCheckAlways" should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckAlways"));
    });
    it('should pass the "getAll" features', function () {
      var allOut = this.bSetup.getAll();
      assert(!!(allOut));
    });
    it('will not error on missing feature', function () {
      assert(!this.bSetup.get('noCheckFunction'))
    });
  });
};
