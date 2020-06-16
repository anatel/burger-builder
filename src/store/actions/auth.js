import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: {
            token,
            userId
        }
    }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());

        const authData = {
            email,
            password,
            returnSecureToken: true
        };

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD5u2OlVETEGGIOWzdDEFU7eTpuuqu3Kck';
        if (!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD5u2OlVETEGGIOWzdDEFU7eTpuuqu3Kck';
        }

        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                console.log('response', response);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn))
            })
            .catch(err => {
                console.log('err', err.response.data.error);
                dispatch(authFail(err.response.data.error))
            })
    }
};

export const setRedirectPath = (path) => {
    return {
        type: actionTypes.SET_REDIRECT_PATH,
        path
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationDate'));
            if (new Date() <= expirationTime) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logout());
            }
        }
    };
};
