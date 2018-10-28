```## async runTest => RunTestResult
[
  ["test", "Test"]
]
```

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after (using the same test time-out). Returns the `started`, `finished`, `error`, `result` and `destroyResult` properties.

%TYPEDEF types/run-test.xml Test%

%TYPEDEF types/run-test.xml RunTestResult%

%EXAMPLE: example/run-test.js, ../src => @zoroaster/run-test%
%FORK-js example example/run-test%

%~%