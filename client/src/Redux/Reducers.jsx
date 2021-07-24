/* eslint-disable import/prefer-default-export */
import {
    USER_LOGIN_FAILED,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_UPDATE_FAILED,
    USER_UPDATE_SUCCESS,
} from './Constants';

export const loginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
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
