import React, { useState, useEffect } from "react";
import { createUser } from "./FlowskipApi";
import { getSpotifyAuthenticationUrl } from "./FlowskipApi";
import { startSession } from "./FlowskipApi";

const defUrl = "myhome.com";
const isSessionKeyInDb = localStorage.getItem("session_key") !== null;
const isUserCreated = localStorage.getItem("user_created") === "true";
export function TestingApi() {
  const [sessionKeyInDb, setSessionKeyInDb] = useState(isSessionKeyInDb);
  const [userCreated, setUserCreated] = useState(isUserCreated);
  const [url, setUrl] = useState(defUrl);
  useEffect(() => {
    if (!sessionKeyInDb) {
      console.log("getting session_key");
      startSession(setSessionKeyInDb);
    } else {
      if (!userCreated) {
        console.log("creating user");
        createUser(setUserCreated);
      } else {
        // Here all the code to be done with a user
        console.log("getting auth url");
        getSpotifyAuthenticationUrl(setUrl);
      }
    }
  }, [sessionKeyInDb, userCreated]);

  return (
    <div>
      <h3>
        <a href={url}>{url}</a>
      </h3>
    </div>
  );
}
