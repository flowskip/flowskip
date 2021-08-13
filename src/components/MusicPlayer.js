import React from "react";
import { voteToSkip } from "./FlowskipApi";

import Flowskip from "../assets/svg/logo.svg";

import "./styles/MusicPlayer.css";

export default function renderMusicPlayer(props) {
  function copyRoomCode() {
    navigator.clipboard
      .writeText(localStorage.getItem("room_code"))
      .then(() => {
        console.log(
          "%cCode copied successfully!",
          "color:#00ff00; font: bold 16px/20px monospace;"
        );
      })
      .then(() => {
        // Pseudo element: copied
      })
      .catch(() => {
        console.log("%cCode not copied 😭", "color:red");
      });
  }

  const { item, shuffle_state, progress_ms, is_playing } =
    props.currentPlayback;

  const votesToSkip = props.votesToSkip;
  const roomDetails = props.roomDetails;

  function toggleAside() {
    const gearContainer = document.getElementById("gear-container");
    const gearButton = document.getElementById("gear");
    const closeButton = document.getElementById("close");
    const aside = document.getElementById("aside");

    gearContainer.classList.toggle("rotate");
    gearButton.classList.toggle("opacity");
    closeButton.classList.toggle("opacity");
    aside.classList.toggle("displayed");
  }

  // Arrow function in react
  const togglePause = () => {
    const playButton = document.getElementById("play");
    const pauseButton = document.getElementById("pause");

    playButton.classList.toggle("opacity");
    pauseButton.classList.toggle("opacity");

    // if (is_playing) {
    //   props.pause();
    //   playButton.classList.remove("opacity");
    //   pauseButton.classList.add("opacity");
    // } else {
    //   props.play();
    //   playButton.classList.add("opacity");
    //   pauseButton.classList.add("opacity");
    // }
  };

  return (
    <React.Fragment>
      <div className="header">
        <aside className="aside" id="aside">
          <p
            style={{ textAlign: "justify", color: "white", fontSize: "1.6rem" }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            ipsa assumenda iusto ratione. Qui beatae rem dicta nisi nobis
            placeat deleniti, nulla vitae expedita consequuntur aliquid delectus
            fuga reiciendis eaque! Cupiditate optio quae illo odit architecto
            ipsam soluta labore vero! Rem asperiores eum ipsum quo nemo esse,
            amet praesentium, est sed consequatur atque necessitatibus quidem
            architecto harum aliquam, accusantium neque. Ipsam nemo, suscipit
            aliquid necessitatibus optio beatae sint fugit ea esse voluptatum
            nam quae nesciunt officia mollitia reiciendis impedit nobis aut
            corrupti, recusandae voluptas harum veritatis cum. Porro, doloremque
            recusandae. Necessitatibus tempora ut vitae ipsum, recusandae
            officiis tenetur molestias commodi veniam odit blanditiis voluptas
            ex, voluptates inventore vel doloremque animi, quam odio unde nihil
            neque sint. Explicabo fugiat ullam sit. Dignissimos necessitatibus
            accusamus ea accusantium ratione quis porro commodi provident eaque
            ad recusandae, enim facere a cum, nobis impedit labore. Dolore
            expedita provident odio laudantium voluptas consequatur pariatur,
            sapiente adipisci! Sint, debitis omnis. Ipsam, autem? Quaerat porro
            nisi perspiciatis? Dolor laudantium fugiat aliquam officia ab rerum
            sequi exercitationem dolorem dignissimos non fugit, consequatur,
            totam dolorum obcaecati praesentium, aut vel maxime. Quisquam
            ratione a ad iusto aliquid quaerat iure quidem beatae veniam, rerum,
            nihil placeat quibusdam magnam vero libero dolorem voluptatum unde.
            Culpa vel esse et minus ad libero ducimus nobis? Id dolore, culpa
            officiis in alias, minima illo corrupti ut laborum repellat amet
            magnam recusandae porro mollitia expedita minus quo, impedit quod
            corporis voluptas! Dolor laborum voluptas illo voluptates vero.
          </p>
        </aside>
        <div className="header__icon" id="gear-container" onClick={toggleAside}>
          <svg width="42" height="42" viewBox="0 0 42 42" id="gear">
            <path d="M24.7917 41.8334H17.2084C16.2294 41.8334 15.3824 41.1522 15.1729 40.1959L14.325 36.2709C13.1939 35.7753 12.1213 35.1556 11.1271 34.423L7.30003 35.6418C6.3667 35.9394 5.35209 35.5465 4.86253 34.698L1.06253 28.1334C0.578342 27.2845 0.745156 26.2136 1.46462 25.5522L4.43337 22.8438C4.29836 21.617 4.29836 20.379 4.43337 19.1522L1.46462 16.4501C0.744096 15.7883 0.577216 14.7162 1.06253 13.8667L4.8542 7.298C5.34376 6.44945 6.35837 6.05662 7.2917 6.35425L11.1188 7.573C11.6272 7.19624 12.1566 6.84847 12.7042 6.53133C13.2299 6.23486 13.7709 5.96643 14.325 5.72716L15.175 1.80633C15.3835 0.850016 16.2296 0.167778 17.2084 0.166748H24.7917C25.7705 0.167778 26.6166 0.850016 26.825 1.80633L27.6834 5.72925C28.2683 5.98657 28.838 6.27733 29.3896 6.60008C29.9048 6.89753 30.4028 7.22374 30.8813 7.57717L34.7104 6.35842C35.6432 6.06189 36.6565 6.45458 37.1459 7.30217L40.9375 13.8709C41.4217 14.7198 41.2549 15.7907 40.5354 16.4522L37.5667 19.1605C37.7017 20.3874 37.7017 21.6253 37.5667 22.8522L40.5354 25.5605C41.2549 26.2219 41.4217 27.2928 40.9375 28.1418L37.1459 34.7105C36.6565 35.5581 35.6432 35.9508 34.7104 35.6543L30.8813 34.4355C30.3968 34.7924 29.8932 35.1227 29.3729 35.4251C28.8268 35.7416 28.2634 36.0274 27.6854 36.2813L26.825 40.1959C26.6157 41.1514 25.7698 41.8326 24.7917 41.8334ZM20.9917 12.6667C16.3893 12.6667 12.6584 16.3977 12.6584 21.0001C12.6584 25.6025 16.3893 29.3334 20.9917 29.3334C25.5941 29.3334 29.325 25.6025 29.325 21.0001C29.325 16.3977 25.5941 12.6667 20.9917 12.6667Z" />
          </svg>
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            id="close"
            className="opacity"
          >
            <path d="M42.95 0L25 17.95L7.05 0L0 7.05L17.95 25L0 42.95L7.05 50L25 32.05L42.95 50L50 42.95L32.05 25L50 7.05L42.95 0Z" />
          </svg>
        </div>
      </div>
      <main className="main__container--music-player">
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
            <p className="song__artist">
              {"by "}
              {item === undefined ? (
                <a className="song__details" href="https://open.spotify.com">
                  Open Spotify
                </a>
              ) : (
                convertArtistsToAnchor(item.artists)
              )}
            </p>
            <p className="song__album">
              Album:{" "}
              <a
                target="_blank"
                className="song__details"
                rel="noreferrer noopener"
                href={
                  item === undefined ? "#" : item.album.external_urls.spotify
                }
              >
                {item === undefined ? "Artist" : item.album.name}
              </a>
            </p>
            <p className="votes-to-skip">
              {votesToSkip === undefined || roomDetails === null
                ? `Votos: Loading`
                : `Votos: ${votesToSkip.all.length}/${roomDetails.votes_to_skip}`}
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
            {/* Repeat */}
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              id="bucle"
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
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M39.5834 25V25C39.5834 31.9036 33.9869 37.5 27.0834 37.5V37.5H16.6667"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Play and pause Icons */}
            <div id="playpause" onClick={togglePause}>
              <svg width="50" height="50" viewBox="0 0 50 50" id="play">
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
              >
                <rect x="8.33337" y="6.25" width="12.5" height="37.5" rx="2" />
                <rect x="29.1666" y="6.25" width="12.5" height="37.5" rx="2" />
              </svg>
            </div>
            {/* Skip button */}
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              id="skip"
              onClick={() => sendVoteToSkip()}
            >
              <path d="M32.0075 25.8437C32.625 25.4507 32.625 24.5493 32.0075 24.1563L11.9535 11.3947C11.2878 10.971 10.4166 11.4492 10.4166 12.2383V37.7617C10.4166 38.5507 11.2878 39.029 11.9535 38.6053L32.0075 25.8437Z" />
              <rect
                x="35.4166"
                y="10.4167"
                width="4.16667"
                height="29.1667"
                rx="1"
              />
            </svg>
          </div>
        </div>
        <footer className="footer__music-player">
          {/* Album Button */}
          <div className="footer__dialog--container">
            <svg width="50" height="50" viewBox="0 0 50 50" id="album">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25 0C35.3553 0 43.75 8.39466 43.75 18.75H33.3333C33.3333 14.1476 29.6024 10.4167 25 10.4167C20.3976 10.4167 16.6667 14.1476 16.6667 18.75H6.25C6.25 8.39466 14.6447 0 25 0ZM29.1667 18.75C29.1667 16.4488 27.3012 14.5833 25 14.5833C22.6988 14.5833 20.8333 16.4488 20.8333 18.75H29.1667Z"
              />
              <path d="M2.08337 22.9167H47.9167V48C47.9167 49.1046 47.0213 50 45.9167 50H4.08337C2.9788 50 2.08337 49.1046 2.08337 48V22.9167Z" />
            </svg>
          </div>
          {/* Library Button */}
          <div className="footer__dialog--container">
            <svg width="50" height="50" viewBox="0 0 50 50" id="library">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 16.6667C0.895431 16.6667 0 17.5621 0 18.6667V48C0 49.1046 0.895432 50 2 50H48C49.1046 50 50 49.1046 50 48V18.6667C50 17.5621 49.1046 16.6667 48 16.6667H2ZM19.7917 26.2586C19.7917 25.4908 20.6211 25.0094 21.2878 25.3903L32.8556 32.0005C33.5274 32.3844 33.5274 33.3531 32.8556 33.737L21.2878 40.3471C20.6212 40.7281 19.7917 40.2467 19.7917 39.4789V26.2586Z"
              />
              <rect
                x="2.08337"
                y="8.33333"
                width="45.8333"
                height="4.16667"
                rx="1"
              />
              <rect x="4.16663" width="41.6667" height="4.16667" rx="1" />
            </svg>
          </div>
          {/* Song Button */}
          <div className="footer__dialog--container">
            <svg width="50" height="50" viewBox="0 0 50 50" id="song">
              <path d="M17.7083 47.9167C24.0366 47.9167 29.1667 42.7866 29.1667 36.4583C29.1667 30.1301 24.0366 25 17.7083 25C11.3801 25 6.25 30.1301 6.25 36.4583C6.25 42.7866 11.3801 47.9167 17.7083 47.9167Z" />
              <rect x="22.9166" y="8.33334" width="6.25" height="27.0833" />
              <rect
                x="22.9166"
                y="2.08334"
                width="22.9167"
                height="12.5"
                rx="2"
              />
            </svg>
          </div>
        </footer>
      </main>

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
      {artist.name} {index >= artists_len - 1 ? "" : ", "}
    </a>
  ));
}

function sendVoteToSkip() {
  function voteToSkipResponse(data, responseCode) {
    if (responseCode === 201) {
      alert("Voto enviado");
    } else if (responseCode === 410) {
      alert(
        "Ya no puedes votar por esta cancion, vota cuando vaya mas al inicio"
      );
    } else if (responseCode === 208) {
      alert("Ya has votado por esta cancion");
    }
  }
  let body = {
    code: localStorage.getItem("room_code"),
    track_id: localStorage.getItem("track_id"),
  };
  voteToSkip(body, voteToSkipResponse);
}
