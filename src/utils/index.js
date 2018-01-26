import isPlainObject from 'lodash/isPlainObject';
import every from 'lodash/every';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import find from 'lodash/find';


export const isValidAction = (action) => {
  if (typeof action === 'undefined' || !isPlainObject(action)) {
    throw new Error(
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.'
    );
  }
  if (typeof action.type === 'undefined') {
    throw new Error(
      'Actions may not have an undefined "type" property. ' +
      'Have you misspelled a constant?'
    );
  }
  return true;
}

export const has = (matched, actions) => {
  return every(matched, (needle) => (isObject(needle))
    ? find(actions, needle)
    : find(actions,(action) => action.type === needle));
}

export const isPromise = (obj) => {
  try {
    return isFunction(obj.then);
  } catch (e) {
    return false;
  }

};
