import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react'; //These functions make our components observable and be able to use the store
import AuthenticatedUsers from '../enums/PrivateRouteUsers';
import './App.css';

import ComponentNotFound from './error/ComponentNotFound';
import ProtectedRoute from '../components/Route/ProtectedRoute';
import Login from '../views/Login';

// Admin User
import UserManagement from '../views/UserManagement/';

function App(props) {
  const { store } = props;

  /**
   * @IMPORTANT
   * @REQUIRED_PROP
   * authenticatedUserTypes={[1,2]} -> Meaning: all user types can access this route
   */

  /**
   *   ====== User Types ======
   *   1 = Administrator
   *   2 = Standard User
   */

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" render={(props) => <Login store={store} />} />
          <ProtectedRoute exact path="/(|UserManagement)/" component={UserManagement} store={store} authenticatedUserTypes={AuthenticatedUsers['Administrator']} />
          <Route component={ComponentNotFound} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default inject('store')(observer(App));
