import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Tables from "./screens/Tables";
import Language from "./screens/Language";
import Owner from "./screens/Owner";
import Illustration from "./screens/Illustration";
import Auther from "./screens/Authers";
import Book from "./screens/Book";
import Tales from "./screens/Tales";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Tables} />
        <Route path="/language" component={Language} />
        <Route path="/owner" component={Owner} />
        <Route path="/illustration" component={Illustration} />
        <Route path="/auther" component={Auther} />
        <Route path="/book" component={Book} />
        <Route path="/tales" component={Tales} />
      </Switch>
    </Router>
  );
}

export default App;
