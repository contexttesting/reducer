const _runTest = require('./lib/run-test');
const _reducer = require('./lib/reducer');

/**
 * Asynchronously runs the test within a timeout limit. Evaluates the contexts beforehand and destroys them after.
 * @param {_contextTesting.Test} test The test structure used in `runTest`.
 * @param {!Function} test.fn The test function to run.
 * @param {!Array<_contextTesting.ContextConstructor>} [test.context] Any context constructors for the test to be evaluated.
 * @param {!Array<_contextTesting.Context>} [test.persistentContext] Any evaluated context constructors for the test that are managed by the test suite.
 * @param {?number} [test.timeout="null"] The timeout for the test, context evaluation and destruction. Default `null`.
 */
const runTest = (test) => _runTest(test)

/**
 * Run all tests in sequence, one by one.
 * This also runs only selected tests, e.g., !test and !test suite
 * @param {!Array<_contextTesting.TestOrTestSuite>} tests An array with tests to reduce.
 * @param {_contextTesting.ReducerConfig} config The options for the reducer.
 * @param {boolean} [config.onlyFocused=false] Run only focused tests. Default `false`.
 * @param {function({ fn: !Function }): !Promise} config.runTest The function used to run a test.
 * @param {function(!Object, boolean): !Promise<!TestSuite>} config.runTestSuite The function used to run a test suite.
 *
 * @example
```ts
type TestOrTestSuite = {
  context?: function(new: Context)
  timeout?: number;
  name: number;
  isFocused?: boolean;
  hasFocused?: boolean;
  fn: Function;
}
```
 */
const reducer = (tests, config) => _reducer(tests, config)


module.exports=reducer

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').Test} _contextTesting.Test
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').ReducerConfig} _contextTesting.ReducerConfig
 */

module.exports.runTest = runTest