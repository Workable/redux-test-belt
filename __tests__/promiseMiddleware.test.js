import { describe } from 'ava-spec';
import create from '../src/modules/mockStore';
import thunk from 'redux-thunk';

describe('promiseMiddleware', it => {
  it.beforeEach(t => {
    // this runs before each test
    t.context.mockStore = create([thunk]);
    //clear all the promises
  });

  it.afterEach(t => {
    // this runs after each test
    delete t.context.mockStore;
  });

  it.serial('stores the all the asynchronous actions', t => {

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
        t.is(store.getPromises().length, 1);
      });

  });


  it.serial('stores all the pending asynchronous actions', t => {

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

    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPending().length,0);
        t.is(store.getPromises().length,1);
      });

  });

  it.serial('stores all the resolved asynchronous actions', t => {

    function superAction() {
      return {
        type: 'ACTION_RESOLVED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStore({});
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPending().length,0);
        t.is(store.getResolved().length,1);
        t.is(store.getPromises().length,1);
      });

  });

  it.serial('clears all the asynchronous actions', t => {

    function superAction() {
      return {
        type: 'ACTION_RESOLVED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStore({});
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPending().length,0);
        t.is(store.getResolved().length,1);
        t.is(store.getPromises().length,1);

        store.clearPromises();

        t.is(store.getPending().length,0);
        t.is(store.getResolved().length,0);
        t.is(store.getPromises().length,0);

      });

  });

  it.serial('stores all the rejected asynchronous actions', t => {

    function superAction() {
      return {
        type: 'ACTION_RESOLVED'
      };
    }

    function asynchronousAction() {
      return dispatch => {
        return Promise.reject()
          .then(() => dispatch(superAction()));
      };
    }

    const store = t.context.mockStore({});
    return store.dispatch(asynchronousAction())
      .then(() => {
        t.is(store.getPending().length,0);

        t.is(store.getPromises().length,1);
      }, () => {
        t.is(store.getRejected().length,1);
      });

  });

});
