/* eslint-disable no-unused-vars */
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { friendRequestsReducer, getChatReducer, getFriendsReducer, loginReducer } from './Reducers';

const reducer = combineReducers({
    userLogin: loginReducer,
    friends: getFriendsReducer,
    friendRequests: friendRequestsReducer,
    chat: getChatReducer,
});

const getUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};

const initialState = {
    userLogin: {
        user: getUser.isLoggedIn ? getUser : { isLoggedIn: false },
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
