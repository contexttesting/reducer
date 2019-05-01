```## async reducer => TestSuite
[
  ["tests", "Array<Test|TestSuite>"],
  ["config?", "ReducerConfig"]
]
```

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

%EXAMPLE: example/reducer, ../src => @zoroaster/reducer%
%FORK-js example/reducer%

%TYPEDEF types/reducer.xml ReducerConfig RunTestResult%

A recursive tree is returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).


%~%

<!-- <type name="TestSuite" desc="The structure which will be passed to the `runTestSuite` method.">
  <prop string name="name">The name of the test suite.</prop>
  <prop type="Test[]" name="tests">The tests and test suites to reduce.</prop>
</type> -->