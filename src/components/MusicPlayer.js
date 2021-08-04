import React from "react";
import styled from "styled-components";

import Flowskip from "../assets/svg/logo.svg";
import Play from "../assets/svg/Play.svg";
import Skip from "../assets/svg/Skip.svg";
import Repeat from "../assets/svg/Repeat.svg";

export default function renderMusicPlayer(props) {
  function copyRoomCode() {
    navigator.clipboard
      .writeText(localStorage.getItem("room_code"))
      .then(() => {
        console.log("%cCode copied successfully!", "color:#00ff00");
      })
      .then(() => {
        // Pseudo element: copied
      })
      .catch(() => {
        console.log("%cCode not copied 😭", "color:red");
      });
  }

  // utils
  function extractArtists() {
    //given a list of objects with names, return a list of names
    let artist_names = item.artists.map(
      (artist) => `<a href="${artist.external_urls.spotify}">${artist.name}</a>`
    );
    return artist_names;
  }

  const { item, shuffle_state, progress_ms } = props.currentPlayback;

  return (
    <MainContainer>
      <Card
        alt="logo"
        src={item === undefined ? Flowskip : item.album.images[1].url}
      />
      <Controls>
        <Title>
          Room code:{" "}
          <RoomCodeText id="room-code" onClick={copyRoomCode}>
            {localStorage.getItem("room_code")}
          </RoomCodeText>
        </Title>
        <SongName
          target="_blank"
          rel="noreferer noopener"
          href={item === undefined ? "#" : item.external_urls.spotify}
        >
          {item === undefined ? "Artistas" : item.name}
        </SongName>
        {item === undefined
          ? "Artist"
          : extractArtists([{ name: "artist1" }, { name: "artist2" }])}
        <SongAlbum href="#">
          {item === undefined ? "Artist" : item.album.name}
        </SongAlbum>
        <Progress
          id="progress"
          value={
            item === undefined ? 0 : (progress_ms / item.duration_ms) * 100
          }
          max="100"
        />
        <Buttons>
          <ControlBucleButton src={Repeat} />
          <ControlPlayButton src={Play} />
          <ControlSkipButton src={Skip} />
        </Buttons>
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
  max-height: 250px;
  margin: 0 auto;
`;

const Controls = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Progress = styled.progress`
  width: 100%;
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

const Buttons = styled.div`
  align-items: center;
  display: flex;
  height: 100px;
  justify-content: center;
  width: 100%;
`;

const ControlButton = styled.img`
  background-color: blue;
  border-radius: 50%;
  padding: 5px 5px 5px 10px;
`;
const ControlBucleButton = styled(ControlButton)`
  width: 50px;
  height: 50px;
  padding: 8px;
`;

const ControlPlayButton = styled(ControlButton)`
  width: 70px;
  height: 70px;
  margin: 0 20px;
`;

const ControlSkipButton = styled(ControlButton)`
  width: 50px;
  height: 50px;
  padding: 5px;
`;

const Anchor = styled.a`
  color: white;
  font: 1.6rem var(--font-bungee-bold);
  line-height: 100%;
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  overflow-wrap: normal;
`;

const SongName = styled(Anchor)`
  color: red;
`;

const SongArtist = styled(Anchor)`
  color: #cccccc;
  font: 1.4rem var(--font-bungee-bold);
  width: 100%;
`;

const SongAlbum = styled(Anchor)`
  color: #cccccc;
  font: 1.4rem var(--font-bungee-bold);
`;
