import * as actionTypes from './cart-types';
import { cloneDeep } from 'lodash';
import { CartItem } from 'types/Equipment';

export interface CartState {
  cartItems: {
    [itemID: number]: CartItem;
  };
  projectName: string;
  checkoutTime: Date | null;
  returnTime: Date | null;
}

const INITIAL_STATE: CartState = {
  cartItems: {},
  projectName: '',
  checkoutTime: null,
  returnTime: null,
};

// note that we don't modify the old state object; we create a new one and
// return that. A reducer takes a previous state and an action and return a
// new state after performing that action.
const cartReducer = (state: CartState = INITIAL_STATE, action: any) => {
  let newCartItems = cloneDeep(state.cartItems);
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      let item = action.payload.item;
      newCartItems[item.id] === undefined
        ? (newCartItems[item.id] = { item: item, qty: 1 })
        : newCartItems[item.id].qty++;
      return { ...state, cartItems: newCartItems };
    }
    case actionTypes.REMOVE_FROM_CART: {
      let itemID = action.payload.id;
      delete newCartItems[itemID];
      return { ...state, cartItems: newCartItems };
    }
    case actionTypes.ADJUST_QTY: {
      let itemID = action.payload.id;
      newCartItems[itemID].qty = action.payload.qty;
      return { ...state, cartItems: newCartItems };
    }
    case actionTypes.SET_PROJECT_NAME: {
      return { ...state, projectName: action.payload.projectName };
    }
    case actionTypes.SET_CHECKOUT_TIME: {
      return { ...state, checkoutTime: action.payload.time };
    }
    case actionTypes.SET_RETURN_TIME: {
      return { ...state, returnTime: action.payload.time };
    }
    default:
      return state;
  }
};

export default cartReducer;
