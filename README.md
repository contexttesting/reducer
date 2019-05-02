# @zoroaster/reducer

[![npm version](https://badge.fury.io/js/%40zoroaster%2Freducer.svg)](https://npmjs.org/package/@zoroaster/reducer)

`@zoroaster/reducer` is a recursive reducer of tests and tests suites that can also focus on particular ones; and a test runner that supports contexts evaluation and timeouts.

```sh
yarn add -E @zoroaster/reducer
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async reducer(tests: Array<Test|TestSuite>, config?: ReducerConfig): Tree`](#async-reducertests-arraytesttestsuiteconfig-reducerconfig-tree)
  * [`_contextTesting.ReducerConfig`](#type-_contexttestingreducerconfig)
- [`async runTest(options: RunTestOptions): RunTestResult`](#async-runtestoptions-runtestoptions-runtestresult)
  * [`_contextTesting.RunTestOptions`](#type-_contexttestingruntestoptions)
  * [`_contextTesting.RunTestResult`](#type-_contexttestingruntestresult)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>



## API

The package is available by importing its default reducer and the `runTest` function:

```js
import reducer, { runTest } from '@zoroaster/reducer'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>



## `async reducer(`<br/>&nbsp;&nbsp;`tests: Array<Test|TestSuite>,`<br/>&nbsp;&nbsp;`config?: ReducerConfig,`<br/>`): Tree`

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

```js
import reducer, { runTest } from '@zoroaster/reducer'

const runInSequence = async (testSuite, level = 0) => {
  const indent = '  '.repeat(level)
  return await reducer(testSuite, {
    async runTest(test) {
      const result = await runTest(test)
      if (result.error) {
        console.log('%s[x] %s: %s', indent, test.name, result.error.message)
      } else {
        console.log('%s[+] %s: %s', indent, test.name, result.result)
      }
      if (result.error) result.error = result.error.message // for display
      return result
    },
    async runTestSuite(ts) {
      console.log('%s %s', indent, ts.name)
      return await runInSequence(ts.tests, level + 1)
    },
  })
}

(async () => {
  const tree = await runInSequence([
    {
      name: 'test',
      fn() { return 'ok' },
    },
    {
      name: 'test with context',
      context: class Context {
        async _init() {
          await new Promise(r => setTimeout(r, 10))
          this.hello = 'world'
        }
      },
      fn({ hello }) { return `ok - ${hello}` },
    },
    {
      name: 'test-suite',
      tests: [
        {
          name: 'test1',
          fn() { throw new Error('fail') },
        },
      ],
    },
  ])
  console.error(tree)
})()
```
```
[+] test: ok
[+] test with context: ok - world
 test-suite
  [x] test1: fail
```
```jsx
{ test: 
   { name: 'test',
     fn: [Function: fn],
     started: 2019-05-02T14:37:00.789Z,
     finished: 2019-05-02T14:37:00.789Z,
     error: null,
     result: 'ok',
     destroyResult: [] },
  'test with context': 
   { name: 'test with context',
     context: [Function: Context],
     fn: [Function: fn],
     started: 2019-05-02T14:37:00.796Z,
     finished: 2019-05-02T14:37:00.810Z,
     error: null,
     result: 'ok - world',
     destroyResult: [ undefined ] },
  'test-suite': 
   { test1: 
      { name: 'test1',
        fn: [Function: fn],
        started: 2019-05-02T14:37:00.811Z,
        finished: 2019-05-02T14:37:00.811Z,
        error: 'fail',
        result: null,
        destroyResult: [] } } }
```

The main interfaces that _@Zoroaster/Reducer_ uses are the _Test_ and _TestSuite_, which contain the minimal properties required to decide whether to run a test using its `fn` function, or to reduce a test suite further using its `tests` property. These types are shared with `zoroaster` binary and come from the [`@zoroaster/types`](https://github.com/contexttesting/types) package, and are provided via externs to be able to compile the project with _Google Closure Compiler_ via [Depack](https://artdecocode.com/depack/).

[`import('@zoroaster/types').Test`](https://github.com/contexttesting/types#type-_contexttestingtest) __<a name="type-_contexttestingtest">`_contextTesting.Test`</a>__: The test interface.

[`import('@zoroaster/types').TestSuite`](https://github.com/contexttesting/types#type-_contexttestingtestsuite) __<a name="type-_contexttestingtestsuite">`_contextTesting.TestSuite`</a>__: The test sutie interface.

__<a name="type-_contexttestingreducerconfig">`_contextTesting.ReducerConfig`</a>__: The options for the reducer.

|       Name        |                                                                                                                               Type                                                                                                                               |                                                             Description                                                              | Default |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| onlyFocused       | <em>boolean</em>                                                                                                                                                                                                                                                 | Run only focused tests.                                                                                                              | `false` |
| __runTest*__      | <em>function(<a href="#type-_contexttestingtest" title="The test interface.">!_contextTesting.Test</a>): !Promise</em>                                                                                                                                           | The function that wraps around `@zoroaster/reducer.runTest` method.                                                                  | -       |
| __runTestSuite*__ | <em>function(<a href="#type-_contexttestingtestsuite" title="The test sutie interface.">!_contextTesting.TestSuite</a>, boolean): !Promise&lt;<a href="#type-_contexttestingtestsuite" title="The test sutie interface.">!_contextTesting.TestSuite</a>&gt;</em> | The function used to run a test suite. The second argument receives whether only focused tests should be run within this test suite. | -       |

The reducer iterates through the array of provided tests (which can either be test cases or test suites) and passes them one-by-one to the given `runTest` and `runTestSuite` methods which in turn must call `@zoroaster/reducer.runTest` method. All additional operations such as logging of results must be done by those methods, therefore this library provides the means of iterating through items and running them serially, while also evaluating the contexts. Tests can have a raw `context` property which is either a context constructor or a context object. If it is a constructor, it should return an object or an instance that stores a state. The package can evaluate the context of the class, function and object types. Tests then receive evaluated context to access the testing API and the state.

A recursive tree is returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>



## `async runTest(`<br/>&nbsp;&nbsp;`options: RunTestOptions,`<br/>`): RunTestResult`

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after (using the same time-out). Returns the `started`, `finished`, `error`, `result` and `destroyResult` properties.

The `persistentContext` property can contain either an array or a single evaluated context instance. They are passed to the tests in the argument list before any of the non-persistent test contexts.

In the example below, the `reducer` is given and array of tests and the `runTest` function. The test has the `fn` property and 2 contexts: one as an object and another one as a class. They are evaluated and passed to the test. The `_destroy` method of the class context is used to calculate the time taken to run the test. Finally, the result of the `runTest` is assigned to the tests in the array.

```js
import reducer, { runTest } from '@zoroaster/run-test'
import { Readable } from 'stream'

(async () => {
  const persistentContext = await Promise.resolve('EXAMPLE')
  const tree = await reducer([
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
    {
      name: 'test with stream',
      fn() {
        return new Readable({
          read() {
            this.push('data')
            this.push(null)
          },
        })
      },
    },
  ], {
    runTest,
  })
  console.log(tree)
})()
```
```jsx
{ test: 
   { name: 'test',
     context: [ [Object], [Function: Context] ],
     persistentContext: 'EXAMPLE',
     fn: [AsyncFunction: fn],
     started: 2019-05-02T14:37:01.235Z,
     finished: 2019-05-02T14:37:01.366Z,
     error: null,
     result: '[EXAMPLE] hello-world: ok',
     destroyResult: [ undefined, '129ms' ] },
  'test with stream': 
   { name: 'test with stream',
     fn: [Function: fn],
     started: 2019-05-02T14:37:01.382Z,
     finished: 2019-05-02T14:37:01.493Z,
     error: null,
     result: 'data',
     destroyResult: [] } }
```

[`import('stream').Writable`](https://github.com/artdecocode/catchment#catchment-class) __<a name="type-streamwritable">`stream.Writable`</a>__: An interface to the Catchment class. Has an additional `promise` property resolved on stream finish.

__<a name="type-_contexttestingruntestoptions">`_contextTesting.RunTestOptions`</a>__: Options for the `runTest` method.

|       Name        |                                                                                        Type                                                                                         |                                                                                                                       Description                                                                                                                       | Default |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| context           | <em>!Array&lt;*&gt;</em>                                                                                                                                                            | The contexts to evaluate.                                                                                                                                                                                                                               | -       |
| __fn*__           | <em>!Function</em>                                                                                                                                                                  | The function to execute.                                                                                                                                                                                                                                | -       |
| persistentContext | <em>!Array&lt;*&gt;</em>                                                                                                                                                            | Evaluated persistent contexts that will come before other contexts.                                                                                                                                                                                     | -       |
| timeout           | <em>?number</em>                                                                                                                                                                    | The timeout to run the test and evaluate/destroy contexts within.                                                                                                                                                                                       | `null`  |
| onCatchment       | <em>function(<a href="#type-streamwritable" title="An interface to the Catchment class. Has an additional `promise` property resolved on stream finish.">!stream.Writable</a>)</em> | The callback that will be called with the _Catchment_ stream if the test returned a stream. The stream's data will be collected into the catchment to create the result as a string. The callback can be used to emit errors on the _Catchment_ stream. | -       |

__<a name="type-_contexttestingruntestresult">`_contextTesting.RunTestResult`</a>__: The result of the runTest function.

|     Name      |      Type      |                         Description                          | Default |
| ------------- | -------------- | ------------------------------------------------------------ | ------- |
| __started*__  | <em>Date</em>  | The date when the test started.                              | -       |
| __finished*__ | <em>Date</em>  | The date when the test finished.                             | -       |
| error         | <em>Error</em> | The error which happened during the test.                    | `null`  |
| result        | <em>*</em>     | The result which the test returned.                          | `null`  |
| destroyResult | <em>*</em>     | The result which the destroy method on the context returned. | `null`  |


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Copyright


  (c) [Context Testing](https://contexttesting.com) 2019


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>