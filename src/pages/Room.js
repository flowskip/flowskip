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

const defShowPlayer = true;
export default function Room() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);
  const [trackId, setTrackId] = useState(defTrackId);
  const [currentPlayback, setCurrentPlayback] = useState(defCurrentPlayback);
  const [roomCode, setRoomCode] = useState(
    localStorage.getItem("room_code") === null
      ? ""
      : localStorage.getItem("room_code")
  );
  const [participants, setParticipants] = useState(defParticipants);
  const [votesToSkip, setVotesToSkip] = useState(defVotesToSkip);
  const [queue, setQueue] = useState(defQueue);
  const [deltas, setDeltas] = useState(null);

  const windowPath = window.location.pathname.split("/");
  const roomCodeFromPath = windowPath[2] ? windowPath[2].toString() : undefined;
  const history = useHistory();
  const interval = useRef(null);

  useEffect(() => {
    interval.current = setInterval(updateState, 1000);
    localStorage.setItem("track_id", trackId);
    return function cleanup() {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (deltas !== null) {
      if (deltas.current_playback.item === undefined) {
        setTrackId("");
      } else {
        setTrackId(deltas.current_playback.item.id);
      }
      setCurrentPlayback(deltas.current_playback);
      setParticipants(deltas.participants);
      setVotesToSkip(deltas.votes);
      setQueue(deltas.queue);
    }
  }, [deltas]);

  function updateState() {
    let actualState = {
      track_id: trackId,
      code: roomCode,
      participants: participants,
      votes: votesToSkip,
      queue: queue,
    };
    calculateDeltas(actualState, calculateDeltasResponse);
  }

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
    }
  }
}
