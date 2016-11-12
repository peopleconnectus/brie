This is barry
=============
This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node, based on [fflip](https://github.com/FredKSchott/fflip).

```
npm install ssh://git@bitbucket01.corp.sea1.cmates.com:7999/siteui/barry.git
```

## Getting Started
Below is a simple example that uses __barry__ to deliver feature flags based on a determined (set) of User Variant(s):
```javascript
// Include barry
var barry = require('barry');

// given an inbound data object called "user" plus a set of features (see below) called "featureSet"
barry.setup(
  {
    data: user,
    features: featureSet
  }
);
var flags = barry.getAll();
// expect {feature1: true, feature2: false, ... }
```

### Criteria
Criteria are the rules that __barry__ tests data against. __barry__ has a set of predefined Criteria. These criteria are not exposed to the caller, but are used internally to evaluate features.  Features (below) can reference these criteria names as success gates.  The response from a criteria method is *always* boolean.  The first argument to the criteria method will always be the data object to be evaluated. __barry__ has:

#### allowIDs (object, array)
Provided an object containing an "id" property, barry evaluates the presence of the id in the given array, checking for 1 or more entries.

#### always(object, bool)
`Always` asks barry to "always" respond with the given input.  Why?  Code consistency, mainly.

#### percentageScale(object, opts)
```
  opts = {
    percentMin:[0-1],
    percentMax:[0-1],
    salt:[number],
    testPhase:[string]
  }
```
"testPhase" is used for logging and debugging only, and does not impact the algorithm.

The `object.id` is used to calculate a percentage, modified by the salt value. If the resulting, salted, number is within range, returns boolean::true; otherwise false.

#### has(object, object)
The most complex criteria mechanism, `has` will evaluate the data object (first argument) against the trait, comparator and value provided in the second argument.  If the data has the trait and the associated value evaluates properly considering the comparison and value, then true is returned.

If the comparison object contains only `trait` then barry will evaluate the presence of the property on the data object.
Possible comparisons are:
 * `numeric` equals - a *non-strict* equality check
 * `numeric` above (longer) - a *non-strict* greater-than-or-equal-to check
 * `numeric` below (shorter) - a *non-strict* less-than-or-equal-to check
 * `string` equals -
 * `string` like -
 * `string` below -
 * `string` above -
 * `string` longer -
 * `string` shorter -


### Features
Features contain sets of criteria to test users against. The value associated with the criteria is passed in as the data argument of the criteria function. A user will have a featured enabled if they match all listed criteria, otherwise the feature is disabled. Features can include other optional properties for context. Features are described as follows:
```javascript
var ExampleFeaturesObject = {

}
```

## Usage
```
Object setup(options)         // barry needs to be initialized with a data object and a set of features.  Don't try to make barry do stuff without setting up first. That makes barry angry.
Bool   get(string feature)    // asks barry if the feature is enabled.
Object getAll()               // requests the full evaluation of features from barry
```

