import * as actionTypes from './cart-types';
import { cloneDeep } from 'lodash';

export interface CartState {
  cartItems: { [itemID: number]: number };
}

const INITIAL_STATE: CartState = {
  cartItems: {},
};

// note that we don't modify the old state object; we create a new one and
// return that. A reducer takes a previous state and an action and return a
// new state after performing that action.
const cartReducer = (state: CartState = INITIAL_STATE, action: any) => {
  let itemID: number;
  // this deals with the init action that doesn't have a payload
  if (action.payload) {
    itemID = action.payload.id;
  } else {
    return state;
  }
  let newCartItems = cloneDeep(state.cartItems);
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      newCartItems[itemID] === undefined
        ? (newCartItems[itemID] = 1)
        : newCartItems[itemID]++;
      return { ...state, cartItems: newCartItems };
    case actionTypes.REMOVE_FROM_CART:
      delete newCartItems[itemID];
      return { ...state, cartItems: newCartItems };
    case actionTypes.ADJUST_QTY:
      newCartItems[itemID] = action.payload.qty;
      return { ...state, cartItems: newCartItems };
    default:
      return state;
  }
};

export default cartReducer;
