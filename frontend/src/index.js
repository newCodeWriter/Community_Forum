import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import ReactDOM from 'react-dom'
import App from './App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import mathApp from './reducers/reducers'
import './index.css';

const loggerMiddleware = createLogger()

const store = createStore(mathApp, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById("root")
)
