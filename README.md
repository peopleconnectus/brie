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

##### equals
 * (`date`) - a **strict** equality check between base comparison date and check date.  If the check value is a number, then barry evaluates the difference between `now()` and the comparison date to be equal to the check value, in days (e.g. "0" implies "today").
 * (`numeric`) - a **non-strict** equality check.
 * (`string`) - a**strict**equality check that the comparison string is identical to the check value note that this is a case-sensitive check.  See "like", below.

##### above
 * (`date`) - [alias: "longer", "older"] checks to see that the comparison date is older than the check date.  If the check value is a number, barry checks to see that the comparison date is at least as old, in days, as the check value, compared to `now()` (e.g. "1" implies the date must be yesterday or older).
 * (`numeric`) - [alias: "longer"] a greater-than-or-equal-to check that the comparison number is greater than the check value.
 * (`string`) - performs a javascript string "greater-than-or-equal" comparison.  As a loosely-typed language, this could be anything, really.

##### below
 * (`date`) - [alias: "shorter", "younger"] checks to see that the comparison date is more recent than the check date.  If the check value is a number, barry checks to see that the comparison date is at least as new, in days, as the check value, compared to `now()` (e.g. "1" implies the date must be tomorrow or younger).
 * (`numeric`) - [alias: "shorter"] a less-than-or-equal-to check that the comparison number is smaller than the check value.
 * (`string`) - performs a javascript string "less-than-or-equal" comparison.  As a loosely-typed language, this could be anything, really.

##### like
 * (`string`) - a **non-strict** check that the `toLowerCase()` comparison string is equal to the `toString().toLowerCase()` check value.

##### longer
 * (`string`) - true if the length of the comparison string (non-trimmed) is greater than or equal to the length of the check value (non-trimmed).

##### shorter
 * (`string`) - true if the length of the comparison string (non-trimmed) is less than or equal to the length of the check value (non-trimmed).


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

