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

  it('maps the actions dispatched', t => {

    const store = t.context.mockStore({});
    const actions = [{ type: 'BAR' }, {type: 'foo', payload: 'baz'}];

    store.dispatch(actions[0]);
    t.deepEqual(store.getActions(), [actions[0]]);
    store.dispatch(actions[1]);
    t.deepEqual(store.getActions(), actions);

  });

  it('clears the actions', t => {

    const store = t.context.mockStore({});

    store.dispatch({ type: 'FOO'});
    t.deepEqual(store.getActions(), [{ type: 'FOO'}]);
    store.clearActions();
    t.deepEqual(store.getActions(), []);

  });

  it('provides hasActions() which handles objects', t => {

    const store = t.context.mockStore({});

    store.dispatch({ type: 'ACTION1'});
    store.dispatch({ type: 'ACTION2', payload: 'PAYLODED'});
    t.true(store.hasActions({ type: 'ACTION1'}));
    t.true(store.hasActions({ type: 'ACTION2', payload: 'PAYLODED'}));
    t.true(store.hasActions(
      { type: 'ACTION1'},
      { type: 'ACTION2', payload: 'PAYLODED'}));
    t.false(store.hasActions({ type: 'ACTION4', payload: 'PAYLODED'}));

  });

  it('provides hasActions() which handles objects without order in mind', t => {

    const store = t.context.mockStore({});
    store.dispatch({ type: 'ACTION1'});
    store.dispatch({ type: 'ACTION2', payload: 'PAYLODED'});
    store.dispatch({ type: 'ACTION3'});
    store.dispatch({ type: 'ACTION4'});

    t.true(store.hasActions(
      { type: 'ACTION1'},
      { type: 'ACTION2', payload: 'PAYLODED'}));
    t.true(store.hasActions(
      { type: 'ACTION2'},
      { type: 'ACTION1'}));
    t.true(store.hasActions(
      { type: 'ACTION3'},
      { type: 'ACTION1'}));
    t.true(store.hasActions(
      { type: 'ACTION4'},
      { type: 'ACTION2'}));

  });

  it('provides hasActions() which handles action types only', t => {

    const store = t.context.mockStore({});

    store.dispatch({ type: 'ACTION1'});
    store.dispatch({ type: 'ACTION2', payload: 'PAYLODED'});
    t.true(store.hasActions('ACTION1','ACTION2'));

    store.dispatch({ type: 'ACTION3'});
    t.true(store.hasActions('ACTION1','ACTION2','ACTION3'));
    t.false(store.hasActions('whatever', 'ACTION1'));

  });

});
