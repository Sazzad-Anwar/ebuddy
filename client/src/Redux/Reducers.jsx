/* eslint-disable import/prefer-default-export */
import {
    FRIEND_REQUEST_ERROR,
    FRIEND_REQUEST_SUCCESS,
    GET_CHAT_MESSAGE,
    GET_CHAT_MESSAGE_ERROR,
    GET_FRIENDS_ERROR,
    GET_FRIENDS_SUCCESS,
    USER_LOGIN_FAILED,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_UPDATE_FAILED,
    USER_UPDATE_SUCCESS,
} from './Constants';

export const loginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return { loading: false, user: action.payload };
        case USER_UPDATE_SUCCESS:
            return { loading: false, user: action.payload };
        case USER_UPDATE_FAILED:
            return { loading: false, error: action.payload };
        case USER_LOGIN_FAILED:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};

export const friendRequestsReducer = (state = {}, action) => {
    switch (action.type) {
        case FRIEND_REQUEST_SUCCESS:
            return { friendRequest: action.payload };
        case FRIEND_REQUEST_ERROR:
            return { error: action.payload };
        default:
            return state;
    }
};

export const getFriendsReducer = (state = [], action) => {
    switch (action.type) {
        case GET_FRIENDS_SUCCESS:
            return { friends: action.payload };
        case GET_FRIENDS_ERROR:
            return { error: action.payload };
        default:
            return state;
    }
};

export const getChatReducer = (state = [], action) => {
    switch (action.type) {
        case GET_CHAT_MESSAGE:
            return { chat: action.payload };
        case GET_CHAT_MESSAGE_ERROR:
            return { error: action.payload };
        default:
            return state;
    }
};
