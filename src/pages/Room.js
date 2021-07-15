import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Button from "../components/Button";
import { leaveRoom } from "../components/FlowskipApi";

const defShowPlayer = true;
export default function Room() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);
  const history = useHistory();
  const windowPath = window.location.pathname.split("/");
  const roomCodeFromPath = windowPath[2] ? windowPath[2].toString() : undefined;

  if (roomCodeFromPath !== localStorage.getItem("room_code")) {
    if (localStorage.getItem("room_code") !== null) {
      history.push(localStorage.getItem("room_code"));
    }
  }

  return (
    <React.Fragment>{showMusicPlayer && renderMusicPlayer()}</React.Fragment>
  );

  function renderMusicPlayer() {
    return (
      <React.Fragment>
        <h1>Your code: {localStorage.getItem("room_code")}</h1>
        <br></br>
        <Button onClick={() => leavingRoom()}>Leave room</Button>
      </React.Fragment>
    );
  }

  function leavingRoom() {
    leaveRoom();
    localStorage.removeItem("room_code");
    history.push("/");
  }
}

// TODO Info to call room state
/*
  - setters-
  setTrackID,
  setCurrentPlayback,
  setParticipants,
  setNewParticipants,
  setGoneParticipants,
  setVotesToSkip,
  setNewVotesToSkip,
  setQueue,
  setNewQueueTracks,
  setGoneQueueTracks,
*/

/*
  Getters
  trackId,
  code,
  participants = [],
  votes = [],
  queue = []
*/
