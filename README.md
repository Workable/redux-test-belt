# Redux Test Belt
[![build status](https://img.shields.io/travis/Workable/redux-test-belt/master.svg?style=flat-square)](https://travis-ci.org/Workable/redux-test-belt)
[![npm version](https://img.shields.io/npm/v/redux-test-belt.svg?style=flat-square)](https://www.npmjs.com/package/redux-test-belt)
[![npm version](https://img.shields.io/npm/dm/redux-test-belt.svg?style=flat-square)](https://www.npmjs.com/package/redux-test-belt)

Redux-test-belt is a JavaScript testing utility for Redux that makes it easier to assert, isolate, manipulate, and traverse your store's output.

Redux-test-belt's API is meant to be flexible by mimicking / extending Redux's store functionality. Furthermore, Redux-test-belt is unopinionated regarding which test runner, assertion library or how your application is constructed.


## Installation

To get started with Redux-test-belt, you can simply install it with NPM:

    npm install --save-dev redux-test-belt

Redux-test-belt is currently compatible with all versions of Redux.

## Table of Contents

* [Quickstart](#quickstart)
* [API](#api)
    * [initStore](#initstore)
    * [mockStore](#mockstore)
      * [Store utilities & helpers](#store-utilities--helpers)
      * [store.dispatch](#storedispatch)
      * [store.getState](#storegetstate)
      * [Actions utilities](#actions-utilities)
      * [Async utilities](#async-utilities)
      * [Blocking utilities](#blocking-utilities)
      * [Orphans utilities](#orphans-utilities)
    * [Middlewares](#mock)
      * [blockMiddleware](#blockmiddleware)
      * [actionsLoggerMiddleware](#actionsloggermiddleware)
      * [orphansMiddleware](#orphansmiddleware)
      * [promiseMiddleware](#promisemiddleware)
* [Examples](examples)
  * [Basic React example](examples/react-example)
  * [Async testing](examples/react-async-example)

## Quickstart

Redux-test-belt uses store enhanchers in order to improve the testing mechanisms.
Getting started is a simple as:

```js
  import initStore from 'redux-test-belt';

  const mockStore = initStore();
  const store = mockStore({});

  store.dispatch({type: 'START'});
  store.dispatch({type: 'START'});
  console.assert(store.getActions().length === 2, ">> Error")
```

Redux-test-belt takes seconds to setup against your testing suite.
The following example uses Ava as a test runner:

```js
import initStore from 'redux-test-belt';
import { describe } from 'ava-spec';
import thunk from 'redux-thunk';

describe('e2e test', it => {

  it.beforeEach(t => {
    // Before store's creation, we need to bootstrap redux-test-belt
    // Any additional middlewares may be passed along store's creation
    t.context.mockStoreWithMiddleware = initStore([thunk]);
  });

  it.afterEach(t => {
    delete t.context.mockStoreWithMiddleware;
  });

  it('dispatches increment action', t => {
    // setup
    const store = t.context.mockStoreWithMiddleware({});
    const action = { type: 'INCREMENT' };
    store.dispatch(action);
    t.deepEqual(store.getActions(), [action]);
  });

});
```

## API

## initStore
    initStore(middlewares?: Object) => mockStoreWrapper

#### Arguments
  1. `middlewares` (`Array of middlewares` [optional])

#### Description
`initStore()` is a single entry point bootstrapping Redux-test-belt's store. It accepts any additional middlewares that
may be required by each test. initStore exposes a single constructor function.

#### Example usage

```js
  // Usage without middlewares
  import initStore from '../src/modules/mockStore';

  const storeInit = initStore();
```

```js
  // Usage with middlewares
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import promise from 'redux-promise';

  const storeInit = initStore([thunk, promise]);
```

## mockStore
    mockStore(initialState = null : Object,
      reducers = (currentState, action) => currentState: Function ,
      blockCheck = (...args) => true : Function) => Store

#### Arguments
  1. `initialState` (`any` [optional]) The initial state of the store
  2. `reducers` (`Function` [optional]) A reducing function that returns the next state tree, given the current state tree and an action to handle.   [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) may be used in order to invoke multiple reducers.
  3. `blockCheck` (`Function` [optional]) . `blockCheck` is a predicate function used along with the `blockMiddleware`. It is primarily used in order to limit down the range of the actions invoked during our application's testing.

#### Description
`mockStore()` is an extended version of Redux's `[createStore()](http://redux.js.org/docs/api/createStore.html)`. Using store enhancers it adds additional testing utilities combining separated middlewares. This is mainly the heart of each testing unit.

#### Example usage

```js
  // use mockStore with initial state
  import initStore from 'redux-test-belt';
  import test from 'ava';
  test(t => {

    const storeInit = initStore();
    const store = t.context.mockStore({ state: 1, items:[] });

  });
```

```js
  // use mockStore with initial state and a reducer
  import initStore from 'redux-test-belt';
  import test from 'ava';
  test(t => {

    const storeInit = initStore();

    // reducer
    function reducer(state = [], action) {
      switch (action.type) {
      case 'ADD_TODO':
        return state.concat([action.payload]);
      default:
        return state;
      }
    };

    const store = t.context.mockStore({}, reducer);
  });
```

```js
  // use mockStore along with combineReducers
  import initStore from 'redux-test-belt';
  import { combineReducers } from 'redux';
  import test from 'ava';
  test(t => {

    const storeInit = initStore();

    // reducer
    function firstReducer(state = [], action) {
      switch (action.type) {
      case 'ADD_TODO':
        return state.concat([action.payload]);
      default:
        return state;
      }
    };

    function secondReducer(state = [], action) {
      switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state
      }
    };

    const reducers = combineReducers({
      firstReducer,
      secondReducer
    });

    const store = t.context.mockStore({}, reducers);
  });
```

```js
  // use mockStore with initial state, a reducer and a block checking predicate function
  import initStore from 'redux-test-belt';
  import test from 'ava';
  test(t => {

    const storeInit = initStore();

    // reducer
    function reducer(state = [], action) {
      switch (action.type) {
      case 'ADD_TODO':
        return state.concat([action.payload]);
      default:
        return state;
      }
    };

    function()

    const store = t.context.mockStore({}, reducer);
  });
```

## Store utilities & helpers
`mockStore()` returns a Redux store instance extended by several testing utilities. Most of the packed functionality is separated in isolated middlewares as well, providing a clean and powerful testing workflow.

## store.dispatch
    store.dispatch(action?: Object)

#### Arguments
  1. `action` (`Object`) A plain object describing the change that makes sense for your application. Actions are the only way to get data into the store. As a result, any kind of data indicating a store change, whether from UI events, network callbacks, or other sources such as WebSockets needs to eventually be dispatched as actions.

#### Description
  `dispatch()` is used to dispatch actions to the store. This is the only way to trigger a state change. The functionality provided from this method is identical to [Redux's dispatch()](http://redux.js.org/docs/api/Store.html#dispatch).

#### Example usage
  ```js
  // use mockStore with initial state
  import initStore from 'redux-test-belt';
  import test from 'ava';
  test(t => {

    const storeInit = initStore();
    const store = t.context.mockStore({});
    store.dispatch({ type: 'INCREMENT' });
  });
  ```


## store.getState
    store.getState() => state

#### Description
`getState()` returns the current state tree of your application.
It is equal to the last value returned by the store’s reducer. The functionality provided from this method is identical to [Redux's getState()](http://redux.js.org/docs/api/Store.html#getState).


## Actions utilities
#### Introduction
In most cases testing a Redux application includes testing against the state of the store. In the other side, unit test may require checking the actions dispatched. Redux-test-belt comes with a set of helper functions providing an ease applying assertions on the action chain.

## store.getActions
    store.getActions() => [Object]

#### Description
`store.getActions()` returns a list with all the actions dispatched against the store. Keep in mind, that the actions dispatched may be [asynchronous](http://redux.js.org/docs/advanced/AsyncActions.html), `store.getActions()` keeps track on the actions based on time on when the actions are fired through the action creators.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import test from 'ava';

  test(t => {

    const storeInit = initStore();
    const store = t.context.mockStore({});
    const actions = [
      { type: 'BAR' },
      { type: 'foo', payload: 'PAYLODED' }
    ];
    store.dispatch(actions[0]);
    store.dispatch(actions[1]);
    t.deepEqual(store.getActions(), actions);
  });
```

## store.hasActions
    store.hasActions(matcher? Object(s) || String(s) ) => Boolean

#### Arguments
  1. `matcher` (`Object(s) || String(s)`) Using matcher you may filter down the actions dispatched on the store. A matcher may be one or more action objects deeply matching the action queue or even just the action type(s).

#### Description
In large scale applications testing against the actions dispatched may be tedious. Matching a list of actions usually requires an assertion library, like [Chai](http://chaijs.com/) and lots of configuration. Redux-test-belt is packed with the `store.hasActions()` as utility helper.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import test from 'ava';

  test(t => {

    const storeInit = initStore();
    const store = t.context.mockStore({});
    store.dispatch({ type: 'ACTION_1' });
    store.dispatch({ type: 'ACTION_2', payload: 'PAYLODED' });
    store.dispatch({ type: 'ACTION_3' });

    // Τesting against a superset of action objects
    t.true(store.hasActions(
      { type: 'ACTION_1' },
      { type: 'ACTION_2', payload: 'PAYLODED' }));

    t.true(store.hasActions(
      { type: 'ACTION_3' },
      { type: 'ACTION_1' }));

  });
```

```js
  import initStore from 'redux-test-belt';
  import test from 'ava';

  test(t => {

    const storeInit = initStore();
    const store = t.context.mockStore({});
    store.dispatch({ type: 'ACTION_1' });
    store.dispatch({ type: 'ACTION_2', payload: 'PAYLODED' });
    store.dispatch({ type: 'ACTION_3' });

    // Τesting against a superset of action types
    t.true(store.hasActions('ACTION_1', 'ACTION_2'));
    t.true(store.hasActions('ACTION_3', 'ACTION_2'));

  });
```

## store.clearActions
    store.clearActions() => []

#### Description
To help a test suite DRY up any duplicated setup and teardown code, Redux-test-belt provides the `store.clearActions()` method. In particular, `store.clearActions()` clears up the actions recorded during the store's lifecycle. It may be used on global before & after hooks, in order to keep each test isolated and independent.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import test from 'ava';

  test(t => {

    const storeInit = initStore();
    const store = t.context.mockStore({});
    store.dispatch({ type: 'ACTION_1' });
    store.dispatch({ type: 'ACTION_2' });

    t.true(store.hasActions('ACTION1', 'ACTION2'));

    store.clearActions();
    t.deepEqual(store.getActions(), []);

  });
```

```js
  import initStore from 'redux-test-belt';
  import test from 'ava';

  test.beforeEach(t => {
    // Mock the store before each test
    t.context.storeInit = initStore();
    t.context.store = t.context.mockStore({});
  });

  test.afterEach(t => {
      // Clear all the actions after each test
      t.context.store.clearActions();
  });

  test(t => {

    t.context.dispatch({ type: 'ACTION_1' });
    t.context.dispatch({ type: 'ACTION_2' });

    t.true(t.context.hasActions('ACTION1', 'ACTION2'));

  });
```

## Async utilities

#### Introduction
Redux applications may use asynchronous action creators; testing asynchronous actions that will be processed by reducers synchronously it's hard to deal with, though. Redux-test-belt provides async helper methods in order to write serialized tests. Keep in mind that async action handling requires using a thunk middleware for Redux like [redux-thunk](https://github.com/gaearon/redux-thunk).

## store.getPromises
    store.getPromises() => [Object]

#### Description
`store.getPromises()` grabs all the actions dispatched on the store that are encapsulated as Promise objects.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test.serial(t => {

    function superAction() {
      return {
        type: 'ACTION_DISPATCHED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(superAction()));
      };
    }

    const storeInit = initStore([thunk]);
    const store = t.context.mockStore({});

    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPromises().length, 1);
      });

  });
```

## store.getPending
    store.getPending() => [Object]

#### Description
`store.getPending()` returns all the actions dispatched on the store that are encapsulated as Promises and their initial state is not fulfilled, nor rejected yet.


#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test(t => {

    function superAction() {
      return {
        type: 'ACTION_DISPATCHED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.all([
          dispatch(superAction())
        ])
      };
    }
    const storeInit = initStore([thunk]);
    const store = t.context.mockStore({});
    // the middleware messes the actions clear them :)
    store.dispatch(asynchronousAction())
    t.is(store.getPending().length, 1);
  });
```

## store.getRejected
    store.getRejected() => [Object]

#### Description
`store.getRejected()` returns all the actions dispatched on the store that are encapsulated as Promises and yet settled.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test.serial(t => {

    function superAction() {
      return {
        type: 'ACTION_DISPATCHED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.reject()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStore({});
    //  the middleware messes the actions clear them :)
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPending().length, 0);
        t.is(store.getRejected().length, 1);
        t.is(store.getPromises().length, 1);

      });
  });
```

## store.getResolved
    store.getResolved() => [Object]

#### Description
`store.getResolved()` returns all the actions dispatched on the store that are encapsulated as Promises and settled, or locked into a promise chain.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test.serial(t => {

    function superAction() {
      return {
        type: 'ACTION_DISPATCHED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStore({});
    //  the middleware messes the actions clear them :)
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPending().length, 0);
        t.is(store.getResolved().length, 1);
        t.is(store.getPromises().length, 1);

      });
  });
```

## store.clearPromises
    store.clearPromises() => []

#### Description
To help a test suite DRY up any duplicated setup and teardown code, Redux-test-belt provides the `store.clearPromises()` method. In particular, `store.clearPromises()` clears up the recorded actions that are encapsulated as Promise objects during store's lifecycle. It may used on global before & after hooks in order to keep each test isolated and independent .

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test.serial(t => {

    function superAction() {
      return {
        type: 'ACTION_DISPATCHED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStore({});
    //  the middleware messes the actions clear them :)
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getResolved().length, 1);
        t.is(store.getPromises().length, 1);

        store.clearPromises();

        t.is(store.getResolved().length, 0);
        t.is(store.getPromises().length, 0);

      });
  });
```

## Blocking utilities

#### Introduction
In complex applications where lots of actions take place testing might be bloated. Redux-test-belt provides a set of utilities which enable users to filter the actions dispatched, clean up any redundant actions as well as to prevent state's manipulation. Each blocked action is stored for later use and may be accessed on demand later. All the blocked actions are actually dispatched on the store in order to keep Redux in place, the action type is marked as `✋BLOCKED_ACTION`  whilst the payload holds the very first action created.

#### Setup
As it was mentioned earlier, you may pass a predicate function as a parameter during [mockStore](#mockstore)'s instantiation. Blocking prediction may take place, either or the state or the action that takes place.

```js
  import initStore from 'redux-test-belt';
  const mockStore = initStore([]);

  const reducer = (currentState, action) => currentState;
  const blockCheck = (currentState, action) => {
    return (action.type === 'BLOCKED') ? false : true;
  }
  const store = mockStore({},reducer, blockCheck);
  store.dispatch({ type: 'BLOCKED' });
  store.dispatch({ type: 'NON-BLOCKED' });
```

## store.getBlocked
    store.getBlocked() => [actions]

#### Description
`store.getBlocked()` returns all the blocked actions filtered from the passed predicate function.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test.serial(t => {
    const mockStore = initStore([]);

    const reducer = (currentState, action) => currentState;
    const blockCheck = (currentState, action) => {
      return (action.type === 'BLOCKED') ? false : true;
    }
    const store = mockStore({},reducer, blockCheck);
    store.dispatch({ type: 'BLOCKED' });
    store.dispatch({ type: 'NON-BLOCKED' });
    t.deepEqual(store.getBlocked(),[{ type: 'BLOCKED' }]);
  });
```


## store.clearBlocked
    store.clearBlocked() => []

#### Description
`store.clearBlocked()` clears all the blocked actions stored.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test(t => {
    const mockStore = initStore([]);

    const reducer = (currentState, action) => currentState;
    const blockCheck = (currentState, action) => false;
    const store = mockStore({},reducer, blockCheck);

    store.dispatch({ type: 'BLOCKED' });
    t.deepEqual(store.getBlocked(),[{ type: 'BLOCKED' }]);
    store.clearBlocked();
    t.deepEqual(store.getBlocked(),[]);
  });
```

## store.hasBlocked
    store.hasBlocked(matcher? Object(s) || String(s) ) => Boolean

#### Arguments
  1. `matcher` (`Object(s) || String(s)`) Using matcher you may filter down the repository of blocked actions which is being retained inside the store's instance. A matcher may be one or more action objects deeply matching the blocked action queue or even just the action type(s).

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test(t => {
    const mockStore = initStore([]);

    const reducer = (currentState, action) => currentState;
    const blockCheck = (currentState, action) => false;
    const store = mockStore({},reducer, blockCheck);

    store.dispatch({ type: 'ACTION1' });
    store.dispatch({ type: 'ACTION2', payload: 'PAYLODED' });
    t.true(store.hasBlocked('ACTION1', 'ACTION2'));

    store.dispatch({ type: 'ACTION3' });
    t.true(store.hasBlocked('ACTION1', 'ACTION2', 'ACTION3'));
    t.false(store.hasBlocked('whatever', 'ACTION1'));
  });
```


## Orphans utilities

#### Introduction
Redux-test-belt declares orphans as actions that don't differentiate or manipulate the actual state. Where lots of action are dispatched simultaneously this feature allows testing to narrow down the results, take action on dead code and improve debugging.

## store.getOrphans
    store.getOrphans() => [Object]

#### Description
`store.getOrphans()` returns a list of actions that didn't change the state upon dispatching.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test(t => {

    function fakeDispather() {
      return {
        type: 'ADD_TODO'
      }
    }
    const mockStore = initStore([]);
    const store = mockStore({});

    store.dispatch(fakeDispather());
    store.dispatch(fakeDispather());

    t.is(store.getOrphans().length, 2);
    t.deepEqual(
      store.getOrphans(),
      [{ type: 'ADD_TODO' }, { type: 'ADD_TODO' }]);
  });
```

## store.hasOrphans
    store.hasActions(matcher? Object(s) || String(s) ) => Boolean

#### Arguments
  1. `matcher` (`Object(s) || String(s)`) Using matcher you may filter down the orphans' repository. A matcher may be one or more action objects deeply matching the action queue or even just the action type(s).

  #### Example usage

  ```js
    import initStore from 'redux-test-belt';
    import thunk from 'redux-thunk';
    import test from 'ava';
    test(t => {

      function fakeDispather() {
        return {
          type: 'ADD_TODO'
        }
      }
      const mockStore = initStore([]);
      const store = mockStore({});

      store.dispatch(fakeDispather());
      store.dispatch(fakeDispather());
      t.is(store.hasOrphans('ADD_TODO'), true);
      t.is(store.hasOrphans({type: 'ADD_TODO' }), true);
    });
  ```

## store.clearOrphans
    store.clearOrphans() => []

#### Description
`store.clearOrphans()` truncates the list of orphan actions.

#### Example usage

```js
  import initStore from 'redux-test-belt';
  import thunk from 'redux-thunk';
  import test from 'ava';
  test(t => {

    function fakeDispather() {
      return {
        type: 'ADD_TODO'
      }
    }
    const mockStore = initStore([]);
    const store = mockStore({});

    store.dispatch(fakeDispather());
    store.dispatch(fakeDispather());

    t.is(store.getOrphans().length, 2);
    t.deepEqual(
      store.getOrphans(),
      [{ type: 'ADD_TODO' },{ type: 'ADD_TODO' }]);
    store.clearOrphans();
    t.is(store.getOrphans().length, 0);
  });
```

## Middlewares

#### Introduction
Where default [createStore()](http://redux.js.org/docs/api/createStore.html) is used, it seems a bit redundant to write additional tests using Redux-test-belt's `mockStore()`. Therefore, Redux-test-belt exports each module as a flexible [middleware](http://redux.js.org/docs/advanced/Middleware.html).


## blockMiddleware

#### Associated methods
  * [store.getBlocked](#storegetblocked)
  * [store.hasBlocked](#storehasblocked)
  * [store.clearBlocked](#storeclearblocked)

#### Example usage

```js
  import { createStore } from 'redux';
  import { blockMiddleware, blockedActions, PREFIX_ACTION } from 'redux-test-belt';

  const blocking = (currentState, action) => false;

  function reducer(state = [], action) {
    switch (action.type) {
      case 'ADD_TODO':
        return state.concat([ action.payload ])
      default:
        return state
    }
  }

  let store = createStore(reducer,
      [ 'Use Redux' ],
      applyMiddleware.apply(null, [blockMiddleware(blocking)])
  );

  store.dispatch({
    type: 'ACTION',
    text: 'Read the docs'
  });

  // Expose each method
  console.log(blockedActions.getBlocked());
  //Alias: blockedActions.get()

  console.log(blockedActions.hasBlocked('ACTION'));
  //Alias: blockedActions.has()

  blockedActions.clearBlocked();

  console.log(blockedActions.getBlocked());
  console.log(PREFIX_ACTION);
```

## actionsLoggerMiddleware

#### Associated methods
  * [store.getActions](#storegetactions)
  * [store.hasActions](#storehasactions)
  * [store.clearActions](#storeclearactions)

#### Example usage

```js
  import { createStore } from 'redux';
  import { loggedActions, actionsLoggerMiddleware } from 'redux-test-belt';

  function reducer(state = [], action) {
    switch (action.type) {
      case 'ADD_TODO':
        return state.concat([ action.payload ])
      default:
        return state
    }
  }

  let store = createStore(reducer,
      [ 'Use Redux' ],
      applyMiddleware.apply(null, [actionsLoggerMiddleware])
  );

  store.dispatch({
    type: 'ACTION',
    text: 'Read the docs'
  });

  // Expose each method
  console.log(loggedActions.getActions());
  // Alias: loggedActions.get()

  console.log(loggedActions.hasActions('ACTION'));
  // loggedActions.has()

  loggedActions.clearActions();
  console.log(loggedActions.getActions());
```

## orphansMiddleware

#### Associated methods
  * [store.getOrphans](#storegetorphans)
  * [store.hasOrphans](#storehasorphans)
  * [store.clearOrphans](#storeclearorphans)

#### Example usage

```js
  import { createStore } from 'redux';
  import { orphansMiddleware, orphans } from 'redux-test-belt';

  function reducer(state = [], action) {
    switch (action.type) {
      case 'ADD_TODO':
        return state.concat([ action.payload ])
      default:
        return state
    }
  }

  let store = createStore(reducer,
      [ 'Use Redux' ],
      applyMiddleware.apply(null, [orphansMiddleware])
  );

  store.dispatch({
    type: 'ACTION',
    text: 'Read the docs'
  });

  // Expose each method
  console.log(orphans.getOrphans());
  //Alias: orphans.get()

  console.log(orphans.hasOrphans('ACTION'));
  //Alias: orphans.has()

  orphans.clearOrphans();
  console.log(orphans.getOrphans());
```

## promiseMiddleware

#### Associated methods
  * [store.getPromises](#storegetpromises)
  * [store.getPending](#storegetpending)
  * [store.getRejected](#storegetrejected)
  * [store.getResolved](#storegetresolved)
  * [store.getPromises](#storeclearpromises)

#### Example usage

```js
  import { createStore } from 'redux';
  import { promiseMiddleware, promises } from 'redux-test-belt';

  function reducer(state = [], action) {
    switch (action.type) {
      case 'ADD_TODO':
        return state.concat([ action.payload ])
      default:
        return state
    }
  }

  function superAction() {
    return {
      type: 'ACTION_DISPATCHED'
    };
  }

  function asynchronousAction() {
    return dispatch => {
      return Promise.resolve()
        .then(() => dispatch(superAction()));
    };
  }

  let store = createStore(reducer,
      [ 'Use Redux' ],
      applyMiddleware.apply(null, [promiseMiddleware])
  );

  store.dispatch(asynchronousAction());

  // Expose each method
  console.log(promises.getPromises());
  // Alias: promises.get();
  console.log(promises.getPending());
  console.log(promises.getRejected());
  console.log(promises.getResolved());

  promises.clear();
  // Alias: promises.clearPromises();

  console.log(promises.getPromises());
```
