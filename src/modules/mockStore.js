import { applyMiddleware, compose, createStore } from 'redux';
import isFunction from 'lodash/isFunction'
import { orphansMiddleware, orphans } from '../middlewares/orphansMiddleware';
import { promiseMiddleware, promises } from '../middlewares/promiseMiddleware'

import {
  actionsLoggerMiddleware,
  loggedActions
} from '../middlewares/loggerMiddleware';

import {
  blockMiddleware,
  blockedActions
} from '../middlewares/blockMiddleware';

export default function create(middlewares = []) {
  return (
    initialState = null,
    reducer = (currentState, action) => currentState,
    blockCheck = (...args) => true ) => {

    // Reset all the action, promise and middleware loggers
    loggedActions.clearActions();
    promises.clearPromises();
    orphans.clearOrphans();
    blockedActions.clearBlocked();

    // match the store enhancer
    const storeEnhancer = () => {
      return next => (...args) => {
        return {
          ...(next(...args)),

          getActions: () => loggedActions.getActions(),
          hasActions: (...matched) => loggedActions.hasActions(...matched),
          clearActions: () => loggedActions.clearActions(),

          getOrphans: () => orphans.getOrphans(),
          clearOrphans: () => orphans.clearOrphans(),
          hasOrphans: (...matched) => orphans.hasOrphans(...matched),

          getPromises: () => promises.getPromises(),
          getPending: () => promises.getPending(),
          getRejected: () => promises.getRejected(),
          getResolved: () => promises.getResolved(),
          clearPromises: () => promises.clearPromises(),

          clearBlocked: () => blockedActions.clearBlocked(),
          hasBlocked: (...matched) => blockedActions.hasBlocked(...matched),
          getBlocked: () => blockedActions.getBlocked()

        };
      };
    };

    // Bind the middlewares as an enhancer
    const middlewareEnhancer = applyMiddleware.apply(null, [
      blockMiddleware(blockCheck),
      promiseMiddleware,
      ...middlewares,
      actionsLoggerMiddleware,
      orphansMiddleware
    ]);

    // Finally create the fake store and map it
    return createStore(
      reducer,
      isFunction(initialState) ? initialState() : initialState,
      compose(
        middlewareEnhancer,
        storeEnhancer()
      ));
  }
}
