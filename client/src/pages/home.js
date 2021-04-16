/** @format */

import React from "react";
import { Button, Navbar, Nav, Dropdown, NavItem } from "react-bootstrap";
import { Route, Switch, NavLink, useHistory } from "react-router-dom";
import Subject from "./subject";
import Question from "./question";
import Post from "./post";
import Account from "./account";
import { math } from "../constants/constants";
import { useStateContext, useDispatchContext } from "../context/context";

const Home = ({ match }) => {
	const { user } = useStateContext();
	const dispatch = useDispatchContext();
	const history = useHistory();

	const handleLogout = () => {
		localStorage.removeItem("token");
		dispatch({ type: "LOGOUT_USER" });
		history.replace('')
	};

	return (
		<>
			<Navbar bg="dark" variant="dark" className="pt-2 pb-2" sticky="top">
				<Nav className="pl-2">
					<Navbar.Brand href={`${match.url}`} id="math">
						MathQue
					</Navbar.Brand>
				</Nav>
				<Nav className="ml-auto">
					<Dropdown as={NavItem} className="mr-3">
						<Dropdown.Toggle id="nav-dropdown">
							<i className="fas fa-user-alt"></i> Welcome,{" "}
							{user.name.toUpperCase()}
						</Dropdown.Toggle>
						<Dropdown.Menu className="mt-2">
							<Dropdown.Item href={`${match.url}/account`} className="profile">
								Account
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
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
								to={`${match.url}/${id}`}
								activeClassName="active-link"
								className="pt-4 pb-4 pl-4 border-bottom"
								// onClick={() => dispatch(fetchCategoryInfo(id))}
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
							path={`${match.path}`}
							render={() => <h3>Select a category to view its questions...</h3>}
						/>
						<Route
							path={`${match.path}/:subjectId/question`}
							component={Question}
						/>
						<Route
							path={`${match.path}/:subjectId/:questionId`}
							component={Post}
						/>
						<Route exact path={`${match.path}/account`} component={Account} />
						<Route path={`${match.path}/:subjectId`} component={Subject} />
					</Switch>
				</div>
			</div>
		</>
	);
};

export default Home;
