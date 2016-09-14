import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import Counter from './components/container';

const rootEl = document.getElementById('root');
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Counter />
    </Provider>,
    rootEl
  )
}

render();
store.subscribe(render);
