```## async runTest => RunTestResult
[
  ["test", "Test"]
]
```

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after (using the same test time-out). Returns the `started`, `finished`, `error`, `result` and `destroyResult` properties.

%TYPEDEF types/run-test.xml Test%

%TYPEDEF types/run-test.xml RunTestResult%

In the example below, the `reducer` is given and array of tests and the `runTest` function. The test has the `fn` property and 2 contexts: one as an object and another one as a class. They are evaluated and passed to the test. The `_destroy` method of the class context is used to calculate the time taken to run the test. Finally, the result of the `runTest` is assigned to the tests in the array.

%EXAMPLE: example/run-test.js, ../src => @zoroaster/run-test%
%FORK-fs example example/run-test%

%~%