import React from "react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { leaveRoom, calculateDeltas } from "../components/FlowskipApi";
import MusicPlayer from "../components/MusicPlayer";
import Loader from "../components/Loader";

const defTrackId = "";
const defCurrentPlayback = {};
const defParticipants = [];
const defVotesToSkip = [];
const defQueue = [];

const defShowPlayer = false;
export default function Room() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);
  const trackId = useRef(defTrackId);
  const oldTrackId = useRef(defTrackId);
  const [currentPlayback, setCurrentPlayback] = useState(defCurrentPlayback);
  const [participants, setParticipants] = useState(defParticipants);
  const [votesToSkip, setVotesToSkip] = useState(defVotesToSkip);
  const [queue, setQueue] = useState(defQueue);
  const [deltas, setDeltas] = useState(null);

  const windowPath = window.location.pathname.split("/");
  const roomCodeFromPath = useRef(
    windowPath[2] ? windowPath[2].toString() : null
  );
  const history = useHistory();
  const interval = useRef(null);

  useEffect(() => {
    interval.current = setInterval(updateState, 1000);
    return function cleanup() {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (deltas !== null) {
      if (deltas.current_playback.item === undefined) {
        trackId.current = "";
      } else {
        trackId.current = deltas.current_playback.item.id;
        console.log(deltas.current_playback.item.id);
      }
      setCurrentPlayback(deltas.current_playback);
      setParticipants(deltas.participants);
      setVotesToSkip(deltas.votes);
      setQueue(deltas.queue);
    }
  }, [deltas]);

  function updateState() {
    let actualState = {
      track_id: trackId.current,
      code: roomCodeFromPath.current,
      participants: participants,
      votes: votesToSkip,
      queue: queue,
    };
    if (trackId.current !== oldTrackId.current) {
      console.log("track id changed");
      localStorage.setItem("track_id", trackId.current);
      oldTrackId.current = trackId.current;
      // do something here
    }
    calculateDeltas(actualState, calculateDeltasResponse);
  }

  if (roomCodeFromPath.current !== localStorage.getItem("room_code")) {
    localStorage.setItem("room_code", roomCodeFromPath.current);
  }

  return (
    <React.Fragment>
      {showMusicPlayer && renderMusicPlayer()}
      {!showMusicPlayer && <Loader />}
    </React.Fragment>
  );

  function renderMusicPlayer() {
    return (
      <MusicPlayer
        currentPlayback={currentPlayback}
        participants={participants}
        votesToSkip={votesToSkip}
        queue={queue}
      />
    );
  }

  function leaveButtonRequest() {
    clearInterval(interval.current);
    leaveRoom(leaveRoomResponse);
    return <Loader />;
  }

  function leaveRoomResponse(data, responseCode) {
    console.log(responseCode);
    localStorage.removeItem("room_code");
    history.push("/");
    if (responseCode === 200) {
      console.log("Everything ok");
    } else if (responseCode === 404) {
      console.log("Room doesn't exist");
    } else {
      console.log("Leave room with problem");
    }
  }

  function calculateDeltasResponse(data, responseCode) {
    if (responseCode === 200) {
      setDeltas(data);
      setShowMusicPlayer(true);
    } else if (responseCode === 400) {
      console.log(data);
    } else if (responseCode === 404) {
      localStorage.removeItem("room_code");
      alert("This room doesn't exists");
      history.push("/");
    } else if (responseCode === 500) {
      console.log(data);
    }
  }
}
