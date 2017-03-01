/**
 * Created by j.corns on 2/22/17.
 */

var assert = require("assert");
var brie = require('../../lib/brie');
module.exports = function () {

  describe('#is and type-check', function () {
    before(function () {
      var checkData = {
          id: 123456789,
          hasStringValue: "a string check value",
          hasNumberValue: 181818,
          hasObjectValue: { a: 1, b: 2 },
          hasDateValue: new Date(),
          hasBooleanValue: true,
          has: {
            nested: {
              values: {
                props: "some value"
              }
            }
          }
        },
        features = {
          // type evaluator
          "canCheckValidType": {
            "criteria": [
              {
                "is": {
                  "type": "number",
                  "trait": "hasNumberValue"
                }
              }
            ]
          },
          "canCheckInvalidType": {
            "criteria": [
              {
                "is": {
                  "type": "shoe",
                  "trait": "hasBooleanValue"
                }
              }
            ]
          },
          "canCheckNullType": {
            "criteria": [
              {
                "is": {
                  "type": null,
                  "trait": "hasBooleanValue"
                }
              }
            ]
          },
          "canCheckUndefinedType": {
            "criteria": [
              {
                "is": {
                  "type": undefined,
                  "trait": "hasBooleanValue"
                }
              }
            ]
          },
          "canCheckUndefinedTrait": {
            "criteria": [
              {
                "is": {
                  "type": "string"
                }
              }
            ]
          },
          "canCheckEmptyIs": {
            "criteria": [
              {
                "is": {
                }
              }
            ]
          },
          "canCheckNestedTraits": {
            "criteria": [
              {
                "is": {
                  "type": "string",
                  "trait": "has.nested.values.props"
                }
              }
            ]
          }
        };
      this.bSetup = brie.setup({
        data: checkData,
        features: features
      });
    });
    it('will check that a property is of a known type', function () {
      assert(this.bSetup.get("canCheckValidType"));
    });
    it('will reject an operation for an unknown type', function () {
      assert(!this.bSetup.get("canCheckInvalidType"));
    });
    it('will reject an operation for a null type', function () {
      assert(!this.bSetup.get("canCheckNullType"));
    });
    it('will reject an operation for an undefined type', function () {
      assert(!this.bSetup.get("canCheckUndefinedType"));
    });
    it('will reject an operation when trait is missing', function () {
      assert(!this.bSetup.get("canCheckUndefinedTrait"));
    });
    it('will reject an empty "is" block', function () {
      assert(!this.bSetup.get("canCheckEmptyIs"));
    });
    it('will test nested properties by dot notation', function () {
      assert(this.bSetup.get("canCheckNestedTraits"));
    })
  });
};
