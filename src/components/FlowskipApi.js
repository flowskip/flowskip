const baseUrl = "https://flowskip-api.herokuapp.com";
const userEndpoint = "user";
const roomEndpoint = "room";
const spotifyEndpoint = "spotify";

function SessionStartSession(){
    if( !localStorage.getItem('session_key') ){
        const endpoint = [baseUrl, userEndpoint, "session", "start"];
        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
        };
        fetch(endpoint.join("/"), requestOptions).
        then(res => res.json()).
        then(data => localStorage.setItem());
    }
}