import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userAuth } from "../utils/localStorage";

const PublicRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            userAuth.loggedIn() === true 
            ? <Redirect to="/home" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;