import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER, FETCH_DATA, UPDATE_USER } from '../constants';
import { combineReducers } from 'redux'
import decode from 'jwt-decode'

const userInfo = {
    isAuthenticated: false, 
    token: null,
    userName: null,
    loggedIn: false, 
    statusText: null,
    loginAttempts: 0
}

const authentication = (state = userInfo, action) => {
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return {...state,
                isAuthenticated: true, 
                token: action.payload.token,
                userName: decode(action.payload.token).name,
                loggedIn: true,
                statusText: 'You have been successfully logged in.'
            }
        case LOGIN_USER_FAILURE:
            return {...state,
                isAuthenticated: false, 
                token: null,
                userName: null,
                loggedIn: false,
                statusText: action.payload.status === 400
                            ? 'This user does not exist.' 
                            : 'You have entered an incorrect password',
                loginAttempts: action.payload.attempts,
                status: action.payload.status
            }
        case LOGOUT_USER:
            return {...state,
                isAuthenticated: false, 
                token: null,
                userName: null,
                loggedIn: false,
                statusText: 'You have been successfully logged out.'
            }
        case UPDATE_USER:
            return {...state,
                userName: action.payload
            }
        default:
            return state
    }
}

const data_request = (state = [], action) => {
    switch (action.type) {
        case FETCH_DATA:
            return [
                ...state,
                action.payload
            ].slice(-1)
        default:
            return state
        
    }
}

const mathApp = combineReducers({authentication, data_request});

export default mathApp; 