/** @format */

import {
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAILURE,
	LOGOUT_USER,
	UPDATE_USER,
	LOADING,
} from "../constants/constants";

let counter = 1;
const storage = localStorage.getItem("auth");

export const initialState = {
	isAuthenticated: !!storage,
	loading: true,
	user: {},
	loginAttempts: 0,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case LOADING:
			return { ...state, loading: true };
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload,
			};
		case LOGIN_USER_FAILURE:
			return {
				...state,
				isAuthenticated: false,
				loginAttempts: counter++,
				loading: false,
			};
		case LOGOUT_USER:
			return {
				isAuthenticated: false,
				loading: false,
				user: {},
				loginAttempts: 0,
			};
		case UPDATE_USER:
			return { ...state, user: { ...state.user, ...action.payload } };
		default:
			return state;
	}
};
