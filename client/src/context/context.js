/** @format */

import React, { createContext, useContext, useReducer } from "react";

import { reducer, initialState } from "./reducer";

const StateContext = createContext();
const DispatchContext = createContext();

export const Provider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// useEffect(() => {

	// }, []);

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
