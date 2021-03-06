// @flow
import { StoreState, Action } from '../types/redux';
import type { Reducers } from '../types/redux';
import { createInitialStore } from './store';

export function create<M, P>(
  type: string,
  reducers: Reducers
): {
  type: string,
  action: (meta: M, payload?: P | Error) => Action<M, P>,
  reducer: (state: StoreState, action: Action<M, P>) => StoreState
} {
  return {
    type,
    action: (meta: M, payload?: P | Error) => {
      if (payload === undefined) {
        return { type, status: 'Start', meta };
      } else if (payload instanceof Error) {
        return {
          type,
          status: 'Error',
          meta,
          error: payload
        };
      }
      return {
        type,
        status: 'Success',
        meta,
        payload
      };
    },
    reducer: (state: StoreState, action: Action<M, P>) => {
      if (action.type === type) {
        switch (action.status) {
          case 'Start':
            11;
            if (reducers.start) {
              return reducers.start(state, action.meta);
            }
            break;
          case 'Error':
            if (reducers.error && action.error !== undefined) {
              return reducers.error(state, action.meta, action.error);
            }
            break;
          case 'Success':
            if (reducers.success && action.payload !== undefined) {
              return reducers.success(state, action.meta, action.payload);
            }
            break;
          default:
            break;
        }
      }

      return state === undefined ? createInitialStore() : state;
    }
  };
}

export const combineReducers = (...reducers: Function[]): Function => (
  state: StoreState,
  action: Action<any, any>
) => {
  let newState = state;
  reducers.forEach(reducer => {
    newState = reducer(newState, action);
  });
  return newState;
};
