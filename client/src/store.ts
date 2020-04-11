import React, { useReducer, createContext, useContext } from 'react';
import cloneDeep from 'lodash.clonedeep';

const NODE_ENV = process.env.NODE_ENV || 'development';

type State = {
  apiUrl: string;
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
};

// ACTION DEFINITIONS

type LoginAction = {
  type: 'login';
  tokens: { access: string; refresh: string };
};

type Action = LoginAction | { type: 'action2' };

// END ACTION DEFINITIONS

type ActionDictionary = {
  [key: string]: (state: State, action: Action) => State;
};

type StoreContext = { state: State; dispatch: React.Dispatch<Action> };

// Define initial application state
const initialState: State = {
  apiUrl: {
    // note: trailing slashes matter!
    development: 'http://127.0.0.1:8000/api/v1/',
    production: new URL('/api/v1/', window.location.origin).href,
    test: 'https://tutv-dev.herokuapp.com/api/v1/',
  }[NODE_ENV],

  auth: { accessToken: null, refreshToken: null },
};

// Create the context
const StoreContext = createContext({} as StoreContext);

// In order to define an action, first define it in the Action type definition above, then add a
// handler function here.
// A handler function should take state as input, and return a copy of the state object mutated
const actionHandlers: ActionDictionary = {
  login(state: State, action: Action): State {
    const {
      tokens: { access, refresh },
    } = action as LoginAction;
    state.auth.accessToken = access;
    state.auth.refreshToken = refresh;
    return state;
  },

  action2(state: State): State {
    console.log('ACTION 2');
    return state;
  },
};

const reducer = (state: State, action: Action): State => {
  const actionHandler = actionHandlers[action.type];
  const state2 = cloneDeep(state);
  return actionHandler(state2, action);
};

// The StoreProvider component wraps the whole app so that children can use useStore, which
// leverages the context API
export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return React.createElement(
    StoreContext.Provider,
    { value: { state, dispatch } },
    children
  );
};

export const useStore = () => useContext(StoreContext);
