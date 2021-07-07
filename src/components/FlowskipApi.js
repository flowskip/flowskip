const baseUrl = "http://127.0.0.1:8000";
const redirect_url = "http://localhost:3000";
const userEndpoint = "user";
const roomEndpoint = "room";
const spotifyEndpoint = "spotify";

const apiDebugSearch = "API !=! ";
const fetchErrorMsg = apiDebugSearch + "failed to fetch api, reason ";

// user -> session endpoints
export async function sessionStartSession(setFlag){
    const endpoint = [baseUrl, userEndpoint, "session", "start"];
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ')
    myHeaders.append('Content-Type', 'application/json')
    let requestOptions = {
        method: "POST",
        headers: myHeaders,
    }
    
    fetch(endpoint.join("/"), requestOptions)
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('session_key', data.session_key);
        setFlag(true);
    })
    .catch(err => new Error(fetchErrorMsg + err));

    console.log(apiDebugSearch + "Getting session key");
}

// user endpoints
export function userCreate(setUserCreated){
    const endpoint = [baseUrl, userEndpoint, "create"];
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"))
    myHeaders.append('Content-Type', 'application/json')
    let requestOptions = {
        method: "POST",
        headers: myHeaders,
    }
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';
    
    fetch(endpoint.join("/"), requestOptions)
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

// spotify endpoints
export async function spotifyAuthenticateUser(setUrl){
    const endpoint = [baseUrl, spotifyEndpoint, "authenticate-user"];
    const params = {
        redirect_url: redirect_url
    }
    const url = new URL(endpoint.join("/"))
    url.search = new URLSearchParams(params).toString()
    
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem("session_key"))
    myHeaders.append('Content-Type', 'application/json')
    let requestOptions = {
        method: "GET",
        headers: myHeaders,
    }
    requestOptions.withCredentials = true;
    requestOptions.credentials = 'include';
    requestOptions.method = "GET";

    fetch(url, requestOptions)
    .then(res => res.json())
    .then(data => {
        setUrl(data.authorize_url);
    });
    
}
