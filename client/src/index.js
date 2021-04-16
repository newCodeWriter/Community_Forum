import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import configureStore from "./store/configureStore";
import { saveState } from "./utils/localStorage";
import './index.css';

const store = configureStore()

store.subscribe(() => saveState({
  authentication: store.getState().authentication
}))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById("root")
)
