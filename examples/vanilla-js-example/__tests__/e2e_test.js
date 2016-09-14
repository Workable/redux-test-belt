import test from 'ava';
import create from '../../../src/modules/mockStore';
import reducer from '../reducers';

test.beforeEach(t => {
  t.context.pseudoStore = create([]);
});

test.afterEach(t => {
  delete t.context.pseudoStore;
});

test('dispatch INCREMENT state', t => {
  const store = t.context.pseudoStore(0, reducer);

  store.dispatch({type : 'INCREMENT'});
  t.is(store.getState(),1);

  store.dispatch({type : 'INCREMENT'});
  t.is(store.getState(),2);
});

test('dispatch DECREMENT state', t => {
  const store = t.context.pseudoStore(0, reducer);

  store.dispatch({type : 'DECREMENT'});
  t.is(store.getState(),-1);

  store.dispatch({type : 'DECREMENT'});
  t.is(store.getState(),-2);
});


test('dispatch INCREMENT actions', t => {
  const store = t.context.pseudoStore(0, reducer);

  store.dispatch({type : 'INCREMENT'});
  t.deepEqual(store.getActions(),[{ type: 'INCREMENT'}]);

});

test('dispatch DECREMENT actions', t => {
  const store = t.context.pseudoStore(0, reducer);

  store.dispatch({type : 'DECREMENT'});
  t.deepEqual(store.getActions(),[{ type: 'DECREMENT'}]);

});
