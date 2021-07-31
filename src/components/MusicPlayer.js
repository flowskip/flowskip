import React from "react";
import styled from "styled-components";

import Flowskip from "../assets/svg/logo.svg";

export default function renderMusicPlayer() {
  function copyRoomCode() {
    navigator.clipboard
      .writeText(localStorage.getItem("room_code"))
      .then(() => {
        console.log("%cCode copied successfully!", "color:#00ff00");
      })
      .then(() => {
        // Pseudoelement: copied
      })
      .catch(() => {
        console.log("%cCode not copied 😭", "color:red");
      });
  }
  return (
    <MainContainer>
      <Card
        alt="logo"
        src={
          currentPlayback.item === undefined
            ? Flowskip
            : currentPlayback.item.album.images[1].url
        }
      />
      <Controls>
        <Title>
          Room code:{" "}
          <RoomCodeText id="room-code" onClick={copyRoomCode}>
            {localStorage.getItem("room_code")}
          </RoomCodeText>
        </Title>
        <ProgressBar>
          <Avance start id="start">
            0:00
          </Avance>
          <Progress id="progress" value="40" max="100" />
          <Avance id="end">7:48</Avance>
        </ProgressBar>
      </Controls>

      {/* <h1>
          {currentPlayback.item === undefined
            ? "Start a song"
            : currentPlayback.item.name}
        </h1> */}
      {/* <h1>
          {currentPlayback.item === undefined
            ? "In Spotify"
            : currentPlayback.item.album.name}
        </h1> */}
      {/* <h1>
          {participants.length !== 0 ? participants[0].display_name : "Anonimo"}
        </h1> */}
      {/* <Button onClick={() => leaveButtonRequest()}>Leave room</Button> */}
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: grid;
  grid-template-rows: 40% 50% 10%;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  padding: 20px;
  margin: 0 auto;
`;

const Card = styled.img`
  height: 100%;
  max-width: 250px;
  margin: 0 auto;
`;

const Controls = styled.div`
  height: 100%;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  padding-block-start: 10px;
  font: 1.6rem var(--font-bungee-bold);
`;

const RoomCodeText = styled.span`
  cursor: pointer;
  text-decoration: underline;
  font: 2rem var(--font-bungee-bold);
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Avance = styled.p`
  color: white;
  font-size: 16px;
  font: 1.6rem var(--font-bungee-bold);
`;

const Progress = styled.progress`
  width: calc(100% - 82px - 40px);
  display: block;
  margin: 10px auto;
  font-size: 0.6em;
  line-height: 1.5em;
  text-indent: 0.5em;
  height: 1.8em;
  border-radius: 10px;
  color: black;
  background-color: transparent;

  [value]::-webkit-progress-bar {
    background-color: black;
    box-shadow: 0px 0px 2px 0px var(--purple);
    border-radius: 10px;
  }

  ::-webkit-progress-value {
    background-image: var(--progressbar) !important;
    box-shadow: 0px 0px 5px 1px yellow;
    border-radius: 10px;
  }

  ::-webkit-progress-bar {
    background-color: #eeee00;
    border-radius: 10px;
  }

  ::-webkit-progress-value {
    border-radius: 10px;
  }

  ::-moz-progress-bar {
    border-radius: 10px;
  }
`;
