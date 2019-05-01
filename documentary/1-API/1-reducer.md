```## async reducer => TestSuite
[
  ["tests", "Array<Test|TestSuite>"],
  ["config?", "ReducerConfig"]
]
```

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

%EXAMPLE: example/reducer, ../src => @zoroaster/reducer%
%FORK-js example/reducer%

%~%

## The Types

There are common __contextTesting_ types used in this package. They are available in the [`@zoroaster/types`](https://github.com/contexttesting/types) package.

<!-- The types can also be imported in the JS file:

```js
/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */
``` -->

%TYPEDEF types/reducer.xml%

Tests have a raw `context` property which is a context constructor. It should return an object or an instance that can store a state. It is then passed by the reducer to the `runTest` method which evaluates it. The package can evaluate the context of the class, function and object types. Tests receive evaluated context to access the testing API and the state.

A recursive tree is returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).

%~%

<!-- <type name="TestSuite" desc="The structure which will be passed to the `runTestSuite` method.">
  <prop string name="name">The name of the test suite.</prop>
  <prop type="Test[]" name="tests">The tests and test suites to reduce.</prop>
</type> -->