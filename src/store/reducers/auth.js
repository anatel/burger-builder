import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: null,
    redirectPath: '/'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return updateObject(state, {
                error: null,
                loading: true
            });
        case actionTypes.AUTH_SUCCESS:
            return updateObject(state, {
                loading: false,
                token: action.authData.token,
                userId: action.authData.userId,
                error: null,
            });
        case actionTypes.AUTH_FAIL:
            return updateObject(state, {
                loading: false,
                error: action.error,
            });
        case actionTypes.AUTH_LOGOUT:
            return updateObject(state, {
                token: null,
                userId: null
            });
        case actionTypes.SET_REDIRECT_PATH:
            return updateObject(state, {
                redirectPath: action.path
            });
        default:
            return state;
    }
};

export default reducer;
