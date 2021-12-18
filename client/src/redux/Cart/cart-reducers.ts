import * as actionTypes from './cart-types';
import { cloneDeep } from 'lodash';

interface CartState {
  cart: { [itemID: number]: number };
}
const INITIAL_STATE: CartState = {
  cart: {},
};

// note that we don't modify the old state object; we create a new one and
// return that. A reducer takes a previous state and an action and return a
// new state after performing that action.
const cartReducer = (state: CartState = INITIAL_STATE, action: any) => {
  let itemID = action.payload.id;
  let newCart = cloneDeep(state.cart);
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      newCart[itemID] === undefined ? (newCart[itemID] = 1) : newCart[itemID]++;
      return { ...state, cart: newCart };
    case actionTypes.REMOVE_FROM_CART:
      delete newCart[itemID];
      return { ...state, cart: newCart };
    case actionTypes.ADJUST_QTY:
      newCart[itemID] = action.payload.qty;
      return { ...state, cart: newCart };
    default:
      return state;
  }
};

export default cartReducer;
