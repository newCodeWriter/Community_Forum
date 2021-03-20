import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import mathApp from '../reducers/reducers'
import { createLogger } from 'redux-logger'
import { copyState } from '../utils/localStorage'

export default function configureStore() {
  const loggerMiddleware = createLogger()
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(mathApp, copyState(), composedEnhancers)

  return store
}