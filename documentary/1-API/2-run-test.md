```## async runTest => RunTestResult
[
  ["test", "TestLite"]
]
```

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after (using the same test time-out). Returns the `started`, `finished`, `error`, `result` and `destroyResult` properties.

%TYPEDEF types/run-test.xml%

%EXAMPLE: example/run-test.js, ../src => @zoroaster/run-test%
%FORK-js example example/run-test%

%~%