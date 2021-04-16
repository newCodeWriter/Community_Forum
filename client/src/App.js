/** @format */

import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "./context/context";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Error from "./components/error";
import { loggedIn } from "./utils/localStorage"

const App = () => {
	return (
		<Provider>
			<BrowserRouter>
				<Switch>
					<Route exact path="/">
						{loggedIn ? <Redirect to="/home" /> : <Signin />}
					</Route>
					<Route exact path="/home" component={Home} />
					<Route component={Error} />
				</Switch>
			</BrowserRouter>
		</Provider>
	);
};

export default App;