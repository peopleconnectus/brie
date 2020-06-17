const assert = require("assert");
const brie = require('../../lib/brie');
module.exports = function () {
  describe('#object evaluation', function () {
    before(function () {

      this.checkData = {
        id: 123456789,
        hasStringValue: "a string check value",
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: new Date(),
        hasBooleanValue: true,
        hasSimpleArray: [1, 2, 3]
      };
    });
    describe('#objects', function () {
      before(function () {
        const features = {
          // object comparator
          "canCheckEqualObject": {
            "criteria": [
              {
                "has": {
                  "trait": "hasObjectValue",
                  "comparison": "equals",
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
          "canCheckAboveObjectMixed": {
            "criteria": [
              {
                "has": {
                  "trait": "hasObjectValue",
                  "comparison": "above",
                  "value": ["a", "b"]
                }
              }
            ]
          },
          "canCheckAboveObjectEqual": {
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
          "canCheckBelowObjectEqual": {
            "criteria": [
              {
                "has": {
                  "trait": "hasObjectValue",
                  "comparison": "below",
                  "value": { a: 1, b: 2 }
                }
              }
            ]
          },
          "canCheckBelowObjectMixed": {
            "criteria": [
              {
                "has": {
                  "trait": "hasObjectValue",
                  "comparison": "below",
                  "value": ["a", "b"]
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
        this.bSetup = brie.setup({
          data: this.checkData,
          features: features,
          overrides: {},
          showLogs: false
        });
      });

      it('"canCheckEqualObject"                               should evaluate to true', function () {
        assert(this.bSetup.get("canCheckEqualObject"));
      });
      it('"canCheckAboveObject"                               should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckAboveObject"));
      });
      it('"canCheckAboveObjectEqual"                          should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckAboveObjectEqual"));
      });
      it('"canCheckAboveObjectMixed"                          should evaluate to true', function () {
        assert(!this.bSetup.get("canCheckAboveObjectMixed"));
      });
      it('"canCheckBelowObject"                               should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckBelowObject"));
      });
      it('"canCheckBelowObjectEqual"                          should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckBelowObjectEqual"));
      });
      it('"canCheckBelowObjectMixed"                          should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckBelowObjectMixed"));
      });
      it('"canCheckShorterObject"                             should evaluate to true', function () {
        assert(this.bSetup.get("canCheckShorterObject"));
      });
      it('"canCheckLongerObject"                              should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckLongerObject"));
      });

    });
    describe('#arrays', function () {
      before(function () {
        const features = {
          "canCheckEqualArray": {
            "criteria": [
              {
                "has": {
                  "trait": "hasSimpleArray",
                  "comparison": "equals",
                  "value": [1, 2, 3]
                }
              }
            ]
          },
          "canCheckAboveArray": {
            "criteria": [
              {
                "has": {
                  "trait": "hasSimpleArray",
                  "comparison": "above",
                  "value": [7, 8]
                }
              }
            ]
          },
          "canCheckAboveArrayMixed": {
            "criteria": [
              {
                "has": {
                  "trait": "hasSimpleArray",
                  "comparison": "above",
                  "value": { "a": "z", "b": "y" }
                }
              }
            ]
          },
          "canCheckBelowArray": {
            "criteria": [
              {
                "has": {
                  "trait": "hasSimpleArray",
                  "comparison": "below",
                  "value": [5, 6, 7, 8, 9]
                }
              }
            ]
          },
          "canCheckBelowArrayMixed": {
            "criteria": [
              {
                "has": {
                  "trait": "hasSimpleArray",
                  "comparison": "below",
                  "value": { "a": "z", "b": "y" }
                }
              }
            ]
          }
        };
        this.bSetup = brie.setup({
          data: this.checkData,
          features: features,
          overrides: {},
          showLogs: false
        });
      });

      it('"canCheckEqualArray"                                should evaluate to true', function () {
        assert(this.bSetup.get("canCheckEqualArray"));
      });
      it('"canCheckAboveArray"                                should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckAboveArray"));
      });
      it('"canCheckAboveArrayMixed"                           should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckAboveArrayMixed"));
      });
      it('"canCheckBelowArray"                                should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckBelowArray"));
      });
      it('"canCheckBelowArrayMixed"                           should evaluate to false', function () {
        assert(!this.bSetup.get("canCheckBelowArrayMixed"));
      });
    });
  });
};
