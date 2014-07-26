This is barry
=============
This Business Rules Engine (B.R.E, or "barry") is a transient Feature Flipping Criteria System for Node, based on [fflip](https://github.com/FredKSchott/fflip).  

```
npm install git+ssh://gitolite@git.corp.sea1.cmates.com:site-node-modules.git#barry
```

##Getting Started
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

###Criteria
Criteria are the rules that __barry__ tests data against. __barry__ has a set of predefined Criteria. These criteria are not exposed to the caller, but are used internally to evaluate features.  Features (below) can reference these criteria names as success gates.  The response from a criteria method is *always* boolean.  __barry__ has:
```
 always(bool)           // asks barry to "always" respond with the given input.  Why?  Code consistency, mainly.
 isPaidUser(bool)       // accepts a boolean check value (isPaid===true or isPaid===false) 
 percentageScale(opts)  // opts = {percentMin:[0-1], percentMax:[0-1],salt:[number],testPhase:[string]}.  "testPhase" is used for logging and debugging only, and does not impact the algorithm.
                        // the data.id is used to calculate a percentage, modified by the salt value. If the resulting, salted number is within range, returns boolean::true; otherwise false.
 allowedUserIds(array)  // expects an array of 0 or more items. If data.id is in the array, boolean::true is returned; otherwise, false.
 
```


###Features
Features contain sets of criteria to test users against. The value associated with the criteria is passed in as the data argument of the criteria function. A user will have a featured enabled if they match all listed criteria, otherwise the feature is disabled. Features can include other optional properties for context. Features are described as follows:
```javascript
var ExampleFeaturesObject = {
  paidFeature: {
    criteria: {
      isPaidUser: true
    }
  },
  closedBeta: {
    name: "A Closed Beta",
    criteria: {
      allowUserIDs: [20,30,80,181]
    }
  },
  newFeatureRollout: {
    name: "A New Feature Rollout",
    description: "Rollout of that new feature over the next month",
    owner: "FredKSchott", // Remember: These are all optional, only criteria is required 
    criteria: {
      isPaidUser: false,
      percentageOfUsers: 0.50
    }
  }
}
```

##Usage
```
Object setup(options)         // barry needs to be initialized with a data object and a set of features.  Don't try to make barry do stuff without setting up first. That makes barry angry.
Bool   get(string feature)    // asks barry if the feature is enabled.
Object getAll()               // requests the full evaluation of features from barry
```

