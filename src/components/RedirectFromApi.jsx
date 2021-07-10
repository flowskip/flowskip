import React from "react";
// import { useEffect} from "react";
import { useHistory } from "react-router";

export default function RedirectFromApi() {
  console.log("loading");
  const showWaitMessage = true;
  const next = localStorage.getItem("next");
  const windowParams = new URL(window.location.href);
  const sessionKeyFromParams = windowParams.searchParams
    .get("session_key")
    .toString();
  const statusFromParams = windowParams.searchParams.get("status").toString();
  const history = useHistory();
  if (localStorage.getItem("session_key") !== sessionKeyFromParams) {
    localStorage.setItem("session_key", sessionKeyFromParams);
  }

  localStorage.removeItem("next");
  if (statusFromParams === "401") {
    history.push("/");
  } else if (statusFromParams === "200") {
    localStorage.setItem("spotify_authenticated", "true");
    history.push(next);
  } else {
    history.push("error");
  }

  return (
    <React.Fragment>{showWaitMessage && <h2>please wait</h2>}</React.Fragment>
  );
}
