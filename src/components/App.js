import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "../pages/Home";
import ConfigRoom from "../pages/ConfigRoom";

import GlobalStyle from "../styles/GlobalStyle";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/test-api" component={TestingApi} />
        <Route exact path="/config-room" component={ConfigRoom} />
        <Route exact path="/redirect-from-api" component={RedirectFromApi} />
      </Switch>
    </BrowserRouter>
  );
}
