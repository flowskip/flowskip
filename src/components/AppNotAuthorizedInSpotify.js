import React from "react";
import Button from "./Button";
import { useHistory } from "react-router";

export default function AppNotAuthorizedInSpotify() {
  const history = useHistory();

  return (
    <React.Fragment>
      <h1>
        We need your permission to link Spotify to this App and get full
        functionality.
      </h1>
      <h2>You still can </h2>
      <Button onClick={() => joinRoom()}>Join to a Room</Button>.
      <br /> <br />
      <h3>
        Learn what information we store and how we use it by reading our
        <a href="/#" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
        <br />
        <br />
        <Button onClick={() => history.push("/")}>Back</Button>
      </h3>
    </React.Fragment>
  );

  function joinRoom() {
    history.push("/");
  }
}
