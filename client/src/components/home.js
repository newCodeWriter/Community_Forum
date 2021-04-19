/** @format */

import React from "react";
import { Button, Navbar, Nav, Dropdown, NavItem } from "react-bootstrap";
import { Route, Switch, NavLink, useRouteMatch } from "react-router-dom";
import Subject from "../pages/subject";
import Question from "../pages/question";
import Post from "../pages/post";
import Account from "../pages/account";
import { math } from "../constants/constants";
import { useStateContext, useDispatchContext } from "../context/context";
import axios from "axios";

const Home = () => {
	const { user } = useStateContext();
	const dispatch = useDispatchContext();
	const { path, url } = useRouteMatch();

	const handleLogout = async () => {
		await axios.get(`/api/users/logout`);
		dispatch({ type: "LOGOUT_USER" });
		localStorage.removeItem("auth");
	};

	return (
		<>
			<Navbar bg="dark" variant="dark" className="pt-2 pb-2" sticky="top">
				<Nav className="pl-2">
					<NavLink to={url} id="math">
						MathQue
					</NavLink>
				</Nav>
				<Nav className="ml-auto">
					{user.name && (
						<Dropdown as={NavItem} className="mr-3">
							<Dropdown.Toggle id="nav-dropdown">
								<i className="fas fa-user-alt"></i>{" "}
								{`Welcome, ${user.name.toUpperCase()}`}
							</Dropdown.Toggle>
							<Dropdown.Menu className="mt-2">
								<NavLink to={`${url}/account`} className="profile">
									Account
								</NavLink>
							</Dropdown.Menu>
						</Dropdown>
					)}
					<Button
						variant="primary"
						onClick={handleLogout}
						className="d-none d-sm-block"
					>
						Logout
					</Button>
				</Nav>
			</Navbar>
			<div id="main" className="row m-0">
				<div id="side-menu" className="col-sm-5 col-md-4 col-lg-3 pl-0">
					<Nav className="flex-column flex-c">
						{math.map(({ name, id }) => (
							<NavLink
								key={id}
								to={`${url}/${id}`}
								activeClassName="active-link"
								className="pt-4 pb-4 pl-4 border-bottom"
							>
								{name}
							</NavLink>
						))}
					</Nav>
				</div>
				<div id="content" className="col-sm-7 col-md-8 col-lg-9 pl-5 pt-5">
					<Switch>
						<Route
							exact
							path={path}
							render={() => <h3>Select a category to view its questions...</h3>}
						/>
						<Route path={`${path}/:subjectId/question`} component={Question} />
						<Route path={`${path}/:subjectId/:questionId`} component={Post} />
						<Route exact path={`${path}/account`} component={Account} />
						<Route path={`${path}/:subjectId`} component={Subject} />
					</Switch>
				</div>
			</div>
		</>
	);
};

export default Home;
