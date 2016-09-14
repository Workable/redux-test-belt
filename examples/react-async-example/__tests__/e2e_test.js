import React from 'react';
import ReactDOM, { render } from 'react-dom';
import test from 'ava';
import { mount } from 'enzyme';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import create from '../../../src/modules/mockStore';
import Counter from '../components/container';

import jsdom from 'jsdom';
const doc = jsdom.jsdom('<!doctype html><html><body><div id="root"></div></body></html>');

global.document = doc;
global.window = doc.defaultView;

test.beforeEach(t => {
  t.context.pseudoStore = create([thunk]);

  t.context.wrapper && t.context.wrapper.unmount();
  t.context.render = function () {
    t.context.store = t.context.pseudoStore(0, reducer);
    t.context.wrapper && t.context.wrapper.detach();

    t.context.wrapper = mount(
      <Provider store = {t.context.store}>
        <Counter />
      </Provider>
    );
  };
});

test.afterEach(t => {
  delete t.context.pseudoStore;
  delete t.context.wrapper;
});

test('render a React component', t => {
  t.context.render();

  const components = t.context.wrapper.find(Counter);
  t.is(components.length, 1);
});

test('create a mock store', t => {
  t.context.render();

  t.not(t.context.store, undefined);
  t.is(t.context.store.getState(), 0);
  t.is(t.context.store.getActions().length, 0);
});

test('dispatch INCREMENT action', t => {
  t.context.render();
  t.context.wrapper.find(Counter).first().find('button').first().simulate('click');

  t.is(t.context.store.getActions().length, 1);
  t.deepEqual(t.context.store.getActions(),[{ type: 'INCREMENT'}]);
});

test('dispatch DECREMENT action', t => {
  t.context.render();
  t.context.wrapper.find(Counter).first().find('button').at(1).simulate('click');

  t.is(t.context.store.getActions().length, 1);
  t.deepEqual(t.context.store.getActions(),[{ type: 'DECREMENT'}]);
});

test('increment state with dispatched action', t => {
  t.context.render();
  t.deepEqual(t.context.store.getState(), 0);
  t.context.wrapper.find(Counter).first().find('button').first().simulate('click');

  t.is(t.context.store.getActions().length, 1);
  t.deepEqual(t.context.store.getState(), 1);
});

test('decrement state with dispatched action', t => {
  t.context.render();
  t.deepEqual(t.context.store.getState(), 0);
  t.context.wrapper.find(Counter).first().find('button').at(1).simulate('click');

  t.is(t.context.store.getActions().length, 1);
  t.deepEqual(t.context.store.getState(), -1);
});

test('dispatch an action with promise', t => {
  t.context.render();
  t.context.wrapper.find(Counter).first().find('button').last().simulate('click');

  t.is(t.context.store.getActions().length, 0);
  t.is(t.context.store.getPromises().length, 1);
  t.is(t.context.store.getPending().length, 1);
});


test('resolve a dispatched action with promise', t => {
  t.context.render();
  t.context.wrapper.find(Counter).first().find('button').last().simulate('click');

  const promises = t.context.store.getPromises();

  t.is(t.context.store.getActions().length, 0);
  t.is(t.context.store.getPromises().length, 1);
  t.is(t.context.store.getResolved().length, 0);
  t.is(t.context.store.getPending().length, 1);

  promises[0].then(()=> {
    t.is(t.context.store.getActions().length, 1);
    t.is(t.context.store.getPromises().length, 1);
    t.is(t.context.store.getResolved().length, 1);
    t.is(t.context.store.getPending().length, 0);
  })
});

test('increment state after a dispatched action with promise is resolved', t => {
  t.context.render();
  t.context.wrapper.find(Counter).first().find('button').last().simulate('click');

  const promises = t.context.store.getPromises();

  promises[0].then(()=> {
    t.is(t.context.store.getState(), 1);
    t.is(t.context.store.getActions().length, 1);
    t.is(t.context.store.getPromises().length, 1);
    t.is(t.context.store.getResolved().length, 1);
    t.is(t.context.store.getPending().length, 0);
  })
});
