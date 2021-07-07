import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from '../pages/home.js'
import { TestingApi } from './TestingApi.jsx';
// import Layout from './layout'

export default function App() {
  return (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/test-api" component={TestingApi} />
        </Switch>
    </BrowserRouter>
  );
}