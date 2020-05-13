import React, { Component } from "react";
import { BrowserRouter as Router, Switch, br, Route } from "react-router-dom";

import Tables from "./screens/Tables";
import Language from "./screens/Language";
import Owner from "./screens/Owner";
import Illustration from "./screens/Illustration";
import Author from "./screens/Authors";
import Book from "./screens/Book";
import Tales from "./screens/Tales";
import Login from "./screens/Login";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import PageNotFound from "./screens/PageNotFound";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <PublicRoute path="/" exact>
            <Login />
          </PublicRoute>
          <PrivateRoute path="/tables">
            <Tables />
          </PrivateRoute>
          <PrivateRoute path="/language">
            <Language />
          </PrivateRoute>
          <PrivateRoute path="/owner">
            <Owner />
          </PrivateRoute>
          <PrivateRoute path="/illustrator">
            <Illustration />
          </PrivateRoute>
          <PrivateRoute path="/author">
            <Author />
          </PrivateRoute>
          <PrivateRoute path="/book">
            <Book />
          </PrivateRoute>
          <PrivateRoute path="/tales">
            <Tales />
          </PrivateRoute>
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
