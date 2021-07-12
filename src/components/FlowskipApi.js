const baseUrl = "https://flowskip-api.herokuapp.com";
const redirect_url = "http://localhost:3000/redirect-from-api";
const userEndpoint = "user";
const roomEndpoint = "room";
const spotifyEndpoint = "spotify";

const apiDebugSearch = "API !=! ";
const fetchErrorMsg = apiDebugSearch + "failed to fetch api, reason ";

function constructRequestOptionsWithAuth(method) {
  let requestOptions = {};
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    "Bearer " + localStorage.getItem("session_key")
  );
  requestOptions.method = method;
  requestOptions.headers = headers;
  requestOptions.withCredentials = true;
  requestOptions.credentials = "include";
  return requestOptions;
}

// session endpoints
export function startSession(setFlag) {
  const endpoint = [baseUrl, userEndpoint, "session", "start"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("POST");

  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("session_key", data.session_key);
      setFlag(true);
    })
    .catch((err) => new Error(fetchErrorMsg + err));

  console.log(apiDebugSearch + "Getting session key");
}

// user endpoints
export function createUser(setUserCreated) {
  const endpoint = [baseUrl, userEndpoint, "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("POST");

  fetch(url, requestOptions)
    .then((res) => {
      if (res.status === 201) {
        console.log(apiDebugSearch + "user created");
        localStorage.setItem("user_created", true);
        setUserCreated(true);
      } else if (res.status === 208) {
        console.log(apiDebugSearch + "user already exists");
        localStorage.setItem("user_created", true);
        setUserCreated(true);
      } else {
        new Error(
          apiDebugSearch + "user not created, response = " + res.status
        );
      }
    })
    .catch((err) => new Error(fetchErrorMsg + err));
}

export function getUserDetails(setUserDetails) {
  const endpoint = [baseUrl, userEndpoint, "details"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("GET");

  console.log("getting user details");
  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setUserDetails(data);
    })
    .catch((err) => new Error(fetchErrorMsg + err));
}

// state endpoints
export function voteToSkip(setVoteStatus, code, trackId) {
  const endpoint = [baseUrl, roomEndpoint, "state", "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("POST");

  fetch(url, requestOptions)
    .then((res) => {
      if (res.status === 201) {
        setVoteStatus("created");
      } else if (res.status === 208) {
        setVoteStatus("reported");
      } else if (res.status === 410) {
        new Error(apiDebugSearch + "too late to vote");
        setVoteStatus("gone");
      } else if (res.status === 301) {
        new Error(apiDebugSearch + "theres a new song");
        setVoteStatus("moved");
      }
    })
    .catch((err) => new Error(fetchErrorMsg + err));
}

export function getDeltas(setters, states) {
  /*
    trackId,
    code,
    participants = [],
    votes = [],
    queue = []
  */
  const endpoint = [baseUrl, roomEndpoint, "state"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("PATCH");

  requestOptions.body = JSON.stringify({
    track_id: states["setTrackID"],
    code: states["code"],
    participants: states["participants"],
    votes: states["votes"],
    queue: states["queue"],
  });

  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      /*
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
      if (data.current_playback.item === undefined) {
        setters["setTrackID"]("");
      } else {
        setters["setTrackID"](data.current_playback.item.id);
      }
      setters["setCurrentPlayback"](data.current_playback);
      setters["setParticipants"](data.participants.all);
      setters["setNewParticipants"](data.participants.new);
      setters["setGoneParticipants"](data.participants.gone);
      setters["setVotesToSkip"](data.votes_to_skip.all);
      setters["setNewVotesToSkip"](data.votes_to_skip.new);
      setters["setQueue"](data.queue.all);
      setters["setNewQueueTracks"](data.queue.new);
      setters["setGoneQueueTracks"](data.queue.gone);
    })
    .catch((err) => new Error(fetchErrorMsg + err));
}

// room endpoints
export function createRoom(
  setRoomCodeInDb,
  signal = null,
  votesToSkip = 2,
  guestsCanPause = false
) {
  const endpoint = [baseUrl, roomEndpoint, "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("POST");
  requestOptions.body = JSON.stringify({
    votes_to_skip: votesToSkip,
    guests_can_pause: guestsCanPause,
  });
  if (signal !== null) {
    requestOptions.signal = signal.signal;
  }

  fetch(url, requestOptions)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log("200 ok");
        return res.json();
      } else if (res.status === 208) {
        console.log("already in room");
        return res.json();
      } else {
        console.log("error");
        return undefined;
      }
    })
    .then((data) => {
      console.log("data " + data.code);
      if (data === undefined) {
        new Error(apiDebugSearch + "Error reported by backend");
      } else {
        localStorage.setItem("room_code", data.code);
        setRoomCodeInDb(data.code);
      }
    })
    .catch((err) => {
      if (err.name === "AbortError") {
        console.log("Aborting");
      } else {
        console.log("error" + err);
      }
    });
}

export function leaveRoom() {
  const endpoint = [baseUrl, roomEndpoint, "participants", "leave"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("DELETE");

  fetch(url, requestOptions).catch((err) => {
    console.log("Error " + err);
  });
}

// spotify endpoints
export function getSpotifyAuthenticationUrl(setUrl) {
  const endpoint = [baseUrl, spotifyEndpoint, "authenticate-user"];
  const params = {
    redirect_url: redirect_url,
  };
  const url = new URL(endpoint.join("/"));
  url.search = new URLSearchParams(params).toString();
  let requestOptions = constructRequestOptionsWithAuth("GET");
  console.log("Getting url");
  console.log(localStorage.getItem("session_key"));

  fetch(url, requestOptions)
    .then((res) => {
      if (res.status === 208) {
        localStorage.setItem("spotify_authenticated", "true");
      }
      return res.json();
    })
    .then((data) => {
      if (data.authorize_url === undefined) {
        localStorage.removeItem("next");
        setUrl("208");
      } else {
        setUrl(data.authorize_url);
      }
    })
    .catch((err) => new Error(fetchErrorMsg + err));
}
