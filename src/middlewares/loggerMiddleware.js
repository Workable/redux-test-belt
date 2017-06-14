import { isValidAction, has } from '../utils';
let actions = [];

const actionsLoggerMiddleware = store => next => action => {

  if (isValidAction(action)) {
    actions = actions.concat(action);
  }
  return next(action);
};

const loggedActions = {
  hasActions: (...matched) => has(matched,actions),
  clearActions: () => {
    actions = [];
    return actions;
  },
  getActions: () => actions,
  get: () => actions,
};

export { actionsLoggerMiddleware, loggedActions };
