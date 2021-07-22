import React from "react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import Button from "../components/Button";
import { leaveRoom, calculateDeltas } from "../components/FlowskipApi";

const defTrackId = "";
const defCurrentPlayback = {};
const defParticipants = [];
const defNewParticipants = [];
const defGoneParticipants = [];
const defVotesToSkip = [];
const defNewVotesToSkip = [];
const defQueue = [];
const defNewQueue = [];
const defGoneQueue = [];

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
  const [newParticipants, setNewParticipants] = useState(defNewParticipants);
  const [goneParticipants, setGoneParticipants] = useState(defGoneParticipants);
  const [votesToSkip, setVotesToSkip] = useState(defVotesToSkip);
  const [newVotesToSkip, setNewVotesToSkip] = useState(defNewVotesToSkip);
  const [queue, setQueue] = useState(defQueue);
  const [newQueue, setNewQueue] = useState(defNewQueue);
  const [goneQueue, setGoneQueue] = useState(defGoneQueue);
  const [deltas, setDeltas] = useState(null);

  const windowPath = window.location.pathname.split("/");
  const roomCodeFromPath = windowPath[2] ? windowPath[2].toString() : undefined;
  const history = useHistory();
  const interval = useRef(null);

  useEffect(() => {
    interval.current = setInterval(updateState, 2000);
  }, []);

  useEffect(() => {
    console.log(deltas);
    if (deltas !== null) {
      if (deltas.current_playback.item === undefined) {
        setTrackId("");
      } else {
        setTrackId(deltas.current_playback.item.id);
      }
      setCurrentPlayback(deltas.current_playback);
      setParticipants(deltas.participants.all);
      setNewParticipants(deltas.participants.new);
      setGoneParticipants(deltas.participants.gone);
      setVotesToSkip(deltas.votes.all);
      setNewVotesToSkip(deltas.votes.new);
      setQueue(deltas.queue.all);
      setNewQueue(deltas.queue.new);
      setGoneQueue(deltas.queue.gone);
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
      <React.Fragment>
        <h1>Your code: {localStorage.getItem("room_code")}</h1>
        <br></br>
        <Button onClick={() => leaveButtonRequest()}>Leave room</Button>
        <h1>
          {currentPlayback.item === undefined
            ? "Start a song"
            : currentPlayback.item.name}
        </h1>
        <h1>
          {currentPlayback.item === undefined
            ? "In Spotify"
            : currentPlayback.item.album.name}
        </h1>
        <img
          alt="logo"
          src={
            currentPlayback.item === undefined
              ? "https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png"
              : currentPlayback.item.album.images[1].url
          }
        />
        <h1>
          {participants.length !== 0 ? participants[0].display_name : "Anonimo"}
        </h1>
      </React.Fragment>
    );
  }

  function leaveButtonRequest() {
    clearInterval(interval.current);
    leaveRoom(leaveRoomResponse);
    // loading screen here
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
