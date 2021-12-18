import { combineReducers } from 'redux';

import cartReducer from './Cart/cart-reducers';

// this will be the reducer that combines all other reducers we've defined
const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
