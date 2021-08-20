import React from "react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import {
  leaveRoom,
  joinRoom,
  calculateDeltas,
  getRoomDetails,
  getTracks,
} from "../components/FlowskipApi";
import MusicPlayer from "../components/MusicPlayer";
import Loader from "../components/Loader";

const defTrackId = "";
const defCurrentPlayback = {};
const defParticipants = {
  all: [],
  gone: [],
  new: [],
};
const defVotesToSkip = {
  all: [],
  gone: [],
};
const defQueue = {
  all: [],
  new: [],
};
const defTracks = {
  recommended_tracks: [],
  success_tracks: [],
  queue_tracks: [],
};
const defRoomDetails = null;

const defShowPlayer = false;
export default function Room() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);
  const [, setDeltas] = useState(null);
  const trackId = useRef(defTrackId);
  const oldTrackId = useRef(defTrackId);
  const roomDetails = useRef(defRoomDetails);
  const tracks = useRef(defTracks);
  const currentPlayback = useRef(defCurrentPlayback);
  const participants = useRef(defParticipants);
  const votesToSkip = useRef(defVotesToSkip);
  const queue = useRef(defQueue);
  //const [queue, setQueue] = useState(defQueue);

  const windowPath = window.location.pathname.split("/");
  const roomCodeFromPath = useRef(
    windowPath[2] ? windowPath[2].toString() : null
  );
  const history = useHistory();
  const interval = useRef(null);

  useEffect(() => {
    interval.current = setInterval(updateState, 1000);
    if (roomDetails.current === null) {
      updateRoomDetails();
    }
    return function cleanup() {
      clearInterval(interval.current);
    };
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

  function updateProps(data) {
    if (data.current_playback.item === undefined) {
      trackId.current = "";
    } else {
      trackId.current = data.current_playback.item.id;
    }
    currentPlayback.current = data.current_playback;
    participants.current = data.participants;
    votesToSkip.current = data.votes_to_skip;
  }

  function updateState() {
    let actualState = {
      track_id: trackId.current,
      code: roomCodeFromPath.current,
      participants: participants.current.all,
      votes: votesToSkip.current.all,
      queue: queue.current.all,
    };
    function calculateDeltasResponse(data, responseCode) {
      if (responseCode === 200) {
        updateProps(data);
        setDeltas(data);
        if (!showMusicPlayer) {
          setShowMusicPlayer(true);
        }
      } else if (responseCode === 400) {
        console.log(data);
      } else if (responseCode === 404) {
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

    function getTracksResponse(data, responseCode) {
      if (responseCode === 200) {
        tracks.current = data;
      } else {
        console.warn("No tracks obtained, data: ", data);
      }
    }
    getRoomDetails(getRoomDetailsResponse);
    getTracks(localStorage.getItem("room_code"), getTracksResponse);
  }

  function renderMusicPlayer() {
    return (
      <MusicPlayer
        currentPlayback={currentPlayback.current}
        participants={participants.current}
        votesToSkip={votesToSkip.current}
        queue={queue.current}
        roomDetails={roomDetails.current}
        tracks={tracks.current}
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
