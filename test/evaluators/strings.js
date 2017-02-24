/**
 * Created by j.corns on 2/22/17.
 */

var assert = require("assert");
var barry = require('../../lib/barry');
module.exports = function (assert) {
  before(function () {

    describe('#string evaluation', function () {
      this.checkData = {
        id: 4,
        hasStringValue: "a string check value"
      };
      this.features = {
        // simple string
        "canCheckHasString": {
          "criteria": [
            {
              "has": {
                "trait": "hasStringValue",
                "comparison": "equals",
                "value": "a string check value"
              }
            }
          ]
        }
      };
      this.bSetup = barry.setup({
        data: this.checkData,
        features: this.features,
        overrides: {},
        showLogs: true
      });
    });
    it('"canCheckHasString" should evaluate to true', function () {
      assert(this.bSetup.get("canCheckHasString"));
    });
  });
};
