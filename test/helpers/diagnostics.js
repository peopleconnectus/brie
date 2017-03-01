var assert = require("assert");
var brie = require('../../lib/brie');
module.exports = function () {
  describe('Diagnostics', function () {
    describe('#exist', function () {
      before(function () {
        this.d = brie.diagnostics();
      });
      it('should return some value', function () {
        assert.ok(this.d);
      });
      it('should read features', function () {
        assert((typeof this.d.features === "object" && typeof this.d.features.length === "undefined"));
      });
      it('should read data', function () {
        assert((typeof this.d.data === "object" && typeof this.d.data.length === "undefined"));
      });
      it('should have criteria', function () {
        assert(!!(this.d));
      });
      it('recognizes data type: string', function () {
        assert(this.d.getType("abcd") === 'string');
      });
      it('recognizes data type: integer', function () {
        assert(this.d.getType(1) === 'number');
      });
      it('recognizes data type: object', function () {
        assert(this.d.getType({ 'a': 1 }) === 'object');
      });
      it('recognizes data type: array', function () {
        assert(this.d.getType([1, 2, 3]) === 'array');
      });
      it('recognizes data type: date', function () {
        assert(this.d.getType(new Date()) === 'date');
      });
      it('recognizes data type: boolean', function () {
        assert(this.d.getType(true) === 'boolean');
      });
      it('recognizes data type: null', function () {
        assert(this.d.getType(null) === 'object'); // Yup - null is an object.  Read the spec: http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.3
      });
      it('recognizes data type: undefined', function () {
        assert(this.d.getType(undefined) === 'undefined');
      });
    });

    describe('#criteria are executable', function () {
      var t_d = brie.diagnostics();
      for (var c in t_d.criteria) {
        if (t_d.criteria.hasOwnProperty(c)) {
          (function (cta) {
            it('criteria "' + cta + '" should be a function', function () {
              var k = typeof t_d.criteria[cta] === 'function';
              assert(k);
            });
          })(c);
        }
      }
    });
  });
};
