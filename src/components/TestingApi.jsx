import React, { useState, useEffect } from 'react';
import { userCreate } from './FlowskipApi';
import { spotifyAuthenticateUser } from './FlowskipApi';
import { sessionStartSession } from './FlowskipApi';

const defUrl = "myhome.com";
const isSessionKeyInDb = localStorage.getItem('session_key') !== null;
const isUserCreated = localStorage.getItem('user_created') === 'true';
export function TestingApi(){
    const [sessionKeyInDb, setSessionKeyInDb] = useState(isSessionKeyInDb);
    const [userCreated, setUserCreated] = useState(isUserCreated);
    const [url, setUrl] = useState(defUrl);
    useEffect(()=>{
        if(!sessionKeyInDb){
            console.log("getting session_key");
            sessionStartSession(setSessionKeyInDb)
        }
        else{
            if(!userCreated){
                console.log("creating user");
                userCreate(setUserCreated);
            }
            else{
                // Here all the code to be done with a user
                console.log("getting auth url");
                spotifyAuthenticateUser(setUrl);
            }
        }
    }, [sessionKeyInDb, userCreated]);
    
    return(
        <div>
            <h3><a href={url}>{url}</a></h3>
        </div>
    )
}