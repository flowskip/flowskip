import React from "react";
import styled from "styled-components";

import Flowskip from "../assets/svg/logo.svg";
import Play from "../assets/svg/Play.svg";
import Skip from "../assets/svg/Skip.svg";
import Repeat from "../assets/svg/Repeat.svg";
import Album from "../assets/svg/Album.svg";
import Library from "../assets/svg/Library.svg";
import Song from "../assets/svg/Song.svg";

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

  const { item, shuffle_state, progress_ms } = props.currentPlayback;

  return (
    <MainContainer>
      <CardContainer>
        <RoomCode>
          Room code:{" "}
          <RoomCodeText id="room-code" onClick={copyRoomCode}>
            {localStorage.getItem("room_code")}
          </RoomCodeText>
        </RoomCode>
        <Card
          alt="logo"
          src={item === undefined ? Flowskip : item.album.images[1].url}
        />
      </CardContainer>
      <Controls>
        <SongName
          target="_blank"
          rel="noreferer noopener"
          href={item === undefined ? "#" : item.external_urls.spotify}
        >
          {item === undefined ? "Artistas" : item.name}
        </SongName>
        {item === undefined ? "Artist" : "Hola"}
        <SongAlbum href="#">
          {item === undefined ? "Artist" : item.album.name}
        </SongAlbum>
        <SongArtist>
          {item === undefined ? (
            <Anchor href="https://open.spotify.com">Open Spotify</Anchor>
          ) : (
            convertArtistsToAnchor(item.artists)
          )}
        </SongArtist>
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
      <Footer>
        <AlbumIcon src={Album} />
        <CenterAlbumIconContainer>
          <CenterAlbumIcon src={Library} />
        </CenterAlbumIconContainer>
        <AlbumIcon src={Song} />
      </Footer>
    </MainContainer>
  );
}

// utils
function convertArtistsToAnchor(artists) {
  let artists_len = artists.length;
  return artists.map((artist, index) => (
    <Anchor key={artist.name} href={artist.external_urls.spotify}>
      {artist.name} {index >= artists_len - 1 ? "" : ",  "}
    </Anchor>
  ));
}

const MainContainer = styled.main`
  display: grid;
  grid-template-rows: 40% 50% 10%;
  width: 100%;
  max-width: 440px;
  height: 100vh;
  padding: 20px;
  margin: 0 auto;
  gap: 20px;
`;

const CardContainer = styled.div`
  margin: 0 auto;
  position: relative;
`;

const Card = styled.img`
  height: 100%;
  margin: 0 auto;
  padding-top: 20px;
`;

const RoomCode = styled.h1`
  color: white;
  text-align: center;
  font: 1.6rem/100% var(--font-bungee-bold);
  position: absolute;
  width: 100%;
  top: -25px;
`;

const Controls = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border-radius: 50%;
  padding: 5px 5px 5px 10px;
  cursor: pointer;
  filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 1));
  &:hover {
    filter: sepia(1) hue-rotate(50deg) saturate(10000%)
      drop-shadow(0 2px 5px rgba(0, 0, 0, 1));
  }
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
  color: white;
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

const Footer = styled.footer`
  width: 100%;
  position: absolute;
  height: 70px;
  background-color: var(--blue);
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  padding: 20px 0;
  align-items: center;
  justify-content: space-evenly;
`;

const AlbumIcon = styled.img`
  height: 40px;
  filter: brightness(0.6) drop-shadow(0 2px 1px rgba(0, 0, 0, 1));

  &:hover {
    filter: brightness(1) drop-shadow(0 2px 1px rgba(0, 0, 0, 1));
  }
`;

const CenterAlbumIconContainer = styled.div`
  background-color: var(--blue);
  width: 100px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: relative;
  bottom: 20px;
`;

const CenterAlbumIcon = styled.img`
  height: 50px;
  filter: brightness(0.6) drop-shadow(0 2px 1px rgba(0, 0, 0, 1));
  position: absolute;
  top: 25px;

  &:hover {
    filter: brightness(1) drop-shadow(0 2px 1px rgba(0, 0, 0, 1));
  }
`;

const Aside = styled.aside`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: black;
`;
