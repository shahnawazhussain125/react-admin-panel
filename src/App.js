import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Tables from "./screens/Tables";
import Language from "./screens/Language";
import Owner from "./screens/Owner";
import Illustration from "./screens/Illustration";
import Author from "./screens/Authors";
import Book from "./screens/Book";
import Tales from "./screens/Tales";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Tables} />
        <Route exact path="/tables" component={Tables} />
        <Route path="/language" component={Language} />
        <Route path="/owner" component={Owner} />
        <Route path="/illustrator" component={Illustration} />
        <Route path="/author" component={Author} />
        <Route path="/book" component={Book} />
        <Route path="/tales" component={Tales} />
      </Switch>
    </Router>
  );
}

export default App;
