import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'
import Error from './components/error'
import PrivateRoute from './containers/private'
import PublicRoute from './containers/public'

function App(){

  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/login"/>}/>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute path="/home" component={Home} />
          <Route component={Error} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

const mapStateToProps = (state) => {
  const { authentication, data_request } = state
  return {
    auth: authentication,
    data: data_request
  }
}

export default connect(mapStateToProps)(App);
