import { describe } from 'ava-spec';
import create from '../src/modules/mockStore';
import { PREFIX_ACTION } from '../src/middlewares/blockMiddleware';

describe('blockMiddleware', it => {

  it.beforeEach(t => {
    // this runs before each test
    t.context.mockStore = create([]);
    //clear all the promises
  });

  it.afterEach(t => {
    // this runs after each test
    delete t.context.mockStore;
  });

  it('blocks no actions when no source of truth is passed along', t => {

    const store = t.context.mockStore({});
    store.dispatch({type : 'INC'});
    t.deepEqual(store.getBlocked(),[]);

  });

  it('blocks the appropriate actions when source of truth is passed along', t => {

    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => false;
    const store = t.context.mockStore({},reducer,block);

    store.dispatch({type : 'BLOCKED'});
    t.deepEqual(store.getBlocked(),[{ type: 'BLOCKED'}]);

  });

  it('blocks only the action matched by the predicate function', t => {

    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => {
      return (action.type === 'BLOCKED') ? false : true;
    }
    const store = t.context.mockStore({},reducer,block);

    store.dispatch({type : 'BLOCKED'});
    store.dispatch({type : 'NON-BLOCKED'});
    t.deepEqual(store.getBlocked(),[{ type: 'BLOCKED'}]);

  });


  it('grabs all the blocked actions', t => {

    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => false;
    const store = t.context.mockStore({},reducer,block);

    store.dispatch({type : 'BLOCKED'});
    store.dispatch({type : 'BLOCKED_TOO'});
    t.deepEqual(store.getBlocked(),[
      { type: 'BLOCKED'},
      {type : 'BLOCKED_TOO'}]);

  });


  it('clears all the blocked actions', t => {

    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => false;
    const store = t.context.mockStore({},reducer,block);

    store.dispatch({type : 'BLOCKED'});
    t.deepEqual(store.getBlocked(),[{ type: 'BLOCKED'}]);
    store.clearBlocked();
    t.deepEqual(store.getBlocked(),[]);

  });

  it('marks any blocked action with an appropriate prefix', t => {

    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => false;
    const store = t.context.mockStore({},reducer,block);
    const ACTION_TYPE = 'INCREMENT';

    store.dispatch({ type: ACTION_TYPE});
    t.deepEqual(store.getActions(),
      [{ type: PREFIX_ACTION, payload:{ type: ACTION_TYPE}}]);

  });

  it('provides hasBlocked() which matches action types by name', t => {

    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => false;
    const store = t.context.mockStore({},reducer,block);

    store.dispatch({ type: 'ACTION1'});
    store.dispatch({ type: 'ACTION2', payload: 'PAYLODED'});
    t.true(store.hasBlocked('ACTION1','ACTION2'));

    store.dispatch({ type: 'ACTION3'});
    t.true(store.hasBlocked('ACTION1','ACTION2','ACTION3'));
    t.false(store.hasBlocked('whatever', 'ACTION1'));

  });

  it('provides hasBlocked() which matches actions as objects', t => {
    const reducer = (currentState, action) => currentState;
    const block = (currentState, action) => false;
    const store = t.context.mockStore({},reducer,block);

    store.dispatch({ type: 'ACTION1'});
    store.dispatch({ type: 'ACTION2', payload: 'PAYLODED'});
    t.true(store.hasBlocked({ type: 'ACTION1'}, { type: 'ACTION2', payload: 'PAYLODED'}));

    store.dispatch({ type: 'ACTION3'});
    t.true(store.hasBlocked({ type: 'ACTION1'}, { type: 'ACTION2', payload: 'PAYLODED'},{ type: 'ACTION3'}));
    t.false(store.hasBlocked('whatever', 'ACTION1'));
  });

});
