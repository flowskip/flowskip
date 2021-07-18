const baseUrl = "http://localhost:8000";
const redirect_url = "http://localhost:3000/redirect-from-api";
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

async function executeRequest(url, requestOptions, onResponse) {
  fetch(url, requestOptions)
    .then((res) => {
      responseCode = res.status;
      return res.json();
    })
    .then((data) => onResponse(data, responseCode))
    .catch((err) => new Error(fetchErrorMsg + err));
}

// session endpoints

export function startSession(onResponse, options = {}) {
  const endpoint = [baseUrl, userEndpoint, "session", "start"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );

  executeRequest(url, requestOptions, onResponse);
}

export function getSessionDetails(onResponse, options = {}) {
  const endpoint = [baseUrl, userEndpoint, "session", "details"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  executeRequest(url, requestOptions, onResponse);
}

// user endpoints

export function createUser(onResponse, options = {}) {
  const endpoint = [baseUrl, userEndpoint, "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );

  executeRequest(url, requestOptions, onResponse);
}

export function getUserDetails(onResponse, options = {}) {
  const endpoint = [baseUrl, userEndpoint, "details"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  executeRequest(url, requestOptions, onResponse);
}

// state endpoints
export function voteToSkip(body, onResponse, options = {}) {
  const endpoint = [baseUrl, roomEndpoint, "state", "vote-to-skip"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  executeRequest(url, requestOptions, onResponse);
}

export function calculateDeltas(body, onResponse, options = {}) {
  const endpoint = [baseUrl, roomEndpoint, "state"];
  const url = new URL(endpoint.join("/") + "/");
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("PATCH"),
    options
  );
  requestOptions.body = JSON.stringify(body);
  console.log(requestOptions);

  executeRequest(url, requestOptions, onResponse);
}

// participants endpoints

export function joinParticipant(body, onResponse, options = {}) {
  const endpoint = [baseUrl, roomEndpoint, "participants", "join"];
  let url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("POST"),
    options
  );
  requestOptions.body = JSON.stringify(body);

  executeRequest(url, requestOptions, onResponse);
}

export function leaveRoom(onResponse, options = {}) {
  const endpoint = [baseUrl, roomEndpoint, "participants", "leave"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("DELETE"),
    options
  );

  executeRequest(url, requestOptions, onResponse);
}

// room endpoints

export function createRoom(body, onResponse, options = {}) {
  const endpoint = [baseUrl, roomEndpoint, "create"];
  const url = new URL(endpoint.join("/"));
  let requestOptions = constructRequestOptionsWithAuth("POST");
  requestOptions.body = JSON.stringify(body);
  /*
  if (signal !== null) {
    requestOptions.signal = signal.signal;
  }
  */

  executeRequest(url, requestOptions, onResponse);
}

// spotify endpoints

export function getSpotifyAuthenticationUrl(onResponse, options = {}) {
  const endpoint = [baseUrl, spotifyEndpoint, "authenticate-user"];
  const params = {
    redirect_url: redirect_url,
  };
  const url = new URL(endpoint.join("/"));
  url.search = new URLSearchParams(params).toString();
  let requestOptions = Object.assign(
    constructRequestOptionsWithAuth("GET"),
    options
  );

  executeRequest(url, requestOptions, onResponse);
}
