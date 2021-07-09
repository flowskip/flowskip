import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from '../pages/home.js'
import { TestingApi } from './TestingApi.jsx';
// import Layout from './layout'
import ConfigRoom from '../pages/configroom.js'
import RedirectFromApi from './RedirectFromApi.jsx';

export default function App() {
  return (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/test-api" component={TestingApi} />
            <Route exact path="/config-room/:id" component={ConfigRoom} />
            <Route exact path="/redirect-from-api" component={RedirectFromApi}/>
        </Switch>
    </BrowserRouter>
  );
}