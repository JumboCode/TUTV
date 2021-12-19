import * as ActionTypes from './cart-types';

export const addToCart = (itemID: number) => {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: {
      id: itemID,
    },
  };
};

export const removeFromCart = (itemID: number) => {
  return {
    type: ActionTypes.REMOVE_FROM_CART,
    payload: {
      id: itemID,
    },
  };
};

export const adjustQty = (itemID: number, value: number) => {
  return {
    type: ActionTypes.ADJUST_QTY,
    payload: {
      id: itemID,
      qty: value,
    },
  };
};
