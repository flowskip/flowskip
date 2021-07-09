import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "../pages/home";
import ConfigRoom from "../pages/configroom";

import GlobalStyle from "../styles/GlobalStyle";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/config-room" component={ConfigRoom} />
      </Switch>
    </BrowserRouter>
  );
}
