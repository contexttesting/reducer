```## async reducer => TestSuiteLite
[
  ["tests", "TestOrTestSuite[]"],
  ["config?", "Config"]
]
```

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

%TYPEDEF types/test.xml%

%TYPEDEF types/reducer.xml%

%EXAMPLE: example/reducer.js, ../src => @zoroaster/reducer%
%FORK-js example example/reducer%

%~%

<!-- <type name="TestSuite" desc="The structure which will be passed to the `runTestSuite` method.">
  <prop string name="name">The name of the test suite.</prop>
  <prop type="Test[]" name="tests">The tests and test suites to reduce.</prop>
</type> -->