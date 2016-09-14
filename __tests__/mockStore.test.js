import { combineReducers } from 'redux';
import { describe } from 'ava-spec';
import sinon from 'sinon';
import spyMiddleware from './spies/middleware';
import create from '../src/modules/mockStore';
import thunk from 'redux-thunk';

const spy = sinon.spy();

describe('mockStore', it => {

  it.beforeEach(t => {
    // this runs before each test
    t.context.mockStore = create([]);
    t.context.mockStoreWithMiddleware = create([thunk, spyMiddleware(spy)]);
    //clear all the promises
  });

  it.afterEach(t => {
    // this runs after each test
    delete t.context.mockStore;
    delete t.context.mockStoreWithMiddleware;
  });

  it('accepts functions as state', t => {

    const stateFunc = sinon.spy();
    const store = t.context.mockStore(stateFunc);

    store.getState();
    t.true(stateFunc.called);

  });


  it('maps the current state', t => {

    const state = {
      foo: 'bar',
      items: [],
      howMany: 0,
      baz: ['super', 'morefoo'],
      hello: {
        'world': '!'
      }
    };
    const store = t.context.mockStore(state);

    t.deepEqual(store.getState(), state);

  });

  it('throws an error when the action is undefined', t => {

    const store = t.context.mockStore({});
    const err = t.throws(() => { store.dispatch(() => undefined), Error()});

    t.is(err.message,
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.');

  });

  it('throws an error when the action is not a plain object', t => {

    const store = t.context.mockStore({});
    const err = t.throws(() => { store.dispatch(() => {}), Error()});

    t.is(err.message,
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.');

  });

  it('throws an error when the action is null', t => {

    const store = t.context.mockStore({});
    const err = t.throws(() => { store.dispatch(null), Error()});

    t.is(err.message,
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.');

  });

  it('throws an error when the action has no type property', t => {

    const store = t.context.mockStore({});
    const err = t.throws(() => { store.dispatch({ foo: 'BAR' }), Error()});

    t.is(err.message,
      'Actions may not have an undefined "type" property.' +
      ' Have you misspelled a constant?');

  });

  it('throws an error when the action is asynchronous and no middleware was used', t => {

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
    const err = t.throws(() => {
      store.dispatch(asynchronousAction()),
      Error()});

    return t.is(err.message,
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.');

  });

  it('handles asynchronous actions when redux-thunk is used', t => {

    function superAction() {
      return {
        type: 'ACTION_UNIQUE'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStoreWithMiddleware({});
    //  the middleware messes the actions clear them :)
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.true(store.hasActions(superAction()));
      });

  });

  it('matches properly each middleware attached', t => {

    const store = t.context.mockStoreWithMiddleware({});

    store.dispatch({ type: 'SPY_CALLED'});
    t.deepEqual(store.getActions(), [{ type: 'SPY_CALLED'}]);
    t.true(spy.called);

  });

  it('dispatches multiple actions', t => {

    const store = t.context.mockStore({});

    store.dispatch({ type: 'FOO'});
    store.dispatch({ type: 'BAR'});
    t.deepEqual(store.getActions(), [{ type: 'FOO'},{ type: 'BAR'}]);

  });

  it('subscribes proper action callbacks', t => {

    const store = t.context.mockStore({});
    const cbSpy = sinon.spy();

    store.subscribe(cbSpy);
    store.dispatch({ type: 'FOO'});
    t.deepEqual(store.getActions(), [{ type: 'FOO'}]);
    t.true(cbSpy.called);

  });

  it('applies a single reducer handler on state', t => {

    function reducer(state, action){
      return action;
    }

    const actions = [{ type: 'ACTION1'}, { type: 'ACTION2', payload: 'foo'}];
    const store = t.context.mockStore({}, reducer);

    store.dispatch(actions[0]);
    t.deepEqual(store.getState(), actions[0]);
    t.deepEqual(store.getActions()[0], actions[0]);

    store.dispatch(actions[1]);
    t.deepEqual(store.getState(), actions[1]);
    t.deepEqual(store.getActions(), actions);

  });

  it('applies a multiple reducer handler on state', t => {

    function counter(state = 0, action) {
      switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1
      default:
        return state
      }
    }

    function todos(state = [], action) {
      switch (action.type) {
      case 'ADD_TODO':
        return state.concat([action.text]);
      default:
        return state
      }
    }

    const reducers = combineReducers({
      todos,
      counter
    });
    const store = t.context.mockStore({}, reducers);

    store.dispatch({
      type: 'ADD_TODO',
      text: 'Use Redux'
    });
    t.deepEqual(store.getState(), {counter: 0, todos: ['Use Redux']});

  });

});
