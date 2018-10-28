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
- [`reducer(tests: Test[], config?: Config)`](#reducertests-testconfig-config-void)
  * [`TestSuiteConfig`](#type-testsuiteconfig)
  * [`Config`](#type-config)
  * [`Test`](#type-test)
- [`runTest(config: RunTest)`](#runtestconfig-runtest-void)
  * [`RunTest`](#type-runtest)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>



## API

The package is available by importing its default reducer and the `runTest` function:

```js
import reducer, { runTest } from '@zoroaster/reducer'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>



## The Types

These are the common types used in this package.

__<a name="type-context">`Context`</a>__: A context made with a constructor.

|   Name   |      Type       |              Description              |
| -------- | --------------- | ------------------------------------- |
| _init    | _() =&gt; void_ | A function to initialise the context. |
| _destroy | _() =&gt; void_ | A function to destroy the context.    |

`{new(...args: any[]): Context}` __<a name="type-contextconstructor">`ContextConstructor`</a>__: A function or class or object that makes a context

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `reducer(`<br/>&nbsp;&nbsp;`tests: Test[],`<br/>&nbsp;&nbsp;`config?: Config,`<br/>`): void`

Runs the tests in the array if necessary and returns a new array.

__<a name="type-testsuiteconfig">`TestSuiteConfig`</a>__

|       Name       |   Type    |         Description         |
| ---------------- | --------- | --------------------------- |
| __name*__        | _string_  | The name of the test suite. |
| __tests*__       | _Test[]_  | Tests.                      |
| __onlyFocused*__ | _boolean_ | Run only focused tests.     |

__<a name="type-config">`Config`</a>__: Options for the reducer.

|       Name        |                        Type                         |                                             Description                                              | Default |
| ----------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| onlyFocused       | _boolean_                                           | Run only focused tests.                                                                              | `false` |
| __runTest*__      | _(test: Test) =&gt; Promise.&lt;*>_                 | The function used to run a test. It will receive `name`, `context`, `fn`, and `timeout` properties.  | -       |
| __runTestSuite*__ | _(testSuite: TestSuiteConfig) =&gt; Promise.&lt;*>_ | The function used to run a test suite. It will receive `name`, `tests` and `onlyFocused` properties. | -       |
__<a name="type-test">`Test`</a>__: The test type as used by the reducer.

|     Name      |          Type          |                          Description                          | Default |
| ------------- | ---------------------- | ------------------------------------------------------------- | ------- |
| context       | _ContextConstructor[]_ | Any context constructors for the test to be evaluated.        | -       |
| timeout       | _number_               | The timeout for the test, context evaluation and destruction. | `null`  |
| __name*__     | _number_               | The name of the test.                                         | -       |
| isFocused     | _boolean_              | If the test is focused.                                       | `false` |
| isTest        | _boolean_              | If it is a test and not a test suite.                         | `true`  |
| isSelfFocused | _boolean_              | The property of the test suite such that it is focused.       | -       |
| hasFocused    | _boolean_              | Whether the test suite has focused tests.                     | -       |
| __fn*__       | _function_             | The test function to run.                                     | -       |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## `runTest(`<br/>&nbsp;&nbsp;`config: RunTest,`<br/>`): void`

Asynchronously runs the test within a time-out limit. Evaluates the contexts beforehand and destroys them after.

__<a name="type-runtest">`RunTest`</a>__: Options for the runTest function.

|  Name   |          Type          |                          Description                          | Default |
| ------- | ---------------------- | ------------------------------------------------------------- | ------- |
| context | _ContextConstructor[]_ | Any context constructors for the test to be evaluated.        | -       |
| timeout | _number_               | The timeout for the test, context evaluation and destruction. | `null`  |
| __fn*__ | _function_             | The test function to run.                                     | -       |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

(c) [Context Testing][1] 2018

[1]: https://contexttesting.com

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>