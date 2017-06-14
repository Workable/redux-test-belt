import { isEqual, isUndefined } from 'lodash';
import { has } from '../utils';

let orphanActions = [];
let previousState;

const orphansMiddleware = store => next => action => {
  const currentState = store.getState();
  if( isEqual(previousState, currentState) || isUndefined(previousState)) {
    orphanActions = orphanActions.concat(action);
  }
  previousState = currentState;
  return next(action);
};

const orphans = {
  get: () => orphanActions,
  getOrphans: () => orphanActions,
  clearOrphans: () => {
    orphanActions = [];
    return orphanActions;
  },
  hasOrphans:  (...matched) => has(matched,orphanActions)
};

export { orphans, orphansMiddleware };
