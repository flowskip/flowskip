import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";

const defShowPlayer = true;
export default function Room() {
  const history = useHistory();
  const windowPath = window.location.pathname.split("/");
  const roomCodeFromPath = windowPath[2] ? windowPath[2].toString() : undefined;
  const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);

  if (roomCodeFromPath !== localStorage.getItem("room_code")) {
    if (localStorage.getItem("room_code") !== null) {
      history.push(localStorage.getItem("room_code"));
    }
  }

  console.log(roomCodeFromPath);

  return (
    <React.Fragment>{showMusicPlayer && renderMusicPlayer()}</React.Fragment>
  );

  function renderMusicPlayer() {
    return <h1>Your code: {localStorage.getItem("room_code")}</h1>;
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
