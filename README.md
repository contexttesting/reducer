# @zoroaster/reducer

[![npm version](https://badge.fury.io/js/%40zoroaster%2Freducer.svg)](https://npmjs.org/package/@zoroaster/reducer)

`@zoroaster/reducer` is a recursive reducer of tests and tests suites that can also focus on particular ones; and a test runner that supports contexts evaluation and timeouts.

```sh
yarn add -E @zoroaster/reducer
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async reducer(tests: Array<Test|TestSuite>, config?: ReducerConfig): TestSuite`](#async-reducertests-arraytesttestsuiteconfig-reducerconfig-testsuite)
- [The Types](#the-types)
  * [`_contextTesting.ReducerConfig`](#type-_contexttestingreducerconfig)
- [`async runTest(test: Test): RunTestResult`](#async-runtesttest-test-runtestresult)
  * [`_contextTesting.RunTestResult`](#type-_contexttestingruntestresult)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>



## API

The package is available by importing its default reducer and the `runTest` function:

```js
import reducer, { runTest } from '@zoroaster/reducer'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>



## `async reducer(`<br/>&nbsp;&nbsp;`tests: Array<Test|TestSuite>,`<br/>&nbsp;&nbsp;`config?: ReducerConfig,`<br/>`): TestSuite`

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

```js
import reducer from '@zoroaster/reducer'

(async () => {
  const { test, test1 } = await reducer([
    {
      name: 'test',
      fn() { return 'ok' },
    },
    {
      name: 'test1',
      fn() { throw new Error('fail') },
    },
  ], {
    runTest({ fn, name }) {
      let result
      try {
        result = fn()
      } catch (error) {
        console.log('[x] %s: %s', name, error.message)
        return { error: error.message }
      }
      console.log('[+] %s%s', name, result ? `: ${result}` : '')
      return { result }
    },
  })
  console.log(test)
  console.log(test1)
})()
```
```js
[+] test: ok
[x] test1: fail
{ name: 'test', fn: [Function: fn], result: 'ok' }
{ name: 'test1', fn: [Function: fn], error: 'fail' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## The Types

There are common __contextTesting_ types used in this package. They are available in the [`@zoroaster/types`](https://github.com/contexttesting/types) package.

[`import('@zoroaster/types').Test`](https://github.com/contexttesting/types#type-_contexttestingtest) __<a name="type-_contexttestingtest">`_contextTesting.Test`</a>__: The test interface.

[`import('@zoroaster/types').TestSuite`](https://github.com/contexttesting/types#type-_contexttestingtestsuite) __<a name="type-_contexttestingtestsuite">`_contextTesting.TestSuite`</a>__: The test sutie interface.

__<a name="type-_contexttestingreducerconfig">`_contextTesting.ReducerConfig`</a>__: The options for the reducer.

|       Name        |                                                                                                                               Type                                                                                                                               |                                                             Description                                                              | Default |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| onlyFocused       | <em>boolean</em>                                                                                                                                                                                                                                                 | Run only focused tests.                                                                                                              | `false` |
| __runTest*__      | <em>function(<a href="#type-_contexttestingtest" title="The test interface.">!_contextTesting.Test</a>): !Promise</em>                                                                                                                                           | The function that wraps around `@zoroaster/reducer.runTest` method.                                                                  | -       |
| __runTestSuite*__ | <em>function(<a href="#type-_contexttestingtestsuite" title="The test sutie interface.">!_contextTesting.TestSuite</a>, boolean): !Promise&lt;<a href="#type-_contexttestingtestsuite" title="The test sutie interface.">!_contextTesting.TestSuite</a>&gt;</em> | The function used to run a test suite. The second argument receives whether only focused tests should be run within this test suite. | -       |

Tests have a raw `context` property which is a context constructor. It should return an object or an instance that can store a state. It is then passed by the reducer to the `runTest` method which evaluates it. The package can evaluate the context of the class, function and object types. Tests receive evaluated context to access the testing API and the state.

A recursive tree is returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>



## `async runTest(`<br/>&nbsp;&nbsp;`test: Test,`<br/>`): RunTestResult`

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after (using the same test time-out). Returns the `started`, `finished`, `error`, `result` and `destroyResult` properties.

The `persistentContext` property can contain either an array or a single evaluated context instance. They are the passed to tests in the argument list before any of the non-persistent test contexts.

In the example below, the `reducer` is given and array of tests and the `runTest` function. The test has the `fn` property and 2 contexts: one as an object and another one as a class. They are evaluated and passed to the test. The `_destroy` method of the class context is used to calculate the time taken to run the test. Finally, the result of the `runTest` is assigned to the tests in the array.

```js
import reducer, { runTest } from '@zoroaster/run-test'

(async () => {
  const persistentContext = await Promise.resolve('EXAMPLE')
  const { test } = await reducer([
    {
      name: 'test',
      context: [
        { TEST: 'hello' },
        class Context {
          async _init() {
            this.data = 'world'
            this._started = new Date()
          }
          async _destroy() {
            const dt = new Date().getTime() - this._started.getTime()
            return `${dt}ms`
          }
        },
      ],
      persistentContext,
      async fn(pc, { TEST }, { data }) {
        await new Promise(r => setTimeout(r, 100))
        return `[${pc}] ${TEST}-${data}: ok`
      },
    },
  ], {
    runTest,
  })
  console.log(test)
})()
```
```fs
{ name: 'test',
  context: [ { TEST: 'hello' }, [Function: Context] ],
  persistentContext: 'EXAMPLE',
  fn: [AsyncFunction: fn],
  started: 2019-05-01T17:32:13.889Z,
  finished: 2019-05-01T17:32:13.998Z,
  error: null,
  result: '[EXAMPLE] hello-world: ok',
  destroyResult: [ undefined, '109ms' ] }
```

__<a name="type-_contexttestingruntestresult">`_contextTesting.RunTestResult`</a>__: The result of the runTest function.

|     Name      |      Type      |                         Description                          | Default |
| ------------- | -------------- | ------------------------------------------------------------ | ------- |
| __started*__  | <em>Date</em>  | The date when the test started.                              | -       |
| __finished*__ | <em>Date</em>  | The date when the test finished.                             | -       |
| error         | <em>Error</em> | The error which happened during the test.                    | `null`  |
| result        | <em>*</em>     | The result which the test returned.                          | `null`  |
| destroyResult | <em>*</em>     | The result which the destroy method on the context returned. | `null`  |


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright


  (c) [Context Testing](https://contexttesting.com) 2019


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>