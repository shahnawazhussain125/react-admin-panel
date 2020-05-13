import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isUserAuthenticated } from "../utils/auth";

function PrivateRoute({ children, ...rest }) {
  let Component = { ...children };
  return (
    <Route
      {...rest}
      exact
      render={(props) => {
        Component.props = props;
        return isUserAuthenticated() ? (
          Component
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
