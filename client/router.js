import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Index from './pages';
import Settings from './pages/settings';
import Diff from './pages/diff';
import ConnectProject from './connect-project';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/diff" component={ Diff } />
      <Route path="/settings" component={ Settings } />
      <Route path="/project/:id" component={ ConnectProject } />
      <Route path="/" component={ Index } />
    </Switch>
  </BrowserRouter>
);

export default Router;
