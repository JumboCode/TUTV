import React, { useReducer, createContext, useContext } from 'react';

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

type LogoutAction = { type: 'logout' };

export type Action = LoginAction | LogoutAction;

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

  // note: due to a bug, TypeScript marks code below this IIFE as "unreachable." This will be
  // resolved in TypeScript 3.9. See https://github.com/microsoft/TypeScript/issues/36828
  auth: (() => {
    try {
      return JSON.parse(localStorage.getItem('auth') || "this isn't json");
    } catch (e) {
      return { accessToken: null, refreshToken: null };
    }
  })(),
};

// Create the context
const StoreContext = createContext({} as StoreContext);

// In order to define an action, first define it in the Action type definition above, then add a
// handler function here.
// A handler function should take state as input, and return a copy of the state object mutated
const actionHandlers: ActionDictionary = {
  login(state: State, action: Action): State {
    const {
      tokens: { access: accessToken, refresh: refreshToken },
    } = action as LoginAction;
    const auth = { accessToken, refreshToken };
    localStorage.setItem('auth', JSON.stringify(auth));
    return { ...state, auth };
  },

  logout(state: State): State {
    localStorage.removeItem('auth');
    return { ...state, auth: { accessToken: null, refreshToken: null } };
  },
};

const reducer = (state: State, action: Action): State => {
  const actionHandler = actionHandlers[action.type];
  return actionHandler(state, action);
};

// The StoreProvider component wraps the whole app so that children can use useStore, which
// leverages the context API
export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
