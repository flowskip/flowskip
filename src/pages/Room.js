import React from "react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import {
  leaveRoom,
  joinRoom,
  calculateDeltas,
  getRoomDetails,
} from "../components/FlowskipApi";
import MusicPlayer from "../components/MusicPlayer";
import Loader from "../components/Loader";

const defTrackId = "";
const defCurrentPlayback = {};
const defParticipants = [];
const defVotesToSkip = [];
const defQueue = [];
const defRoomDetails = null;

const defShowPlayer = false;
export default function Room() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);
  const trackId = useRef(defTrackId);
  const oldTrackId = useRef(defTrackId);
  const roomDetails = useRef(defRoomDetails);
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
      }
      setCurrentPlayback(deltas.current_playback);
      setParticipants(deltas.participants);
      setVotesToSkip(deltas.votes_to_skip);
      setQueue(deltas.queue);
    }
  }, [deltas]);

  useEffect(() => {
    if (roomDetails.current === null) {
      updateRoomDetails();
    }
  }, []);

  if (roomCodeFromPath.current !== localStorage.getItem("room_code")) {
    localStorage.setItem("room_code", roomCodeFromPath.current);
  }

  return (
    <React.Fragment>
      {showMusicPlayer && renderMusicPlayer()}
      {!showMusicPlayer && <Loader />}
    </React.Fragment>
  );

  function updateState() {
    let actualState = {
      track_id: trackId.current,
      code: roomCodeFromPath.current,
      participants: participants,
      votes: votesToSkip,
      queue: queue,
    };
    function calculateDeltasResponse(data, responseCode) {
      if (responseCode === 200) {
        setDeltas(data);
        setShowMusicPlayer(true);
      } else if (responseCode === 400) {
        console.log(data);
      } else if (responseCode === 404) {
        localStorage.removeItem("room_code");
        alert("This room doesn't exists");
        localStorage.removeItem("room_code");
        localStorage.removeItem("spotify_authenticated");
        history.push("/");
      } else if (responseCode === 500) {
        console.log(data);
      }
    }
    if (trackId.current !== oldTrackId.current) {
      console.log("track id changed");
      localStorage.setItem("track_id", trackId.current);
      oldTrackId.current = trackId.current;
      updateRoomDetails();
    }
    calculateDeltas(actualState, calculateDeltasResponse);
  }

  function joinRoomFromCodeInPath() {
    function joinRoomResponse(data, responseCode) {
      // handle http responseCode
      if (responseCode === 201) {
        updateRoomDetails();
      } else {
        localStorage.clear();
        // history.push("/");
      }
    }
    let data = {
      code: roomCodeFromPath.current,
    };
    joinRoom(data, joinRoomResponse);
  }

  function updateRoomDetails() {
    function getRoomDetailsResponse(data, responseCode) {
      if (responseCode === 200) {
        roomDetails.current = data;
      } else if (responseCode === 403) {
        if (data.detail === "user not in room") {
          joinRoomFromCodeInPath();
        }
      }
      // logic to update the room details if apply
    }
    getRoomDetails(getRoomDetailsResponse);
  }

  function renderMusicPlayer() {
    return (
      <MusicPlayer
        currentPlayback={currentPlayback}
        participants={participants}
        votesToSkip={votesToSkip}
        queue={queue}
        roomDetails={roomDetails.current}
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
}
