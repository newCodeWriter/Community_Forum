/** @format */

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useStateContext } from "../context/context";

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { isAuthenticated } = useStateContext();
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
			}
		/>
	);
};

export default PrivateRoute;
