let flowskipBaseUrl;
let redirect_url;
if(process.env.NODE_ENV === "development"){
  flowskipBaseUrl = process.env.REACT_APP_DEV_FLOWSKIP_API_BASE_URL;
  redirect_url = process.env.REACT_APP_DEV_REDIRECT_FROM_API;
} else{
  flowskipBaseUrl = process.env.REACT_APP_PROD_FLOWSKIP_API_BASE_URL;
  redirect_url = process.env.REACT_APP_PROD_REDIRECT_FROM_API;
}
const userEndpoint = "user";
const roomEndpoint = "room";
const spotifyEndpoint = "spotify";

const apiDebugSearch = "API !=! ";
const fetchErrorMsg = apiDebugSearch + "failed to fetch api, reason ";
let responseCode = 500;

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

async function executeRequest(
  url,
  requestOptions,
  onResponse,
  onCatch = null,
  onFinally = null
) {
  return fetch(url, requestOptions)
    .then((res) => {
      responseCode = res.status;
      if (responseCode !== 204) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (data === null) {
        return onResponse(null, responseCode);
      } else {
        return onResponse(data, responseCode);
      }
    })
    .catch((err) => {
      if (onCatch !== null) {
        onCatch(err);
      } else {
        console.error(fetchErrorMsg + err);
        localStorage.clear();
        window.location.href = "/";
      }
    })
    .finally(() => {
      if (onFinally !== null) {
        onFinally();
      }
    });
}

// session endpoints

export function startSession(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, userEndpoint, "session", "start"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function getSessionDetails(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, userEndpoint, "session", "details"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function deleteSession(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, userEndpoint, "session", "delete"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("DELETE"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

// user endpoints

export function createUser(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, userEndpoint, "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function getUserDetails(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, userEndpoint, "details"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function deleteUser(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, userEndpoint, "delete"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("DELETE"),
    options
  );
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

// participants endpoints

export function joinRoom(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "participants", "join"];
  let url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function leaveRoom(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "participants", "leave"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("DELETE"),
    options
  );
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

// state endpoints

export function voteToSkip(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "state", "vote-to-skip"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function calculateDeltas(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "state"];
  const url = new URL(endpoint.join("/") + "/");
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("PATCH"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function getTracks(
  roomCode,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "state", "tracks"];
  const params = {
    code: roomCode,
  };
  const url = new URL(endpoint.join("/"));
  url.search = new URLSearchParams(params).toString();
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function addTrackToQueue(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "state", "add-to-queue"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("PUT"),
    options
  );
  requestOptions.body = JSON.stringify(body);
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function toggleIsPlaying(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "state", "toggle-is-playing"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("PUT"),
    options
  );
  requestOptions.body = JSON.stringify(body);
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

// room endpoints

export function createRoom(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function getRoomDetails(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "details"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function updateRoom(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, roomEndpoint, "update"];
  const url = new URL(endpoint.join("/") + "/");
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("PATCH"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

// spotify endpoints

export function getSpotifyAuthenticationUrl(
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
) {
  const endpoint = [flowskipBaseUrl, spotifyEndpoint, "authenticate-user"];
  const params = {
    redirect_url: redirect_url,
  };
  const url = new URL(endpoint.join("/"));
  url.search = new URLSearchParams(params).toString();
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function createPlaylist(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
){
  const endpoint = [flowskipBaseUrl, spotifyEndpoint, "api", "playlist-create"];
  const url = new URL(endpoint.join("/"));

  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function addItemsToPlaylist(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
){
  const endpoint = [flowskipBaseUrl, spotifyEndpoint, "api", "playlist-add-items"];
  const url = new URL(endpoint.join("/"));

  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function uploadPlaylistCover(
  body,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
){
  const endpoint = [flowskipBaseUrl, spotifyEndpoint, "api", "playlist-upload-cover-image"];
  const url = new URL(endpoint.join("/"));

  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}


export function search(
  params,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
){
  const endpoint = [flowskipBaseUrl, spotifyEndpoint, "api", "search"];
  const url = new URL(endpoint.join("/"));
  url.search = new URLSearchParams(params).toString();

  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

export function listAllFeaturedPlaylists(
  params,
  onResponse,
  options = {},
  onCatch = null,
  onFinally = null
){
  const endpoint = [flowskipBaseUrl, spotifyEndpoint, "api", "all-featured-playlists"];
  const url = new URL(endpoint.join("/"));
  url.search = new URLSearchParams(params).toString();
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );
  return executeRequest(url, requestOptions, onResponse, onCatch, onFinally);
}

// utils

export function imageToBase64(url, callback) {
  /*
  Accepts an image url and converts it to base 64 string.
  params:
  url: image url
  callback: callback function where you can access to the result in the first parameter
  */
	var xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.onload = function () {
		var reader = new FileReader();
    var result = reader.result;
    if(! result.includes("data:image/jpeg;base64,")){
      console.warn("This is not a jpeg image, spotify only allows jpeg images");
    }
    result.replace("data:image/jpeg;base64,", "")
		reader.onloadend = function () {
			callback(result);
		};
		reader.readAsDataURL(xhr.response);
	};
	xhr.open("GET", url);
	xhr.send();
}