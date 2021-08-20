import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { startSession, createUser } from "./FlowskipApi";
import RequiresSpotify from "./customRoutes/RequiresSpotify";

import Home from "../pages/Home";
import ConfigRoom from "../pages/ConfigRoom";
import RedirectFromApi from "./RedirectFromApi.js";
import Room from "../pages/Room";
import Loader from "./Loader";
import AppNotAuthorizedInSpotify from "./AppNotAuthorizedInSpotify";

import GlobalStyle from "../styles/GlobalStyle";

export default function App() {
  const defHasSession =
  localStorage.getItem("session_key") !== null ? true : false;
  const defHasUser = localStorage.getItem("user_created") === "true";
  const [hasSession, setHasSession] = useState(defHasSession);
  const [hasUser, setHasUser] = useState(defHasUser);

  useEffect(() => {
    if (!hasSession) {
      localStorage.clear();
      startSession(startSessionResponse);
    } else {
      if (localStorage.getItem("user_created") !== "true") {
        createUser(createUserResponse);
      }
    }
  }, [hasSession]);

  if (hasUser) {
    return loadRouter();
  } else {
    return (
      <React.Fragment>
        <GlobalStyle />
        {loadScreen()}
      </React.Fragment>
    );
  }

  function loadRouter() {
    return (
      <BrowserRouter>
        <GlobalStyle />
        <Switch>
          <Route exact path="/" component={Home} />
          <RequiresSpotify exact path="/config-room" component={ConfigRoom} />
          <Route exact path="/redirect-from-api" component={RedirectFromApi} />
          <Route exact path="/room/:room_code" component={Room} />
          <Route
            exact
            path="/spotify-not-authorized"
            component={AppNotAuthorizedInSpotify}
          />
        </Switch>
      </BrowserRouter>
    );
  }

  function loadScreen() {
    console.log("My load screen");
    return <Loader />;
  }

  function startSessionResponse(data, responseCode) {
    if (responseCode === 201 || responseCode === 208) {
      localStorage.setItem("session_key", data.session_key);
      setHasSession(true);
    }
  }

  function createUserResponse(data, responseCode) {
    if (responseCode === 201 || responseCode === 208) {
      localStorage.setItem("user_created", true);
      setHasUser(true);
    }
  }
}
