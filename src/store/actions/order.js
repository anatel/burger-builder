import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData
    }
};

const purchaseBurgerFailed = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error
    }
};

export const purchaseBurgerStart = () => {
  return {
      type: actionTypes.PURCHASE_BURGER_START
  }
};

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post(`/orders.json?auth=${token}`, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFailed(error));
            });
    }
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDER_START
    }
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDER_SUCCESS,
        orders
    }
};

export const fetchOrdersFailed = (error) => {
    return {
        type: actionTypes.FETCH_ORDER_FAILED,
        error
    }
};

export const fetchOrders = (token, userId) => {
  return dispatch => {
      dispatch(fetchOrdersStart());
      axios.get(`/orders.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`)
          .then(res => {
              const fetchedOrders = [];
              for (let key in res.data) {
                  fetchedOrders.push({ id: key, ...res.data[key] });
              }
              dispatch(fetchOrdersSuccess(fetchedOrders));
          })
          .catch(err => {
              dispatch(fetchOrdersFailed(err))
          })
  }
};
