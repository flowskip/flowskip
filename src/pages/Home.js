import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import {
  startSession,
  createUser,
  getSpotifyAuthenticationUrl,
} from "../components/FlowskipApi";

import Button from "../components/Button";

import LogoImg from "../assets/img/logo.png";

const defUrl = "";
const defIsAlreadyAuthenticatedInSpotify = false;
const isSessionKeyInDbAtStart = localStorage.getItem("session_key") !== null;
const isUserCreatedAtStart = localStorage.getItem("user_created") === "true";

export default function Home() {
  const [sessionKeyInDb, setSessionKeyInDb] = useState(isSessionKeyInDbAtStart);
  const [userCreated, setUserCreated] = useState(isUserCreatedAtStart);
  const [url, setUrl] = useState(defUrl);
  const [isAlreadyAuthenticatedInSpotify, setIsAlreadyAuthenticatedInSpotify] =
    useState(defIsAlreadyAuthenticatedInSpotify);
  const history = useHistory();
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
        console.log("blank");
      }
    }
  }, [sessionKeyInDb, userCreated]);

  useEffect(() => {
    if (url === "208") {
      setIsAlreadyAuthenticatedInSpotify(true);
    } else if (url !== "") {
      window.open(url, "_self");
    }
  }, [url]);

  if (localStorage.getItem("room_code") !== null) {
    // ? Comment to avoid auto redirect if there's a room code in local storage
    console.log("Room code in LocalStorage!");
    history.push("room/" + localStorage.getItem("room_code"));
  }
  if (isAlreadyAuthenticatedInSpotify) goToConfigRoom();

  return (
    <React.Fragment>
      <MainContainer>
        <LogoContainer>
          <Logo src={LogoImg} alt="Logo" />
        </LogoContainer>
        <CenterSection>
          <Title>¡Bienvenido!</Title>
          <Form action="">
            <InputText type="text" placeholder="Código" />
            <InputSubmit type="submit" value="&#9654;" />
          </Form>
          <Button onClick={() => verifySpotifyAuth()}>Nueva Sala</Button>
        </CenterSection>
      </MainContainer>
    </React.Fragment>
  );

  function goToConfigRoom() {
    history.push("config-room");
  }

  function verifySpotifyAuth() {
    console.log("CLICK!");
    if (localStorage.getItem("spotify_authenticated") === "true") {
      console.log("go to config-room");
      history.push("config-room");
    } else {
      localStorage.setItem("next", "config-room");
      getSpotifyAuthenticationUrl(setUrl);
    }
  }
}

const MainContainer = styled.main`
  padding: 15vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 50% 50%;

  @media screen and (orientation: landscape) and (max-width: 900px) {
    padding: 5vw 10vw;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 50% 50%;
    place-items: center center;
  }

  @media screen and (min-width: 1024px) {
    padding: 5vw 0 0;
    height: 100vh;
    display: grid;
    grid-template-rows: 50% 50%;
  }

  @media screen and (min-width: 1024px) and (orientation: portrait) {
    padding: 15vw;
    height: 100vh;
    display: grid;
    grid-template-rows: 50% 50%;
  }
`;

const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 100%;
  max-width: 300px;

  @media screen and (orientation: landscape) and (max-width: 900px) {
    padding: 0 10vw 0 0;
  }
`;

const CenterSection = styled.section`
  display: grid;
  grid-template-rows: 30% 30% 30%;
  place-items: center center;
  max-height: 300px;

  @media screen and (orientation: landscape) and (max-width: 900px) {
    height: 80%;
  }

  @media screen and (min-width: 1024px) and (orientation: portrait) {
    .main__container {
      grid-template-rows: 20% 20% 20% 40%;
      place-items: center center;
    }

    @media screen and (min-width: 1024px) and (orientation: landscape) {
      max-height: 400px;
    }
  }
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(2.5rem, 8vw, 4rem);
  text-align: center;
  font-family: var(--font-bungee-bold);

  @media screen and (orientation: landscape) and (max-width: 900px) {
    font-size: clamp(2.5rem, 8vh, 4rem);
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 70% 30%;
`;

const InputText = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 10px;
  border-radius: 10px;
  font-size: 1.8rem;
  text-align: center;

  &:focus {
    outline: none;
  }

  &:active {
    outline: none;
  }

  &:hover {
    outline: none;
  }
`;

const InputSubmit = styled.input`
  width: 50px;
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
  color: white;
  font-size: 2rem;
  background-color: var(--purple);
  border: none;
  position: relative;
  transition: 0.3s;
  box-shadow: 2px 2px 10px 5px #00000033;
  cursor: pointer;
  display: flex;
  justify-self: flex-end;
  justify-content: center;

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    filter: brightness(120%);
  }
`;
