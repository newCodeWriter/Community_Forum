import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'
import Error from './components/error'
import PrivateRoute from './containers/private'
import PublicRoute from './containers/public'
import { getAuthorization } from './actions'

class App extends Component{

  componentDidMount(){
    this.props.getAuth()
  }

  render() {
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
    );
  }
}

const mapStateToProps = (state) => ({ 
  user: state.authentication.userName 
});

const mapDispatchToProps = (dispatch) => ({
  getAuth: () => {
    dispatch(getAuthorization())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
