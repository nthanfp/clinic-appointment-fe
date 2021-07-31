import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getToken } from './Common';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <div>
      <Route
        {...rest}
        render={(props) => {
          return getToken() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/auth/login',
                state: { from: props.location },
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default PrivateRoute;
