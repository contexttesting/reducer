## API

The package is available by importing its default reducer and the `runTest` function:

```js
import reducer, { runTest } from '@zoroaster/reducer'
```

%~%

```## reducer
[
  ["tests", "Test[]"],
  ["config?", "Config"]
]
```

Runs the tests in the array if necessary and returns a new array.

%TYPEDEF types/reducer.xml%
%TYPEDEF types/test.xml%

%~%

```## runTest
[
  ["config", "RunTest"]
]
```

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after.

%TYPEDEF types/reducer.xml%
%TYPEDEF types/run-test.xml%

%~%