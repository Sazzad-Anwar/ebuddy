/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import {
    USER_LOGIN_FAILED,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_UPDATE_FAILED,
    USER_UPDATE_SUCCESS,
    FRIEND_REQUEST_ERROR,
    FRIEND_REQUEST_SUCCESS,
    GET_FRIENDS_SUCCESS,
    GET_FRIENDS_ERROR,
    GET_CHAT_MESSAGE_ERROR,
    GET_CHAT_MESSAGE,
} from './Constants';

export const userLogin = (user) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const { data } = await axios.post('/api/v1/user', user);

        console.log(data);

        localStorage.setItem('user', JSON.stringify(data.user));

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
    localStorage.removeItem('user');
    dispatch({
        type: USER_LOGOUT,
    });
};

export const userUpdate = (user) => async (dispatch) => {
    try {
        const { data } = await axios.put('/api/v1/user', user);
        localStorage.setItem('user', JSON.stringify(data.user));
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

export const friendRequest = (email) => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/v1/user?search=${email}`);

        dispatch({
            type: FRIEND_REQUEST_SUCCESS,
            payload: data.friendRequests,
        });
    } catch (error) {
        dispatch({
            type: FRIEND_REQUEST_ERROR,
            payload: error.response ? error.response : error.message,
        });
    }
};

export const getFriends = (email) => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/v1/user?search=${email}`);
        dispatch({
            type: GET_FRIENDS_SUCCESS,
            payload: data.friends,
        });
    } catch (error) {
        dispatch({
            type: GET_FRIENDS_ERROR,
            payload: error.response ? error.response : error.message,
        });
    }
};

export const getChatMsg = () => async (dispatch) => {
    try {
        const { data } = await axios.get('/api/v1/messages');
        dispatch({
            type: GET_CHAT_MESSAGE,
            payload: data.messages,
        });
    } catch (error) {
        dispatch({
            type: GET_CHAT_MESSAGE_ERROR,
            payload: error.response ? error.response : error.message,
        });
    }
};
