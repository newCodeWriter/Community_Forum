/** @format */

import { loggedIn, token, tokenDetails } from "../utils/localStorage";
import {
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAILURE,
	LOGOUT_USER,
	UPDATE_USER,
} from "../constants/constants";
import decode from "jwt-decode";

let counter = 1;

export const initialState = {
	isAuthenticated: loggedIn,
	token: token,
	user: tokenDetails,
	loginAttempts: 0,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				token: action.payload.token,
				user: {
					id: decode(action.payload.token).id,
					name: decode(action.payload.token).name,
					email: decode(action.payload.token).email,
				},
			};
		case LOGIN_USER_FAILURE:
			return {
				...state,
				loginAttempts: counter++,
			};
		case LOGOUT_USER:
			return initialState;
		case UPDATE_USER:
			return { ...state, user: { ...state.user, ...action.payload } };
		default:
			return state;
	}
};
