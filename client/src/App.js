/** @format */

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/home";
import Signin from "./pages/signin";
import Error from "./components/error";
import PrivateRoute from "./routes/private";
import PublicRoute from "./routes/public";
import { Provider } from "./context/context";

const App = () => {

	return (
		<Provider>
			<BrowserRouter>
				<Switch>
					<PublicRoute exact path="/" component={Signin} />
					<PrivateRoute path="/home" component={Home} />
					<Route component={Error} />
				</Switch>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
