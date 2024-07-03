import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducer from './reducers';

const middlewares = [thunk];

export default function configureStore(initialState = {}) {
  // Use composeWithDevTools to enhance the store with middleware and ReduxDevTools
  const store = createStore(
      reducer,
      initialState,
      composeWithDevTools(applyMiddleware(...middlewares))
  );

  return store;
}
