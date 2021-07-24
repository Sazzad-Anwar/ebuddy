/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import {
    USER_LOGIN_FAILED,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_UPDATE_FAILED,
    USER_UPDATE_SUCCESS,
} from './Constants';

export const userLogin = (user) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const { data } = await axios.post('/api/v1/user', user);
        // localStorage.setItem('user', JSON.stringify(user));
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAILED,
            payload: error.response ? error.response : error.message,
        });
    }
};

export const userLogout = () => async (dispatch) => {
    // localStorage.removeItem('user');
    dispatch({
        type: USER_LOGOUT,
    });
};

export const userUpdate = (user) => async (dispatch) => {
    try {
        const { data } = await axios.put('/api/v1/user', user);
        console.log('from action', data.user);
        // localStorage.setItem('user', JSON.stringify(user));
        dispatch({
            type: USER_UPDATE_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAILED,
            payload: error.response ? error.response : error.message,
        });
    }
};
