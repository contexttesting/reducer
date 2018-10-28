```## reducer
[
  ["tests", "Test[]"],
  ["config?", "Config"]
]
```

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The [`runTest`](#runtestconfig-runtest-void) method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

%TYPEDEF types/reducer.xml%

%~%