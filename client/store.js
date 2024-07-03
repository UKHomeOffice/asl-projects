import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

const middlewares = [thunk];

export default function configureStore(initialState = {}) {

  let middleware;

  if (process.env.NODE_ENV === 'development') {
    middleware = composeWithDevTools(applyMiddleware(...middlewares));
  } else {
    middleware = applyMiddleware(...middlewares);
  }

  return createStore(
    reducer,
    initialState,
    middleware
  );
}
