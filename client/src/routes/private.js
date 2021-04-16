import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userAuth } from '../utils/localStorage';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
      userAuth.loggedIn() === true
      ? <Component {...props} />
      : <Redirect to="/login" />
    )}/>
);

export default PrivateRoute;