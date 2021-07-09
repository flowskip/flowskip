const baseUrl = "https://flowskip-api.herokuapp.com";
const redirect_url = "http://localhost:3000/redirect-from-api";
const userEndpoint = "user";
const roomEndpoint = "room";
const spotifyEndpoint = "spotify";

const apiDebugSearch = "API !=! ";
const fetchErrorMsg = apiDebugSearch + "failed to fetch api, reason ";

let requestOptions = {}

// user -> session endpoints
export async function startSession(setFlag){
    const endpoint = [baseUrl, userEndpoint, "session", "start"];
    const url = new URL(endpoint.join("/"))
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ')
    requestOptions.method = "POST";
    requestOptions.headers = headers;
    
    fetch(url, requestOptions)
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('session_key', data.session_key);
        setFlag(true);
    })
    .catch(
        err => new Error(fetchErrorMsg + err)
    );

    console.log(apiDebugSearch + "Getting session key");
}

// user endpoints
export function createUser(setUserCreated){
    const endpoint = [baseUrl, userEndpoint, "create"];
    const url = new URL(endpoint.join("/"))
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"));
    requestOptions.method = "POST";
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';
    
    fetch(url, requestOptions)
    .then(res => {
        if (res.status === 201){
            console.log(apiDebugSearch + "user created");
            localStorage.setItem("user_created", true);
            setUserCreated(true)
        }
        else if (res.status === 208) {
            console.log(apiDebugSearch + "user already exists");
            localStorage.setItem("user_created", true);
            setUserCreated(true)
        }
        else{
            new Error(apiDebugSearch + "user not created, response = " + res.status);
        }
    }).catch
    (
        err => new Error(fetchErrorMsg + err)
    );
}

export function getUserDetails(setUserDetails){
    const endpoint = [baseUrl, userEndpoint, "details"];
    const url = new URL(endpoint.join("/"))
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"));
    requestOptions.method = "GET";
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';

    console.log("getting user details");
    fetch(url, requestOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setUserDetails(data);
    })
    .catch
    (
        err => new Error(fetchErrorMsg + err)
    );
}

// state endpoints
export function voteToSkip(setVoteStatus, code, trackId){
    const endpoint = [baseUrl, roomEndpoint, "state", "create"];
    const url = new URL(endpoint.join("/"));
    let headers = new Headers();
    requestOptions.body = JSON.stringify(
        {
            code: code,
            track_id: trackId
        }
    )
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"));
    requestOptions.method = "POST";
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';

    fetch(url, requestOptions)
    .then(res => {
        if (res.status === 201) {
            setVoteStatus('created');
        } else if (res.status === 208) {
            setVoteStatus('reported');
        } else if (res.status === 410) {
            new Error(apiDebugSearch + "too late to vote");
            setVoteStatus('gone');
        }
        else if (res.status === 301){
            new Error(apiDebugSearch + 'theres a new song');
            setVoteStatus('moved');
        }
    })
    .catch
    (
        err => new Error(fetchErrorMsg + err)
    );
}

export function getDeltas(setTrackID, setCurrentPlayback, setParticipants, setNewParticipants, setGoneParticipants, setVotesToSkip, setNewVotesToSkip, setQueue, setNewQueueTracks, setGoneQueueTracks, trackId, code, participants = [], votes = [],queue = []){
    const endpoint = [baseUrl, roomEndpoint, "state"];
    const url = new URL(endpoint.join("/"));
    let headers = new Headers();
    requestOptions.body = JSON.stringify(
        {
            code: code,
            track_id: trackId,
            participants: participants,
            votes: votes,
            queue: queue
        }
    )
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"));
    requestOptions.method = "PATCH";
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';

    fetch(url, requestOptions)
    .then(res => res.json())
    .then(data => {
        if(data.current_playback !== {}){
            setTrackID(data.current_playback.item.id);
        }
        else{
            setTrackID("");
        }
        setCurrentPlayback(data.current_playback);
        setParticipants(data.participants.all);
        setNewParticipants(data.participants.new);
        setGoneParticipants(data.participants.gone);
        setVotesToSkip(data.votes_to_skip.all);
        setNewVotesToSkip(data.votes_to_skip.new);
        setQueue(data.queue.all);
        setNewQueueTracks(data.queue.new);
        setGoneQueueTracks(data.queue.gone);
    })
    .catch
    (
        err => new Error(fetchErrorMsg + err)
    );
}

// room endpoints
export async function createRoom(setCode, votes_to_skip = 2, guests_can_pause = false){
    const endpoint = [baseUrl, roomEndpoint, "create"];
    const url = new URL(endpoint.join("/"));
    requestOptions.body = JSON.stringify(
        {
            votes_to_skip: votes_to_skip,
            guests_can_pause: guests_can_pause
        }
    )
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"));
    requestOptions.method = "GET";
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';

    fetch(url, requestOptions)
    .then(res => {
        if (res.status === 200){
            return res.json();
        }
        else if (res.status === 208) {
            console.log("already in room");
            return res.json();
        } else {
            return {};
        }
    })
    .then(data => {
        if (data === {}){
            new Error(apiDebugSearch + "Error reported by backend");
        }
        else{
            localStorage.setItem("room_code", data.code);
            setCode(data.code);
        }
    })
    .catch(
        err => new Error(fetchErrorMsg + err)
    );
}

// spotify endpoints
export async function getSpotifyAuthenticationUrl(setUrl){
    const endpoint = [baseUrl, spotifyEndpoint, "authenticate-user"];
    const params = {
        redirect_url: redirect_url
    }
    const url = new URL(endpoint.join("/"));
    url.search = new URLSearchParams(params).toString();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"));
    requestOptions.method = "GET";
    requestOptions.headers = headers;
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';
    console.log("Getting url");
    fetch(url, requestOptions)
    .then(res => res.json())
    .then(data => {
        setUrl(data.authorize_url);
    })
    .catch(
        err => new Error(fetchErrorMsg + err)
    ); 
}
