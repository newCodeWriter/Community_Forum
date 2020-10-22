import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';
// import App from './App';
import Home from './components/home';
import Error from './components/error';

const Routeit = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <div>About this</div>}/>
          <Route path="/home" component={Home}/>
          <Route component={Error} />
        </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Routeit />, document.getElementById('root'));
