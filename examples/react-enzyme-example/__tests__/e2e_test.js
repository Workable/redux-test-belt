// Setup the testing env first
// https://github.com/airbnb/enzyme/blob/2d5c828de7aa2d090b58b7c3aee3c9e1575fe90f/docs/guides/jsdom.md

import './setup';

import test from 'ava';
import { mount } from 'enzyme';

import React from 'react';
import { Provider } from 'react-redux';
import todoApp from '../reducers';
import App from '../components/App';
import create from '../../../src/modules/mockStore';


import AddTodo from '../components/AddTodo';
import VisibleTodoList from '../components/VisibleTodoList';
import Footer from '../components/Footer';
import Todo from '../components/Todo';

test.before(t => {
});

test.beforeEach(t => {
  t.context.initPseudostore = create([]);
  t.context.pseudoStore = t.context.initPseudostore({}, todoApp);
  t.context.wrapper = mount(
    <Provider store={t.context.pseudoStore}>
      <App />
    </Provider>
  );
});


test.afterEach(t => {
  if (t.context.wrapper) {
    t.context.wrapper.unmount();
  }

  delete t.context.pseudoStore;
  delete t.context.initPseudostore;
});

test('the todoApp is rendered ', t => {
  t.is(t.context.wrapper.find(App).length, 1);
});

test('the todoApp renders the appropriate sub components ', t => {
  t.is(t.context.wrapper.find(AddTodo).length, 1);
  t.is(t.context.wrapper.find(VisibleTodoList).length, 1);
  t.is(t.context.wrapper.find(Footer).length, 1);
});

test('adding todos renders the appropriate item in the list', t => {
  const firstTodo = 'Learn React';
  const secTodo = 'Learn Redux';

  t.context.pseudoStore.dispatch({ type: 'ADD_TODO', id: -1, text: firstTodo });
  t.is(t.context.wrapper.find(Todo).length, 1);
  t.context.pseudoStore.dispatch({ type: 'ADD_TODO', id: -2, text: secTodo });
  t.is(t.context.wrapper.find(Todo).length, 2);
});

test('adding todos through the UI renders the appropriate items in the list', t => {
  const todoTxt = 'Learn ES6';
  const $input = t.context.wrapper.find('#todoTitle');
  const $form = t.context.wrapper.find('form');

  $input.node.value = todoTxt;
  $input.simulate('change', $input);
  $form.simulate('submit');

  t.is(t.context.wrapper.find(Todo).length, 1);
  t.is(t.context.wrapper.find(Todo).text(), todoTxt);
});


test('toggling todos through the UI groups accordinaly each item', t => {
  const todoTxt = 'Learn HTML';
  const secTodoTxt = 'Learn Node.js';

  t.context.pseudoStore.dispatch({ type: 'ADD_TODO', id: -1, text: todoTxt });
  t.context.pseudoStore.dispatch({ type: 'ADD_TODO', id: -2, text: secTodoTxt });

  t.context.wrapper.find(Todo).first().simulate('click');
  t.context.wrapper.find('#SHOW_COMPLETED').simulate('click');
  t.is(t.context.wrapper.find(Todo).length, 1);
});

test('switching between list groups through the DOM renders the appropriate items in the list', t => {
  const todoTxt = 'Learn JavaScript';
  t.context.pseudoStore.dispatch({ type: 'ADD_TODO', id: -1, text: todoTxt });
  t.is(t.context.wrapper.find(Todo).length, 1);

  t.context.wrapper.find('#SHOW_ACTIVE').simulate('click');
  t.is(t.context.wrapper.find(Todo).length, 1);

  t.context.wrapper.find('#SHOW_COMPLETED').simulate('click');
  t.is(t.context.wrapper.find(Todo).length, 0);
});
