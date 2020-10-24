import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';
// import App from './App';
import Home from './components/home';
import Error from './components/error';
import Test from './components/test';

const Routeit = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/test"/>}/>
          <Route path="/home" component={Home}/>
          <Route path='/test' component={Test}/>
          <Route component={Error} />
        </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Routeit />, document.getElementById('root'));
