# @zoroaster/reducer

[![npm version](https://badge.fury.io/js/%40zoroaster%2Freducer.svg)](https://npmjs.org/package/@zoroaster/reducer)

`@zoroaster/reducer` is the test suite reducer to run each test and see whether it passes or fails.

```sh
yarn add -E @zoroaster/reducer
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [The Types](#the-types)
  * [`Context`](#type-context)
  * [`ContextConstructor`](#type-contextconstructor)
- [`async reducer(tests: TestOrTestSuite[], config?: Config): TestSuiteLite`](#async-reducertests-testortestsuiteconfig-config-testsuitelite)
  * [`TestOrTestSuite`](#type-testortestsuite)
  * [`Config`](#type-config)
  * [`TestSuiteLite`](#type-testsuitelite)
- [`async runTest(test: TestLite): RunTestResult`](#async-runtesttest-testlite-runtestresult)
  * [`RunTestResult`](#type-runtestresult)
  * [`Test`](#type-test)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>



## API

The package is available by importing its default reducer and the `runTest` function:

```js
import reducer, { runTest } from '@zoroaster/reducer'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## The Types

These are the common types used in this package. They are available in the [`@zoroaster/types`](https://github.com/contexttesting/types) package.

__<a name="type-context">`Context`</a>__: A context made with a constructor.

|   Name   |      Type       |              Description              |
| -------- | --------------- | ------------------------------------- |
| _init    | _() =&gt; void_ | A function to initialise the context. |
| _destroy | _() =&gt; void_ | A function to destroy the context.    |

`{new(...args: any[]): Context}` __<a name="type-contextconstructor">`ContextConstructor`</a>__: A function or class or object that makes a context

The types can also be imported in the JS file:

```js
/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */
```

Tests have a raw `context` property which is a context constructor. It should return an object or an instance that can store a state. It is then passed by the reducer to the `runTest` method which evaluates it. The package can evaluate the context of the class, function and object types. Tests receive evaluated context to access the testing API and the state.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `async reducer(`<br/>&nbsp;&nbsp;`tests: TestOrTestSuite[],`<br/>&nbsp;&nbsp;`config?: Config,`<br/>`): TestSuiteLite`

Runs tests and test suites in the array with the `runTest` and `runTestSuite` methods and returns an object representing the tree structure in which tests were run. The `runTest` method can be imported from this library, and the `runTestSuite` can be implemented as a recursive reducer. Whether an object is a test is determined by the presence of the `fn` property.

__<a name="type-testortestsuite">`TestOrTestSuite`</a>__: The test or test suite (determined by the presence of the `fn` property).

|    Name    |          Type          |                          Description                          | Default |
| ---------- | ---------------------- | ------------------------------------------------------------- | ------- |
| __name*__  | _string_               | The name of the test or a test suite.                         | -       |
| fn         | _function_             | The test function to run.                                     | -       |
| context    | _ContextConstructor[]_ | Any context constructors for the test to be evaluated.        | -       |
| timeout    | _number_               | The timeout for the test, context evaluation and destruction. | `null`  |
| isFocused  | _boolean_              | If the test or test suite is focused.                         | `false` |
| hasFocused | _boolean_              | Whether the test suite has focused tests.                     | -       |

__<a name="type-config">`Config`</a>__: Options for the reducer.

|       Name        |                                                Type                                                 |              Description               | Default |
| ----------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- | ------- |
| onlyFocused       | _boolean_                                                                                           | Run only focused tests.                | `false` |
| __runTest*__      | _(test: { fn: function }) =&gt; Promise.&lt;*>_                                                     | The function used to run a test.       | -       |
| __runTestSuite*__ | _(testSuite: Object, onlyFocused: boolean) =&gt; Promise.&lt;[TestSuiteLite](#type-testsuitelite)>_ | The function used to run a test suite. | -       |

`Object.<string, Test|Object.<string, Test|Object.<string, Test>>>` __<a name="type-testsuitelite">`TestSuiteLite`</a>__: An recursive tree returned by the reducer containing nested test suites with tests updated with the outcome of the `runTest` method (therefore, the reducer is not pure since the passed tests are mutated).

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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>



## `async runTest(`<br/>&nbsp;&nbsp;`test: TestLite,`<br/>`): RunTestResult`

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after (using the same test time-out). Returns the `started`, `finished`, `error`, `result` and `destroyResult` properties.

__<a name="type-runtestresult">`RunTestResult`</a>__: The result of the runTest function.

|     Name      |  Type   |                         Description                          | Default |
| ------------- | ------- | ------------------------------------------------------------ | ------- |
| __started*__  | _Date_  | The date when the test started.                              | -       |
| __finished*__ | _Date_  | The date when the test finished.                             | -       |
| error         | _Error_ | The error which happened during the test.                    | `null`  |
| result        | _*_     | The result which the test returned.                          | `null`  |
| destroyResult | _*_     | The result which the destroy method on the context returned. | `null`  |

__<a name="type-test">`Test`</a>__: The test structure used in `runTest`.

|  Name   |          Type          |                          Description                          | Default |
| ------- | ---------------------- | ------------------------------------------------------------- | ------- |
| __fn*__ | _function_             | The test function to run.                                     | -       |
| context | _ContextConstructor[]_ | Any context constructors for the test to be evaluated.        | -       |
| timeout | _number_               | The timeout for the test, context evaluation and destruction. | `null`  |

```js
import reducer, { runTest } from '@zoroaster/run-test'

(async () => {
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
      async fn({ TEST }, { data }) {
        await new Promise(r => setTimeout(r, 100))
        return `${TEST}-${data}: ok`
      },
    },
  ], {
    runTest,
  })
  console.log(test)
})()
```
```js
{ name: 'test',
  context: [ { TEST: 'hello' }, [Function: Context] ],
  fn: [AsyncFunction: fn],
  started: 2018-10-28T12:55:14.504Z,
  finished: 2018-10-28T12:55:14.614Z,
  error: null,
  result: 'hello-world: ok',
  destroyResult: [ undefined, '108ms' ] }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

(c) [Context Testing][1] 2018

[1]: https://contexttesting.com

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>