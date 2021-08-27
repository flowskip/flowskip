import React from "react";
import { Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSpotifyAuthenticationUrl } from "../FlowskipApi";
import Loader from "../Loader";

const defIsLoggedIn =
  localStorage.getItem("spotify_authenticated") === "true" ? true : false;
const RequiresSpotify = ({ component: Component, ...rest }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(defIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      getSpotifyAuthenticationUrl(getSpotifyAuthenticationUrlResponse);
    }
  }, [isLoggedIn]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : loadingPage()
      }
    />
  );

  function loadingPage() {
    return <Loader />;
  }

  function getSpotifyAuthenticationUrlResponse(data, responseCode) {
    if (responseCode === 208) {
      localStorage.setItem("spotify_authenticated", "true");
      setIsLoggedIn(true);
    } else if (responseCode === 200) {
      window.open(data.authorize_url, "_self");
    }
  }
};

export default RequiresSpotify;
