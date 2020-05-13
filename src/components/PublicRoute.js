import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isUserAuthenticated } from "../utils/auth";

function PrivateRoute({ children, ...rest }) {
  let Component = { ...children };

  return (
    <Route
      {...rest}
      render={(props) => {
        Component.props = props;
        return !isUserAuthenticated() ? (
          Component
        ) : (
          <Redirect
            to={{
              pathname: "/tables",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
