/** @format */

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useStateContext } from "../context/context";

const PublicRoute = ({ component: Component, ...rest }) => {
	const { isAuthenticated } = useStateContext();
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated ? <Redirect to="/home" /> : <Component {...props} />
			}
		/>
	);
};

export default PublicRoute;
