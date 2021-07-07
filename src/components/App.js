import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from '../pages/home.js'
// import Layout from './layout'

export default function App() {
  return (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
        </Switch>
    </BrowserRouter>
  );
}