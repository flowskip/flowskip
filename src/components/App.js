import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from '../pages/home.js'
import ConfigRoom from '../pages/configroom.js'

export default function App() {
  return (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/config-room/:id" component={ConfigRoom} />
        </Switch>
    </BrowserRouter>
  );
}