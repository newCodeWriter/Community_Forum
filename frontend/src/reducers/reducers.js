import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER, FETCH_DATA, GET_AUTH } from '../constants';
import { combineReducers } from 'redux'
import decode from 'jwt-decode'
import { userAuth } from '../checkAuth'

const userInfo = {
    isAuthenticated: false, 
    token: null,
    userName: null,
    loggedIn: false
}

const authentication = (state = userInfo, action) => {
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: true, 
                token: action.payload.token,
                userName: decode(action.payload.token).name,
                loggedIn: true,
                statusText: 'You have been successfully logged in.'
            })
        case LOGIN_USER_FAILURE:
            return Object.assign({}, state, {
                isAuthenticated: false, 
                token: null,
                userName: null,
                loggedIn: false,
                status: action.payload.status
            })
        case LOGOUT_USER:
            return Object.assign({}, state, {
                isAuthenticated: false, 
                token: null,
                userName: null,
                loggedIn: false,
                statusText: 'You have been successfully logged out.'
            })
        case GET_AUTH:
            return {...state, loggedIn: userAuth.loggedIn()}
        default:
            return state
    }
}

const data_request = (state = [], action) => {
    switch (action.type) {
        case FETCH_DATA:
            return [
                ...state,
                action.payload.data
            ]
        default:
            return state
        
    }
}

const mathApp = combineReducers({authentication, data_request});

export default mathApp; 