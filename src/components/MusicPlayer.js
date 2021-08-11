import React from "react";
import styled from "styled-components";

import Flowskip from "../assets/svg/logo.svg";
import PlayIcon from "../assets/svg/Play.svg";
import SkipIcon from "../assets/svg/Skip.svg";
import AlbumIcon from "../assets/svg/Album.svg";
import LibraryIcon from "../assets/svg/Library.svg";
import SongIcon from "../assets/svg/Song.svg";
import GearIcon from "../assets/svg/Gear.svg";
import closeIcon from "../assets/svg/Close.svg";

import "./styles/MusicPlayer.css";

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

  const { item, shuffle_state, progress_ms, votes_to_skip } =
    props.currentPlayback;

  function toggleAside() {}

  return (
    <React.Fragment>
      <main className="main__container--music-player">
        {/* <Menu id="menu" onClick={toggleMenu} src={Gear} /> */}
        <div className="card__container">
          <h1 className="room__code">
            Room code:{" "}
            <span
              className="room__code--text"
              id="room-code"
              onClick={copyRoomCode}
            >
              {localStorage.getItem("room_code")}
            </span>
          </h1>
          <img
            alt="logo"
            src={item === undefined ? Flowskip : item.album.images[1].url}
            className="card"
          />
        </div>
        <div className="controls__container">
          <div className="song__details--container">
            <a
              target="_blank"
              className="song__name song__details"
              rel="noreferrer noopener"
              href={item === undefined ? "#" : item.external_urls.spotify}
            >
              {item === undefined ? "Artistas" : item.name}
            </a>
            <p className="song__artist song__details">
              {item === undefined ? (
                <a className="song__details" href="https://open.spotify.com">
                  Open Spotify
                </a>
              ) : (
                convertArtistsToAnchor(item.artists)
              )}
            </p>
            <a
              target="_blank"
              className="song__album song__details"
              rel="noreferrer noopener"
              href={item === undefined ? "#" : item.album.external_urls.spotify}
            >
              {item === undefined ? "Artist" : item.album.name}
            </a>
            <p className="votes-to-skip">
              {votes_to_skip === undefined
                ? `Votos: 0`
                : `Votos: ${votes_to_skip.new}/${votes_to_skip.all}`}
            </p>
            <progress
              id="progress"
              className="progress"
              value={
                item === undefined ? 0 : (progress_ms / item.duration_ms) * 100
              }
              max="100"
            />
          </div>
          <div className="buttons__container">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              id="bucle"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="arrow"
                d="M46.5599 11.6728C47.1865 11.2811 47.1865 10.3684 46.5599 9.97677L32.78 1.36436C32.114 0.948076 31.25 1.42692 31.25 2.21235V19.4372C31.25 20.2226 32.114 20.7015 32.78 20.2852L46.5599 11.6728Z"
              />
              <path
                className="arrow"
                d="M3.67621 38.7561C3.04954 38.3644 3.04954 37.4518 3.67621 37.0601L17.4561 28.4477C18.1221 28.0314 18.9861 28.5102 18.9861 29.2957V46.5205C18.9861 47.3059 18.1221 47.7848 17.4561 47.3685L3.67621 38.7561Z"
              />
              <path
                d="M8.33337 22.9167V22.9167C8.33337 16.0131 13.9298 10.4167 20.8334 10.4167V10.4167H31.25"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M39.5834 25V25C39.5834 31.9036 33.9869 37.5 27.0834 37.5V37.5H16.6667"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div id="playpause">
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                id="play"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="white"
                  d="M42.3932 25.848C43.0198 25.4563 43.0198 24.5437 42.3932 24.152L11.9466 5.12292C11.2806 4.70664 10.4166 5.18548 10.4166 5.97092V44.0291C10.4166 44.8145 11.2806 45.2934 11.9466 44.8771L42.3932 25.848Z"
                />
              </svg>
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="white"
                id="pause"
                className="opacity"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8.33337" y="6.25" width="12.5" height="37.5" rx="2" />
                <rect x="29.1666" y="6.25" width="12.5" height="37.5" rx="2" />
              </svg>
            </div>
            <ControlSkipButton src={SkipIcon} />
          </div>
        </div>

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
          <Album src={AlbumIcon} />
          <CenterAlbumIconContainer>
            <CenterAlbumIcon src={LibraryIcon} />
          </CenterAlbumIconContainer>
          <Album src={SongIcon} />
        </Footer>
      </main>
    </React.Fragment>
  );
}

// utils
function convertArtistsToAnchor(artists) {
  let artists_len = artists.length;
  return artists.map((artist, index) => (
    <a
      key={artist.name}
      target="_blank"
      className="song__details"
      rel="noreferrer noopener"
      href={artist.external_urls.spotify}
    >
      {artist.name} {index >= artists_len - 1 ? "" : ",  "}
    </a>
  ));
}

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

const Album = styled.img`
  height: 40px;
  filter: brightness(0.6) drop-shadow(0 2px 1px rgba(0, 0, 0, 1));
  cursor: pointer;

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
  cursor: pointer;

  &:hover {
    filter: brightness(1) drop-shadow(0 2px 1px rgba(0, 0, 0, 1));
  }
`;

const Aside = styled.aside`
  background-color: #00000088;
  height: 100vh;
  right: -100vw;
  top: 0;
  padding: 20px;
  position: absolute;
  width: 100vw;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;
