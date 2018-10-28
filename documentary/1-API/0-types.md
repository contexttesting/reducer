## The Types

These are the common types used in this package. They are available in the [`@zoroaster/types`](https://github.com/contexttesting/types) package.

%TYPEDEF node_modules/@zoroaster/types/types/context.xml%

%TYPEDEF types/test.xml%

The types can also be imported in the JS file:

```js
/**
 * @typedef {import('@zoroaster/types').Context} Context
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */
```

Tests have a raw `context` property which is a context constructor. It should return an object or an instance that can store a state. It is then passed by the reducer to the `runTest` method which evaluates it. The package can evaluate the context of the class, function and object types. Tests receive evaluated context to access the testing API and the state.

%~%