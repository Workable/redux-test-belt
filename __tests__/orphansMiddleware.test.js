import { describe } from 'ava-spec';
import create from '../src/modules/mockStore';
import thunk from 'redux-thunk';

describe('orphansMiddleware', it => {
  it.beforeEach(t => {
    // this runs before each test
    t.context.mockStore = create([thunk]);
    //clear all the promises
  });

  it.afterEach(t => {
    // this runs after each test
    delete t.context.mockStore;
  });

  it('grabs all the orphan actions when no proper actions dispatched', t => {

    const store = t.context.mockStore({});

    store.dispatch({ type: 'ACTION1'});
    store.dispatch({ type: 'ACTION2'});
    t.deepEqual(store.getOrphans(), [{ type: 'ACTION1'}, { type: 'ACTION2'}]);

  });


  it('grabs only the applicable orphan actions', t => {

    function fakeDispather() {
      return {
        type: 'ADD_TODO'
      }
    }

    const store = t.context.mockStore({});

    store.dispatch(fakeDispather());
    store.dispatch(fakeDispather());

    t.is(store.getOrphans().length, 2);
    t.deepEqual(
      store.getOrphans(),
      [{ type: 'ADD_TODO' },{ type: 'ADD_TODO' }]);

  });

  it('provides hasOrphans() utility which matches objects', t => {

    function fakeDispather() {
      return {
        type: 'ADD_TODO'
      }
    }

    const store = t.context.mockStore({});

    store.dispatch(fakeDispather());
    store.dispatch(fakeDispather());
    t.is(store.hasOrphans({type: 'ADD_TODO'}), true);

  });

  it('provides hasOrphans() utility which matches action types ', t => {

    function fakeDispather() {
      return {
        type: 'ADD_TODO'
      }
    }

    const store = t.context.mockStore({});

    store.dispatch(fakeDispather());
    store.dispatch(fakeDispather());
    t.is(store.hasOrphans('ADD_TODO'), true);

  });

  it('clears the orphan actions', t => {

    function fakeDispather() {
      return {
        type: 'ADD_TODO'
      }
    }

    const store = t.context.mockStore({});

    store.dispatch(fakeDispather());
    store.dispatch(fakeDispather());

    t.is(store.getOrphans().length, 2);
    t.deepEqual(
      store.getOrphans(),
      [{ type: 'ADD_TODO' },{ type: 'ADD_TODO' }]);
    store.clearOrphans();
    t.is(store.getOrphans().length, 0);

  });

});
