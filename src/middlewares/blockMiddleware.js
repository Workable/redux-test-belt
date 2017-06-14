import { has } from '../utils';
let blocked = [];
const PREFIX_ACTION = '✋BLOCKED_ACTION';

const blockMiddleware = (allow = (st, act) => true) => store => next => action => {
  if (allow(store.getState(), action) === false) {
    blocked = blocked.concat(action);
    action = {
      type: PREFIX_ACTION,
      payload: action
    }
  }
  return next(action);
};

const blockedActions = {
  get: () => blocked,
  getBlocked: () => blocked,
  clearBlocked: () => {
    blocked = [];
    return blocked;
  },
  hasBlocked:  (...matched) =>  has(matched,blocked)
};

export { blockMiddleware, blockedActions, PREFIX_ACTION };
