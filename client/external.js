import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Alert from './components/alert';
import ProjectRouter from './project-router';
import configureStore from './store';

const renderApp = ({ basename, onUpdate, onComplete }, initialState) => {
  const store = configureStore(initialState);
  render(
    <Provider store={store}>
      <React.Fragment>
        <Alert />
        <ProjectRouter basename={basename} onUpdate={onUpdate} onComplete={onComplete} />
      </React.Fragment>
    </Provider>,
    document.getElementById('ppl-drafting-tool')
  );
}

export default renderApp;
