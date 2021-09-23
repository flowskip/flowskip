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
import Help from "../pages/Help";

import GlobalStyle from "../styles/GlobalStyle";
import { Fragment } from "react/cjs/react.production.min";

export default function App() {
	const defHasSession = localStorage.getItem("session_key") !== null ? true : false;
	const defHasUser = localStorage.getItem("user_created") === "true";
	const [hasSession, setHasSession] = useState(defHasSession);
	const [hasUser, setHasUser] = useState(defHasUser);
	const [showErrorPage, setShowErrorPage] = useState(false);

	useEffect(() => {
		if (!hasSession) {
			localStorage.clear();
			startSession(startSessionResponse, {}, function(err){
				setShowErrorPage(true);
			});
		} else {
			if (localStorage.getItem("user_created") !== "true") {
				createUser(createUserResponse);
			}
		}

		return function cleanup() {
			return null;
		};
	}, [hasSession]);

	if(showErrorPage){
		return (
			<React.Fragment>
				<GlobalStyle />
				{errorScreen()}
			</React.Fragment>
		);
	}

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
					<Route exact path="/spotify-not-authorized" component={AppNotAuthorizedInSpotify} />
					<Route exact path="/help" component={Help} />
				</Switch>
			</BrowserRouter>
		);
	}

	function loadScreen() {
		console.log("My load screen");
		return <Loader />;
	}

	function errorScreen() {
		console.error("critical: maybe api is down!");
		return (
		<Fragment>
			<p>Sorry, this app is currently unavailable</p>
		</Fragment>
		);
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
