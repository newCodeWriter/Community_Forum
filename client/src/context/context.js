/** @format */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

import { reducer, initialState } from "./reducer";

const StateContext = createContext();
const DispatchContext = createContext();

export const Provider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const loadUser = async () => {
		dispatch({ type: "LOADING" });
		try {
			const response = await axios.get(`/api/users/token`);
			const { data } = response;
			if (data.user) {
				dispatch({ type: "LOGIN_USER_SUCCESS", payload: data.user });
				localStorage.setItem("auth", JSON.stringify({ auth: true }));
			}
			setTimeout(
				loadUser,
				process.env.REACT_APP_ACCESS_TOKEN_EXPIRATION * 1000
			);
		} catch (err) {
			if (err.response) {
				dispatch({ type: "LOGOUT_USER" });
			} else {
				console.error(err.message);
			}
			localStorage.removeItem("auth");
		}
	};

	useEffect(() => {
		loadUser();
		// eslint-disable-next-line
	}, []);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				{children}
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
export const useDispatchContext = () => useContext(DispatchContext);
