import * as ActionTypes from './cart-types';
import { EquipmentItem } from 'types/Equipment';

export const addToCart = (item: EquipmentItem) => {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: {
      item: item,
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

export const setProjectName = (projectName: string) => {
  return {
    type: ActionTypes.SET_PROJECT_NAME,
    payload: {
      projectName: projectName,
    },
  };
};

export const setCheckoutTime = (time: Date) => {
  return {
    type: ActionTypes.SET_CHECKOUT_TIME,
    payload: {
      time: time,
    },
  };
};

export const setReturnTime = (time: Date) => {
  return {
    type: ActionTypes.SET_RETURN_TIME,
    payload: {
      time: time,
    },
  };
};
