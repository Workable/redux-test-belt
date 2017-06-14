import { isPromise } from '../utils';

const storedPromises = {
  all : [],
  pending : [],
  rejected : [],
  resolved : []
};
let inc = 0;

const mapPromises = function (promise){
  storedPromises.all = storedPromises.all.concat(promise);
  storedPromises.pending = storedPromises.pending.concat({
    id: inc,
    promise
  });
  const currentIndex = inc;
  inc = inc + 1;
  promise.then((promiseAction) => {
    storedPromises.pending = storedPromises.pending.filter(
      (p) => p.id !== currentIndex);
    storedPromises.resolved = storedPromises.resolved.concat(promiseAction);

  },(promiseAction) => {

    storedPromises.pending = storedPromises.pending.filter(
      (p) => p.id !== currentIndex);
    storedPromises.rejected = storedPromises.rejected.concat(promiseAction);

  });
}


const promiseMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    const kindaPromise = action(dispatch, getState);
    if (isPromise(kindaPromise)) {
      mapPromises(kindaPromise);
    }
  }
  return next(action);
}

const clearPromises = function() {
  storedPromises.all = [];
  storedPromises.pending = [];
  storedPromises.rejected = [];
  storedPromises.resolved = [];
  return storedPromises.all;
}

const promises = {
  getPromises: () => storedPromises.all,
  get: () => storedPromises.all,
  clearPromises,
  clear: () => clearPromises(),
  getPending: () => storedPromises.pending.map( p => p.promise),
  getRejected: () => storedPromises.rejected,
  getResolved: () => storedPromises.resolved
};

export { promiseMiddleware, promises };
