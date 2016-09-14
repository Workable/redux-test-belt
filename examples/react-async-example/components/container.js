import Counter from './component';
import { connect } from 'react-redux';

const onIncrement = dispatch => {
  dispatch({ type: 'INCREMENT' });
}

const onDecrement = dispatch => {
  dispatch({ type: 'DECREMENT' });
}

const onIncrementAsync = dispatch => {
  return dispatch(() => {
    return Promise.resolve()
      .then(() => {
        dispatch({ type: 'INCREMENT' });
      });
  });
}

function mapStateToProps(state) {
  return {
    value: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onIncrement: () => { onIncrement(dispatch) },
    onDecrement: () => { onDecrement(dispatch) },
    onIncrementAsync: () => { onIncrementAsync(dispatch) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
