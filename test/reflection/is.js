const assert = require("assert");
const brie = require('../../lib/brie');
module.exports = function () {

  describe('#is and type-check', function () {
    before(function () {
      let checkData = {
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
      };
      let features = {
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
    it('will check that a property is of a known type         should evaluate to true', function () {
      assert(this.bSetup.get("canCheckValidType"));
    });
    it('will reject an operation for an unknown type          should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckInvalidType"));
    });
    it('will reject an operation for a null type              should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckNullType"));
    });
    it('will reject an operation for an undefined type        should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckUndefinedType"));
    });
    it('will reject an operation when trait is missing        should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckUndefinedTrait"));
    });
    it('will reject an empty "is" block                       should evaluate to false', function () {
      assert(!this.bSetup.get("canCheckEmptyIs"));
    });
    it('will test nested properties by dot notation           should evaluate to false', function () {
      assert(this.bSetup.get("canCheckNestedTraits"));
    })
  });
};
