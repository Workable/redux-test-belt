import { createStore } from 'redux';
import rootReducer from './reducers';

const rootEl = document.getElementById('value');
const store = createStore(rootReducer);

function render() {
  rootEl.innerHTML = store.getState().toString();
}
document.getElementById('increment')
  .addEventListener('click', function() {
    store.dispatch({
      type: 'INCREMENT'
    })
  });

document.getElementById('decrement')
  .addEventListener('click', function() {
    store.dispatch({
      type: 'DECREMENT'
    })
  });

render();
store.subscribe(render);
