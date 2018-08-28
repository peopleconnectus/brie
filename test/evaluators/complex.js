/**
 * Created by j.corns on 2/22/17.
 */

var assert = require('assert');
var brie = require('../../lib/brie');
module.exports = function () {
  describe('#complex evaluation', function () {
    before(function () {
      this.checkData = {
        id: 123456789,
        hasStringValue: 'a string check value',
        hasNumberValue: 181818,
        hasObjectValue: { a: 1, b: 2 },
        hasDateValue: new Date(),
        hasBooleanValue: true,
        nested: {
            one: {
                a: 1,
                b: 2
            }
        }
      };
      this.features = {
        // combination comparisons
        // implied 'all'
        'canCheckNoTrait': {
          'criteria': [
            {
              'has': {
                'comparison': 'equals',
                'value': 'anything'
              }
            }
          ]
        },
        'canCheckComplexAll': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'below',
                'value': 5
              }
            },
            {
              'has': {
                'trait': 'hasStringValue',
                'comparison': 'equals',
                'value': 'a string check value'
              }
            }
          ]
        },
        // explicit 'any'
        'canCheckComplexAny': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'below',
                'value': 9999999
              }
            },
            {
              'has': {
                'trait': 'hasStringValue',
                'comparison': 'equals',
                'value': 'a string check value'
              }
            }
          ],
          'criteriaLogic': 'any'
        },
        'canCheckSimpleAny': {
          'criteria': [
            {
              'has': {
                'trait': 'hasNumberValue',
                'comparison': 'below',
                'value': 9999999
              }
            },
            {
              'has': {
                'trait': 'hasStringValue',
                'comparison': 'equals',
                'value': 'a string check value'
              }
            }
          ],
          'criteriaLogic': 'any'
        },
        'canCheckNestedTraits': {
          'criteria': [
            {
              'has': {
                'trait': 'nested.one.a',
                'comparison': 'below',
                'value': 5
              }
            }
          ]
        },
        'canCheckBadNestedTraits': {
          'criteria': [
            {
              'has': {
                'trait': 'nested.one.a.nope',
                'comparison': 'below',
                'value': 5
              }
            }
          ]
        },
        // 'for-ids' check
        'canCheckAllowIds': {
          'criteria': [
            {
              'allowIDs': [1234, 5678, 91011, 123456789]
            }
          ]
        },
        // for 'percentScale' check
        'canCheckPercentScale': {
          'criteria': [
            {
              'percentScale': {
                percentMin: 0,
                percentMax: .4,
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleNoMin': {
          'criteria': [
            {
              'percentScale': {
                percentMax: .4,
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleNoMax': {
          'criteria': [
            {
              'percentScale': {
                percentMin: .4,
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleBadMin': {
          'criteria': [
            {
              'percentScale': {
                percentMin: 'zero',
                percentMax: .4,
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleBadMax': {
          'criteria': [
            {
              'percentScale': {
                percentMin: .1,
                percentMax: 'point-four',
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleBigMin': {
          'criteria': [
            {
              'percentScale': {
                percentMin: 22,
                percentMax: 72,
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleBigMax': {
          'criteria': [
            {
              'percentScale': {
                percentMin: 1,
                percentMax: 50,
                salt: 9,
                testPhase: 'Can Check Percent Scale'
              }
            }
          ]
        },
        'canCheckPercentScaleNoSalt': {
          'criteria': [
            {
              'percentScale': {
                percentMin: 1,
                percentMax: 50,
                testPhase: 'Needs Salt'
              }
            }
          ]
        },
        'canCheckPercentScaleNoLabel': {
          'criteria': [
            {
              'percentScale': {
                percentMin: 1,
                percentMax: 50,
                salt: 9
              }
            }
          ]
        },
        'fullCheckWithOverrides': {
          'criteria': [
            {
              'has': {
                'trait': 'hasStringValue',
                'comparison': 'equals',
                'value': 'a string check value'
              }
            }
          ]
        }
      };
      this.bSetup = brie.setup({
        data: this.checkData,
        features: this.features,
        overrides: {'fullCheckWithOverrides' : false},
        showLogs: false
      });

    });

    it('\'canCheckComplexAll\' should evaluate to false', function () {
      assert(!this.bSetup.get('canCheckComplexAll'));
    });
    it('\'canCheckComplexAny\' should evaluate to true', function () {
      assert(this.bSetup.getAll());
    });
    it('\'canCheckSimpleAny\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckSimpleAny'));
    });
    it('\'fullCheckWithOverrides\' should evaluate to false', function () {
      assert(!this.bSetup.getAll()['fullCheckWithOverrides']);
    });
    it('\'canCheckAllowIds\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckAllowIds'));
    });
    it('\'canCheckNestedTraits\' should evaluate to true', function () {
      assert(this.bSetup.get('canCheckNestedTraits'));
    });
    it('\'canCheckBadNestedTraits\' bad trait keys should evaluate to false', function () {
      assert(!this.bSetup.get('canCheckBadNestedTraits'));
    });
    it('percentScale should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScale') === 'boolean');
    });
    it('percentScale with no \'minimum\' should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleNoMin') === 'boolean');
    });
    it('percentScale with no \'maximum\' should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleNoMax') === 'boolean');
    });
    it('percentScale with bad \'minimum\' should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleBadMin') === 'boolean');
    });
    it('percentScale with bad \'maximum\' should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleBadMax') === 'boolean');
    });
    it('percentScale with minimum over 1 should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleBigMin') === 'boolean');
    });
    it('percentScale with maximum over 1 should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleBigMax') === 'boolean');
    });
    it('percentScale without salt should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleNoSalt') === 'boolean');
    });
    it('percentScale without label should evaluate', function () {
      assert(typeof this.bSetup.get('canCheckPercentScaleNoLabel') === 'boolean');
    });
  });
};
