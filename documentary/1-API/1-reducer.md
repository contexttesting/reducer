```## async reducer => Tree
[
  ["tests", "Array<Test|TestSuite>"],
  ["config?", "ReducerConfig"]
]
```

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

%EXAMPLE: example/reducer, ../src => @zoroaster/reducer%
%FORK example/reducer%
%FORKERR-jsx example/reducer%

%~%

The main interfaces that the _@Zoroaster/Reducer_ uses are the Test and TestSuite, which contain the minimal properties required to decide whether to run a test, or reduce a test suite further. They are shared with `zoroaster` binary and come from the [`@zoroaster/types`](https://github.com/contexttesting/types) package.

<!-- There are common __contextTesting_ types used in this package.  -->

<!-- The types can also be imported in the JS file:

```js
/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */
``` -->

%TYPEDEF types/reducer.xml%

The reducer iterates through the array of provided tests (which can either be test cases or test suites) and passes them one-by-one to the given `runTest` and `runTestSuite` methods which in turn must call `@zoroaster/reducer.runTest` method. All additional operations such as logging of results must be done by those methods, therefore this library provides the means of iterating through items and running them serially, while also evaluating the contexts. Tests can have a raw `context` property which is either a context constructor or a context object. If it is a constructor, it should return an object or an instance that stores a state. The package can evaluate the context of the class, function and object types. Tests then receive evaluated context to access the testing API and the state.

A recursive tree is returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).

%~%

<!-- <type name="TestSuite" desc="The structure which will be passed to the `runTestSuite` method.">
  <prop string name="name">The name of the test suite.</prop>
  <prop type="Test[]" name="tests">The tests and test suites to reduce.</prop>
</type> -->