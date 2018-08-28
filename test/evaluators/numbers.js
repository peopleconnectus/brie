/**
 * Created by j.corns on 2/22/17.
 */
var assert = require('assert');
var brie = require('../../lib/brie');

var debug = require('debug')('brie:tests_numbers');

module.exports = function () {

  describe('#number evaluation', function () {
    before(function () {
      this.checkData = {
        id: 123456789,
        hasStringValue: 'a string check value',
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: new Date(),
        hasBooleanValue: true
      };
      this.features = {
        // number comparators
        'canCheckHigherNumber': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'above',
                'value': 1
              }
            }
          ]
        },
        'canCheckLowerNumber': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'below',
                'value': 9999999
              }
            }
          ]
        },
        'canCheckEqualNumber': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'equals',
                'value': 181818
              }
            }
          ]
        },
        'canCheckInvalidNumber': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'equals',
                'value': null
              }
            }
          ]
        },
        'canCheckBetweenNumbers': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'between',
                'value': [7, 9999999]
              }
            }
          ]
        },
        'canCheckBetweenBadArray': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'between',
                'value': 'not an array'
              }
            }
          ]
        },
        'canCheckBetweenInfinities': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'between',
                'value': [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
              }
            }
          ]
        },
        'canCheckBetweenNaNs': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'between',
                'value': [null, null]
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
    it('\'canCheckHigherNumber\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckHigherNumber'));
    });
    it('\'canCheckLowerNumber\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckLowerNumber'));
    });
    it('\'canCheckEqualNumber\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckEqualNumber'));
    });
    it('\'canCheckInvalidNumber\' should evaluate to false', function () {
      assert(!this.bSetup.get('canCheckInvalidNumber'));
    });
    it('\'canCheckBetweenNumbers\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckBetweenNumbers'));
    });
    it('\'canCheckBetweenNumbers\' should evaluate to false', function () {
      assert(!this.bSetup.get('canCheckBetweenBadArray'), ' when the passed value is not an array');
    });
    it('\'canCheckBetweenNumbers\' survives infinity', function () {
      assert(!this.bSetup.get('canCheckBetweenInfinities'), 'Special case, when the bounds faile the \'Number.isFinite()\' check, that Brie evaluates this to false');
    });
    it('\'canCheckBetweenNumbers\' survives NaN', function () {
      assert(!this.bSetup.get('canCheckBetweenNaNs'), 'Special case, when the bounds faile the \'Number.isFinite()\' check, that Brie evaluates this to false');
    });
  });
};
