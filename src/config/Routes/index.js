import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import PrivateRoute from '../../utils/PrivateRoute';
import PublicRoute from '../../utils/PublicRoute';
import {
  Login,
  Register,
  Home,
  About,
  Contact,
  Dashboard,
} from '../../pages';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <PublicRoute exact path="/auth/login" component={Login} />
        <PublicRoute exact path="/auth/register" component={Register} />
      </Switch>
    </Router>
  );
};

export default Routes;
