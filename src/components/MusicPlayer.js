import React, { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
	voteToSkip,
	toggleIsPlaying,
	addItemsToPlaylist,
	uploadPlaylistCover,
	createPlaylist,
	getSpotifyAuthenticationUrl,
} from "./FlowskipApi";
import Flowskip from "../assets/svg/logo.svg";
import Button from "./Button";
import LogoSpotify from "../assets/img/logo-spotify.png";

import copy from "../assets/svg/copy.svg";
import note from "../assets/svg/note.svg";
import artist from "../assets/svg/artist.svg";
import disk from "../assets/svg/disk.svg";
import dislike from "../assets/svg/dislike.svg";

import "./styles/MusicPlayer.css";

const getTwitterIntentUrl = (songName) => {
	const comaUpper = (hashtags) => {
		let result = hashtags.join(",");
		result = result.split(" ");
		result = result.reduce((allHashtag = "", hashtag) => {
			return allHashtag + hashtag.charAt(0).toUpperCase() + hashtag.slice(1);
		});
		result = result.replace(/[^0-9a-zA-Z]/g, "");
		return result;
	};

	const baseUrl = "https://twitter.com/intent/tweet";
	const url = new URL(baseUrl);
	const params = {
		text: `Estoy escuchando ${songName} en flowskip, crea tu propia sala e invita a todos!`,
		via: "FlowskipApp",
		hashtags: comaUpper(["flowskip", songName]),
		url: "flowskip.com",
	};
	url.search = new URLSearchParams(params).toString();
	return url;
};

// function that returns today day into human readable day and month
function FlowskipPlaylistDefaultName(language) {
	if (!["es", "en"].includes(language)) {
		console.warn("language not supported");
		return null;
	}
	const today = new Date();
	const day = today.getDay();
	const dayOfWeekEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const dayOfWeekEs = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
	const dayOfWeek = {
		en: dayOfWeekEn,
		es: dayOfWeekEs,
	};
	const month = today.getMonth();
	const monthNameEn = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthNameEs = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	const monthName = {
		en: monthNameEn,
		es: monthNameEs,
	};

	const result = {
		en: `Flow from ${dayOfWeek[language][day]}, ${monthName[language][month]} ${today.getDate()}`,
		es: `Flow del ${dayOfWeek[language][day]} ${today.getDate()} de ${monthName[language][month]}`,
	};
	return result[language];
}
var QRCode = require("qrcode.react");
export default function RenderMusicPlayer(props) {
	const [loading, setLoading] = useState(false);
	const lifeCycleStatus = props.lifeCycleStatusState[0];
	const setLifeCycleStatus = props.lifeCycleStatusState[1];
	function copyRoomCode() {
		navigator.clipboard
			.writeText(localStorage.getItem("room_code"))
			.then(() => {
				const Toast = Swal.mixin({
					customClass: {
						title: "swal-text-dark",
					},
					toast: true,
					position: "top",
					showConfirmButton: false,
					timer: 1500,
					timerProgressBar: true,
				});

				Toast.fire({
					icon: "success",
					title: "Código copiado exitosamente",
				});
			})
			.catch(() => {
				const Toast = Swal.mixin({
					toast: true,
					position: "top",
					showConfirmButton: false,
					timer: 1500,
					timerProgressBar: true,
				});

				Toast.fire({
					icon: "error",
					title: "Ocurrió un error al copiar el código",
				});
			});
	}

	// console.log(counter + " " + (Date.now() - start) / 1000);

	const [playlistSubscription, setPlaylistSubscription] = useState(
		localStorage.getItem("playlist_id") === null ? "no-subscribed" : "subscribed"
	);
	const { item, progress_ms, is_playing } = props.currentPlayback;
	const participants = props.participants;
	const votes_to_skip = props.votesToSkip;
	const room_details = props.roomDetails;
	const successTracks = props.successTracks;
	const queueTracks = props.queueTracks;
	const recommendedTracks = props.recommendedTracks;
	const user = props.user;

	function getSpotifyAuthenticationUrlResponse(data, responseCode) {
		if (responseCode === 208) {
			localStorage.setItem("spotify_authenticated", "true");
			window.open(data.authorize_url, "_self");
		} else if (responseCode === 200) {
			window.open(data.authorize_url, "_self");
		}
	}

	async function playlistDispatcher() {
		function difference(setA, setB) {
			let _difference = new Set(setA);
			for (let elem of setB) {
				_difference.delete(elem);
			}
			return _difference;
		}

		async function sendToPlaylist(itemsIds) {
			function addItemsToPlaylistResponse(data, responseCode) {
				if (responseCode === 201) {
					return true;
				} else {
					return false;
				}
			}
			let body = {
				code: localStorage.getItem("room_code"),
				playlist_id: localStorage.getItem("playlist_id"),
				items: itemsIds,
			};
			let makingRequest = addItemsToPlaylist(body, addItemsToPlaylistResponse);
			let success = await makingRequest;
			return success;
		}
		let tracksIds = new Set(
			successTracks.map((track) => {
				return track.props.id;
			})
		);
		console.log(tracksIds);
		if (localStorage.getItem("tracksInSubscriptionPlaylist") === null) {
			localStorage.setItem("tracksInSubscriptionPlaylist", "");
		}
		let tracksIdsInSubscription = new Set(localStorage.getItem("tracksInSubscriptionPlaylist").split(","));
		let newSongsToPlaylist = difference(tracksIds, tracksIdsInSubscription);
		if (newSongsToPlaylist.size > 0) {
			let chunk = 30;
			newSongsToPlaylist = Array.from(newSongsToPlaylist);
			let chunkList;
			for (let i = 0, j = newSongsToPlaylist.length; i < j; i += chunk) {
				chunkList = newSongsToPlaylist.slice(i, i + chunk);
				let songsAdded = await sendToPlaylist(chunkList);
				if (songsAdded !== true) {
					console.warn("something went wrong adding songs to the playlist");
					localStorage.removeItem("playlist_id");
					localStorage.removeItem("tracksInSubscriptionPlaylist");
					// remove all information here, alert the user

					break;
				}
				chunkList.forEach((item) => tracksIdsInSubscription.add(item));
			}
			localStorage.setItem("tracksInSubscriptionPlaylist", Array.from(tracksIdsInSubscription).join());
		}
	}

	if (playlistSubscription === "subscribed") {
		if (localStorage.getItem("playlist_id") === null) {
			localStorage.removeItem("tracksInSubscriptionPlaylist");
			setPlaylistSubscription("no-subscribed");
		} else {
			playlistDispatcher();
		}
	}

	const updatePlaylistImage = () => {
		function updatePlaylistImageResponse(data, responseCode) {
			setPlaylistSubscription("subscribed");
			if (responseCode === 202) {
				console.log("everything seems fine");
			} else {
				console.log(data);
			}
		}
		/*
		If the image will become from internet use this function
		function imageToBase64Callback(result) {
			let body = {
				code: localStorage.getItem("room_code"),
				playlist_id: localStorage.getItem("playlist_id"),
				image_b64: result.replace("data:image/jpeg;base64,", ""),
			};
			uploadPlaylistCover(body, updatePlaylistImageResponse);
		}
		*/
		// imageToBase64("https://i.imgur.com/v5Su4aN.jpeg", imageToBase64Callback);
		let body = {
			code: localStorage.getItem("room_code"),
			playlist_id: localStorage.getItem("playlist_id"),
			image_b64: image_b64,
		};
		console.log(body);
		uploadPlaylistCover(body, updatePlaylistImageResponse);
	};

	const shareInTwitter = (trackName) => {
		window.open(getTwitterIntentUrl(trackName), "_blank", "noreferrer", "noopener'");
	};

	const playlistButtonClick = () => {
		function createPlaylistResponse(data, responseCode) {
			if (responseCode === 201) {
				localStorage.setItem("playlist_id", data.id);
				updatePlaylistImage();
			} else {
				console.log("error creating playlist");
				setPlaylistSubscription("no-subscribed");
			}
		}
		if (localStorage.getItem("spotify_authenticated") !== "true") {
			Swal.fire({
				customClass: {
					title: "swal-title",
					confirmButton: "swal-button-text",
					cancelButton: "swal-button-text",
					htmlContainer: "swal-text",
				},
				icon: "info",
				title: "No iniciaste sesión",
				background: "var(--gradient)",
				text: "Para poder crear un playlist en Spotify, debes estar autenticado.",
				cancelButtonColor: "#ee0000",
				confirmButtonText: "Iniciar sesión",
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed) {
					localStorage.setItem("next", window.location.href);
					getSpotifyAuthenticationUrl(getSpotifyAuthenticationUrlResponse);
				}
			});
		} else {
			if (user.spotify_user === undefined) {
				console.log("user is not well constructed! this shouldn't be happening");
			}
			setPlaylistSubscription("creating-subscription");
			let body = {
				code: localStorage.getItem("room_code"),
				name: FlowskipPlaylistDefaultName("es"),
				user: user.spotify_user.id,
			};
			console.log(body);
			createPlaylist(body, createPlaylistResponse);
			//updatePlaylistImage();
		}
	};
	const leaveRoomButton = () => {
		//modal
		const msgTitle = props.roomDetails.user_is_host ? "¿Estás segur@?" : "¿Estás segur@?";
		const msg = props.roomDetails.user_is_host ? "Si sales la sala será destruida." : "Abandonarás la sala.";

		// modal
		Swal.fire({
			customClass: {
				title: "swal-title",
				confirmButton: "swal-button-text",
				cancelButton: "swal-button-text",
				htmlContainer: "swal-text",
			},
			title: msgTitle,
			text: msg,
			icon: "warning",
			iconColor: "#fff",
			background: "var(--gradient)",
			confirmButtonColor: "#dd0000",
			cancelButtonColor: "#00dd00",
			confirmButtonText: "Sí, salir",
			showCancelButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					customClass: {
						title: "swal-title",
						confirmButton: "swal-button-text",
						cancelButton: "swal-button-text",
						htmlContainer: "swal-text",
					},
					background: "var(--gradient)",
					icon: "success",
					text: "Vuelve pronto 😥",
					timer: 2000,
					title: "Saliste de la sala",
				}).then(() => {
					setLifeCycleStatus("exiting");
				});
			}
		});
	};

	// const userIsHost = props.roomDetails.user_is_host;
	const toggleAside = () => {
		const gearContainer = document.getElementById("gear-container");
		const gearButton = document.getElementById("gear");
		const closeButton = document.getElementById("close");
		const aside = document.getElementById("aside");

		gearContainer.classList.toggle("rotate");
		gearButton.classList.toggle("opacity");
		closeButton.classList.toggle("opacity");
		aside.classList.toggle("displayed");
	};

	useEffect(() => {
		if (is_playing) {
			document.getElementById("play").classList.add("opacity");
			document.getElementById("pause").classList.remove("opacity");
		} else {
			document.getElementById("play").classList.remove("opacity");
			document.getElementById("pause").classList.add("opacity");
		}
	}, [is_playing]);

	const playPauseClick = () => {
		const toggleIsPlayingResponse = (data, responseCode) => {
			if (responseCode === 200) {
				document.getElementById("play").classList.toggle("opacity");
				document.getElementById("pause").classList.toggle("opacity");
				console.log("Well sent, but is asynchronous");
			} else if (responseCode === 403) {
				if (room_details.user_is_host) {
					Swal.fire({
						customClass: {
							title: "swal-title",
							confirmButton: "swal-button-text",
							cancelButton: "swal-button-text",
							htmlContainer: "swal-text",
						},
						title: "Abriendo spotify",
						text: "Por favor espera, abriendo spotify...",
						icon: "info",
						iconColor: "#fff",
						background: "var(--gradient)",
						timer: 3000,
					}).then((result) => {
						window.open("https://open.spotify.com/", "_blank", "noreferrer", "noopener'");
					});
				} else {
					// alert("El host no te ha dado permisos para pausar/reproducir la cancion");
				}
			} else {
				console.log("Play/pause don't work this time");
				// do something here
			}
		};

		let body = {
			code: localStorage.getItem("room_code"),
			track_id:
				localStorage.getItem("track_id") === null || localStorage.getItem("track_id") === undefined
					? ""
					: localStorage.getItem("track_id"),
		};

		if (body.track_id === "") {
			if (room_details.user_is_host) {
				body.track_id = "i_am_host";
				toggleIsPlaying(body, toggleIsPlayingResponse);
			} else {
				console.log("please wait until host starts a song on spotify");
				// alert("you create your own room!");
			}
		} else {
			toggleIsPlaying(body, toggleIsPlayingResponse);
		}
	};

	let playlistSubscriptionButtonRender = null;
	if (playlistSubscription === "no-subscribed") {
		playlistSubscriptionButtonRender = (
			<button className="add-playlist" onClick={playlistButtonClick}>
				¡Añade esta lista en tu spotify!
			</button>
		);
	} else if (playlistSubscription === "subscribed") {
		playlistSubscriptionButtonRender = (
			<button className="add-playlist">
				<div>
					<p>¡Siguiendo playlist!</p>
					<a
						href={"https://open.spotify.com/playlist/" + localStorage.getItem("playlist_id")}
						target="_blank"
						rel="noreferrer"
					>
						Ver en Spotify
					</a>
				</div>
				<img src={LogoSpotify} alt="Logo de spotify" />
			</button>
		);
	} else if (playlistSubscription === "creating-subscription") {
		playlistSubscriptionButtonRender = <Button>Cargando...</Button>;
	} else if (playlistSubscription === "subscription-ready") {
		setPlaylistSubscription("subscribed");
		// useState to say something like subscriptionToPlaylist(true)
		// show a modal
		// then change it in the render to false
		playlistSubscriptionButtonRender = null;
	}

	return (
		<Fragment>
			<div className="header">
				<aside className="aside" id="aside">
					<div className="aside__container">
						<details open className="details__container--qr">
							<summary>
								Código QR <span>^</span>
							</summary>
							{showQrCode()}
						</details>
						<details className="details__container--participants">
							<summary>
								Miembros en la sala <span>^</span>
							</summary>
							<div className="participants__container">{mapUsers(participants.all)}</div>
						</details>
					</div>
					<div className="aside__footer">
						<svg onClick={leaveRoomButton} width="50" height="50" viewBox="0 0 50 50" fill="var(--white)">
							<path d="M39.5833 43.75H20.8333C18.5321 43.75 16.6667 41.8845 16.6667 39.5833V31.25H20.8333V39.5833H39.5833V10.4167H20.8333V18.75H16.6667V10.4167C16.6667 8.11548 18.5321 6.25 20.8333 6.25H39.5833C41.8845 6.25 43.75 8.11548 43.75 10.4167V39.5833C43.75 41.8845 41.8845 43.75 39.5833 43.75ZM25 33.3333V27.0833H6.25V22.9167H25V16.6667L35.4167 25L25 33.3333Z" />
						</svg>
					</div>
				</aside>
				<div className="header__icon" id="gear-container" onClick={toggleAside}>
					<svg width="42" height="42" viewBox="0 0 42 42" fill="none" id="gear">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M15.3615 2.23705C15.3615 1.78404 15.6814 1.39552 16.1362 1.29617C19.2262 0.621233 22.3972 0.643172 25.4124 1.30166C25.8843 1.40473 26.2229 1.81312 26.2229 2.27942L26.2229 10.055C26.2229 10.8161 27.0782 11.3043 27.7557 10.93L34.8452 7.01218C35.2524 6.78716 35.7715 6.8666 36.0976 7.20383C37.1394 8.28117 38.0722 9.4851 38.8704 10.8084C39.6686 12.1316 40.2914 13.5068 40.7453 14.9089C40.8874 15.3479 40.6997 15.8179 40.2925 16.0429L33.2029 19.9608C32.5254 20.3351 32.5395 21.2882 33.2281 21.6688L40.2636 25.5567C40.6855 25.7898 40.8857 26.2746 40.743 26.7174C39.8312 29.5459 38.2656 32.1854 36.1099 34.4093C35.7926 34.7366 35.2811 34.8075 34.8712 34.581L27.7304 30.6349C27.0531 30.2606 26.2229 30.7194 26.2229 31.468L26.2229 39.3602C26.2229 39.8132 25.903 40.2018 25.4481 40.3011C22.3582 40.976 19.1872 40.9541 16.172 40.2956C15.7001 40.1925 15.3615 39.7841 15.3615 39.3178L15.3615 31.5421C15.3615 30.781 14.5062 30.2928 13.8287 30.6672L6.73915 34.585C6.33195 34.81 5.81282 34.7306 5.48673 34.3933C4.44504 33.316 3.51218 32.1121 2.71402 30.7889C1.91583 29.4656 1.29297 28.0904 0.839071 26.6882C0.696988 26.2493 0.884678 25.7792 1.29188 25.5542L8.38139 21.6364C9.05887 21.2621 9.04479 20.309 8.35617 19.9284L1.32088 16.0406C0.898973 15.8075 0.698732 15.3227 0.841457 14.8799C1.75323 12.0514 3.31887 9.41187 5.47455 7.18799C5.79183 6.86066 6.30332 6.78974 6.7132 7.01625L13.854 10.9623C14.5313 11.3366 15.3615 10.8779 15.3615 10.1292V2.23705ZM20.7925 25.0233C23.2304 25.0233 25.2067 23.1316 25.2067 20.7981C25.2067 18.4646 23.2304 16.573 20.7925 16.573C18.3545 16.573 16.3782 18.4646 16.3782 20.7981C16.3782 23.1316 18.3545 25.0233 20.7925 25.0233Z"
							fill="var(--white)"
						/>
					</svg>
					<svg width="50" height="50" viewBox="0 0 50 50" fill="none" id="close" className="opacity">
						<path
							d="M5 5L45 45M5 45L45 5"
							stroke="var(--white)"
							strokeWidth="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>
			<main className="main__container--music-player">
				<div id="wrapper" className="main__wrapper">
					<div className="card__container">
						<h1 className="room__code" onClick={copyRoomCode}>
							<p className="room__code--text">Room code:</p>
							<span className="room__code--text" id="room-code">
								{localStorage.getItem("room_code")}
							</span>
							<img src={copy} alt="Copy" />
						</h1>
						<img alt="logo" src={item === undefined ? Flowskip : item.album.images[1].url} className="card" />
					</div>
					<div className="controls__container">
						<div className="song__details--container">
							<p className="song__details">
								<img src={note} alt="Song" />
								<a
									target="_blank"
									className="song__details--anchor"
									rel="noreferrer noopener"
									href={item === undefined ? "#" : item.external_urls.spotify}
								>
									<span>{item === undefined ? "Artistas" : item.name}</span>
								</a>
							</p>
							<p className="song__details">
								<img src={artist} alt="Artistas" />
								{item === undefined ? (
									<a className="song__details--anchor" href="https://open.spotify.com">
										Open Spotify
									</a>
								) : (
									convertArtistsToAnchor(item.artists)
								)}
							</p>
							<p className="song__details">
								<img src={disk} alt="Album" />
								<a
									target="_blank"
									className="song__details--anchor"
									rel="noreferrer noopener"
									href={item === undefined ? "#" : item.album.external_urls.spotify}
								>
									{" "}
									{item === undefined ? "Artist" : item.album.name}
								</a>
							</p>
							<p className="votes-to-skip">
								<img src={dislike} alt="Dislike" />
								{votes_to_skip === undefined || room_details === null ? (
									`Loading`
								) : (
									<span style={{ width: "fit-content" }}>
										{room_details.votes_to_skip - votes_to_skip.all.length === 1
											? `${
													room_details.votes_to_skip - votes_to_skip.all.length
											  } voto más para saltar canción`
											: `${
													room_details.votes_to_skip - votes_to_skip.all.length
											  } votos más para saltar canción`}
									</span>
								)}
							</p>
							<progress
								id="progress"
								className="progress"
								value={item === undefined ? 0 : (progress_ms / item.duration_ms) * 100}
								max="100"
							/>
						</div>
						<div className="buttons__container">
							{/* Share */}
							<div onClick={() => shareInTwitter(item.name)}>
								<svg width="45" height="50" viewBox="0 0 47 50" id="share">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M38.6425 0.590088C34.4056 0.590088 30.9709 4.02477 30.9709 8.26167C30.9709 8.56635 30.9888 8.86727 31.0236 9.16335L12.9004 19.136C11.6135 18.1576 10.0063 17.5746 8.26167 17.5746C4.02476 17.5746 0.590088 21.0093 0.590088 25.2462C0.590088 29.4831 4.02477 32.9178 8.26167 32.9178C9.97289 32.9178 11.5519 32.3569 12.8261 31.4122L30.3994 41.922C30.357 42.248 30.3352 42.58 30.3352 42.9167C30.3352 47.1535 33.7699 50.5883 38.0068 50.5883C42.2437 50.5883 45.6784 47.1535 45.6784 42.9167C45.6784 38.6798 42.2437 35.2451 38.0068 35.2451C36.2956 35.2451 34.7166 35.8059 33.4423 36.7507L15.8691 26.2409C15.9114 25.9149 15.9333 25.5828 15.9333 25.2462C15.9333 24.9415 15.9154 24.6406 15.8806 24.3445L34.0038 14.3719C35.2907 15.3503 36.8979 15.9333 38.6425 15.9333C42.8794 15.9333 46.3141 12.4986 46.3141 8.26167C46.3141 4.02477 42.8794 0.590088 38.6425 0.590088Z"
									/>
								</svg>
							</div>
							{/* Play and pause Icons */}
							<div id="playpause" onClick={playPauseClick}>
								<svg width="50" height="50" viewBox="0 0 50 50" id="pause" className="opacity">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M32.1138 7.99658C32.1138 4.13058 35.2478 0.996582 39.1138 0.996582H43.169C47.035 0.996582 50.169 4.13059 50.169 7.99658V43.8316C50.169 47.6976 47.035 50.8316 43.169 50.8316H39.1138C35.2478 50.8316 32.1138 47.6976 32.1138 43.8316V7.99658ZM7.16895 1.16187C3.30295 1.16187 0.168945 4.29587 0.168945 8.16186V43.9969C0.168945 47.8629 3.30295 50.9969 7.16895 50.9969H11.2242C15.0902 50.9969 18.2242 47.8629 18.2242 43.9969V8.16187C18.2242 4.29587 15.0902 1.16187 11.2242 1.16187H7.16895Z"
									/>
								</svg>
								<svg width="48" height="50" viewBox="0 0 48 50" id="play">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M16.4373 1.51421C9.2516 -2.62697 0 2.21455 0 10.1161V39.8837C0 47.7854 9.2516 52.6271 16.4373 48.4857L42.2633 33.6017C49.1067 29.6579 49.1067 20.3419 42.2633 16.3981L16.4373 1.51421Z"
									/>
								</svg>
							</div>
							{/* Skip button */}
							<div onClick={sendVoteToSkip}>
								<svg width="44" height="40" viewBox="0 0 44 40" id="skip">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0 8.26922C0 1.67571 8.25091 -2.25705 14.4108 1.40037L34.1677 13.1311C35.4242 13.8771 36.3938 14.8281 37.0766 15.8909V3.48927C37.0766 1.96952 38.4599 0.737489 40.1663 0.737489C41.8728 0.737489 43.2561 1.96952 43.2561 3.48927V36.5105C43.2561 38.0303 41.8728 39.2623 40.1663 39.2623C38.4599 39.2623 37.0766 38.0303 37.0766 36.5105V24.1091C36.3938 25.1715 35.4242 26.1228 34.1677 26.8688L14.4108 38.5997C8.25088 42.2571 0 38.3242 0 31.7307V8.26922Z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<footer className="footer__music-player">
					<div className="footer__container">
						{/* Tracks List Button */}
						<div className="footer__tracks-list">
							<div className="footer__box--tracks-list">
								<div className="footer__box footer__box--tracks">
									{playlistSubscriptionButtonRender}
									<h1 className="footer__content--box-title">Canciones recientes</h1>
									<div className="footer__box--content">
										{successTracks.length === 0 ? (
											<p className="texto-ayuda">
												Aquí aparecerán las canciones que les hayan gustado a todos <br />
												<small>Manten el flow</small>
											</p>
										) : (
											successTracks
										)}
									</div>
								</div>
								<div className="footer__triangle-1">
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
							<svg
								onClick={() => {
									showLists(0);
								}}
								width="54"
								height="39"
								viewBox="0 0 54 39"
								id="tracks"
							>
								<path
									d="M3 3H30.3009M3 24H17.3689M3 35H17.3689M3 13H27.5"
									stroke="var(--white)"
									strokeWidth="5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M40.4037 1.00039C40.1479 1.00741 39.9161 1.11051 39.7431 1.27489C39.726 1.29113 39.7095 1.30792 39.6937 1.32522C39.531 1.50308 39.4317 1.73995 39.4317 2.00001V9.71209V26.1092C38.2051 24.8891 36.5144 24.1351 34.6476 24.1351C30.9009 24.1351 27.8635 27.1724 27.8635 30.9192C27.8635 34.6659 30.9009 37.7032 34.6476 37.7032C38.3904 37.7032 41.4253 34.6723 41.4316 30.931L41.4317 30.9203V10.8925L51.8354 12.6265C52.1254 12.6748 52.4219 12.5931 52.6462 12.4031C52.8705 12.2131 52.9998 11.9341 52.9998 11.6401V3.92803C52.9998 3.43919 52.6464 3.022 52.1642 2.94163L40.6147 1.01671C40.5637 1.00729 40.5114 1.00173 40.4581 1.00035C40.44 0.999869 40.4218 0.999885 40.4037 1.00039Z"
									fill="var(--white)"
								/>
								<path
									d="M39.7431 1.27489L40.4316 2.00005L40.4318 1.9999L39.7431 1.27489ZM40.4037 1.00039L40.4312 2.00001L40.4317 2L40.4037 1.00039ZM39.6937 1.32522L40.4315 2.00021L40.4317 2.00003L39.6937 1.32522ZM39.4317 26.1092L38.7265 26.8182C39.0129 27.1031 39.4426 27.1877 39.8156 27.0326C40.1886 26.8775 40.4317 26.5132 40.4317 26.1092H39.4317ZM41.4316 30.931L40.4316 30.9257L40.4316 30.9293L41.4316 30.931ZM41.4317 30.9203L42.4317 30.9256V30.9203H41.4317ZM41.4317 10.8925L41.5961 9.90615C41.3061 9.85783 41.0096 9.93952 40.7853 10.1295C40.561 10.3195 40.4317 10.5986 40.4317 10.8925H41.4317ZM51.8354 12.6265L51.9998 11.6401H51.9998L51.8354 12.6265ZM52.6462 12.4031L51.9998 11.6401L51.9998 11.6401L52.6462 12.4031ZM52.1642 2.94163L51.9998 3.92803L51.9998 3.92803L52.1642 2.94163ZM40.6147 1.01671L40.4328 2.00004C40.4386 2.00111 40.4445 2.00213 40.4503 2.0031L40.6147 1.01671ZM40.4581 1.00035L40.4317 2L40.4322 2.00001L40.4581 1.00035ZM40.4318 1.9999L40.4312 2.00001L40.3763 0.000766993C39.8643 0.0148184 39.3994 0.22206 39.0543 0.549879L40.4318 1.9999ZM40.4317 2.00003L40.4316 2.00005L39.0545 0.549727C39.0203 0.582194 38.9873 0.615779 38.9557 0.650408L40.4317 2.00003ZM40.4317 2.00001L40.4315 2.00021L38.9558 0.650234C38.6311 1.0052 38.4317 1.48047 38.4317 2.00001H40.4317ZM40.4317 9.71209V2.00001H38.4317V9.71209H40.4317ZM40.4317 26.1092V9.71209H38.4317V26.1092H40.4317ZM34.6476 25.1351C36.2395 25.1351 37.6796 25.7769 38.7265 26.8182L40.1369 25.4002C38.7305 24.0014 36.7893 23.1351 34.6476 23.1351V25.1351ZM28.8635 30.9192C28.8635 27.7247 31.4531 25.1351 34.6476 25.1351V23.1351C30.3486 23.1351 26.8635 26.6202 26.8635 30.9192H28.8635ZM34.6476 36.7032C31.4531 36.7032 28.8635 34.1136 28.8635 30.9192H26.8635C26.8635 35.2182 30.3486 38.7032 34.6476 38.7032V36.7032ZM40.4316 30.9293C40.4262 34.1191 37.8387 36.7032 34.6476 36.7032V38.7032C38.9421 38.7032 42.4243 35.2255 42.4316 30.9327L40.4316 30.9293ZM40.4317 30.915L40.4316 30.9257L42.4316 30.9363L42.4317 30.9256L40.4317 30.915ZM40.4317 10.8925V30.9203H42.4317V10.8925H40.4317ZM51.9998 11.6401L41.5961 9.90615L41.2673 11.8789L51.671 13.6129L51.9998 11.6401ZM51.9998 11.6401L51.9998 11.6401L51.671 13.6129C52.2509 13.7095 52.844 13.5462 53.2926 13.1661L51.9998 11.6401ZM51.9998 11.6401V11.6401L53.2926 13.1661C53.7411 12.7861 53.9998 12.228 53.9998 11.6401H51.9998ZM51.9998 3.92803V11.6401H53.9998V3.92803H51.9998ZM51.9998 3.92803V3.92803H53.9998C53.9998 2.95035 53.293 2.11597 52.3286 1.95524L51.9998 3.92803ZM40.4503 2.0031L51.9998 3.92803L52.3286 1.95524L40.7791 0.0303168L40.4503 2.0031ZM40.4322 2.00001L40.4328 2.00004L40.7965 0.033381C40.6944 0.0144917 40.5899 0.00343406 40.4841 0.000686586L40.4322 2.00001ZM40.4317 2L40.4317 2L40.4846 0.000700414C40.4483 -0.000261545 40.412 -0.000230908 40.3758 0.000781476L40.4317 2Z"
									fill="var(--white)"
								/>
							</svg>
						</div>
						{/* Recomendations Button */}
						<div className="footer__recommended-list">
							<div className="footer__box--recommended-list">
								<div className="footer__box">
									<h1 className="footer__content--box-title">Canciones recomendadas</h1>
									<div className="footer__box--content">
										{recommendedTracks.length === 0 ? (
											<p className="texto-ayuda">
												Aquí aparecerán las canciones recomendadas
												<br />
												<small>
													<b>Dato:</b> Se recomiendan canciones basadas en las escuchadas recientemente
												</small>
											</p>
										) : (
											recommendedTracks
										)}
									</div>
								</div>
								<div className="footer__triangle-2">
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
							<svg
								onClick={() => {
									showLists(1);
								}}
								width="34"
								height="34"
								viewBox="0 0 34 34"
								fill="none"
								id="recomendations"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M15.3717 4C9.08721 4 4 9.07147 4 15.3183C4 21.5652 9.08721 26.6367 15.3717 26.6367C18.5136 26.6367 21.3556 25.3698 23.4143 23.3201C25.4728 21.2704 26.7434 18.4427 26.7434 15.3183C26.7434 9.07147 21.6562 4 15.3717 4ZM2 15.3183C2 7.95875 7.9908 2 15.3717 2C22.7526 2 28.7434 7.95875 28.7434 15.3183C28.7434 18.6362 27.5243 21.6715 25.5104 24.0022L31.5419 30.0076C31.9333 30.3973 31.9347 31.0305 31.545 31.4218C31.1553 31.8132 30.5221 31.8146 30.1308 31.4249L24.0936 25.4138C21.7524 27.4219 18.7034 28.6367 15.3717 28.6367C7.9908 28.6367 2 22.6779 2 15.3183Z"
									fill="white"
								/>
								<path
									d="M23.4143 23.3201L22.0031 21.9028L23.4143 23.3201ZM25.5104 24.0022L23.9971 22.6946C23.3107 23.4889 23.3554 24.6787 24.0993 25.4194L25.5104 24.0022ZM31.5419 30.0076L32.9531 28.5904L31.5419 30.0076ZM30.1308 31.4249L31.5419 30.0076L30.1308 31.4249ZM24.0936 25.4138L25.5048 23.9965C24.7652 23.2601 23.5837 23.2162 22.7915 23.8957L24.0936 25.4138ZM6 15.3183C6 10.184 10.1838 6 15.3717 6V2C7.99058 2 2 7.95897 2 15.3183H6ZM15.3717 24.6367C10.1838 24.6367 6 20.4527 6 15.3183H2C2 22.6777 7.99058 28.6367 15.3717 28.6367V24.6367ZM22.0031 21.9028C20.305 23.5936 17.9648 24.6367 15.3717 24.6367V28.6367C19.0624 28.6367 22.4063 27.1461 24.8254 24.7374L22.0031 21.9028ZM24.7434 15.3183C24.7434 17.8882 23.701 20.2123 22.0031 21.9028L24.8254 24.7374C27.2446 22.3286 28.7434 18.9971 28.7434 15.3183H24.7434ZM15.3717 6C20.5596 6 24.7434 10.184 24.7434 15.3183H28.7434C28.7434 7.95897 22.7528 2 15.3717 2V6ZM15.3717 0C6.89458 0 0 6.84586 0 15.3183H4C4 9.07165 9.08702 4 15.3717 4V0ZM30.7434 15.3183C30.7434 6.84586 23.8488 0 15.3717 0V4C21.6564 4 26.7434 9.07165 26.7434 15.3183H30.7434ZM27.0238 25.3098C29.3388 22.6305 30.7434 19.1355 30.7434 15.3183H26.7434C26.7434 18.137 25.7097 20.7125 23.9971 22.6946L27.0238 25.3098ZM32.9531 28.5904L26.9216 22.5849L24.0993 25.4194L30.1308 31.4249L32.9531 28.5904ZM32.9622 32.833C34.1313 31.6589 34.1272 29.7594 32.9531 28.5904L30.1308 31.4249C29.7394 31.0352 29.738 30.4021 30.1277 30.0107L32.9622 32.833ZM28.7196 32.8422C29.8937 34.0112 31.7932 34.0071 32.9622 32.833L30.1277 30.0107C30.5174 29.6193 31.1506 29.618 31.5419 30.0076L28.7196 32.8422ZM22.6825 26.8311L28.7196 32.8422L31.5419 30.0076L25.5048 23.9965L22.6825 26.8311ZM15.3717 30.6367C19.1981 30.6367 22.7051 29.2397 25.3957 26.9318L22.7915 23.8957C20.7997 25.6042 18.2087 26.6367 15.3717 26.6367V30.6367ZM0 15.3183C0 23.7908 6.89458 30.6367 15.3717 30.6367V26.6367C9.08702 26.6367 4 21.565 4 15.3183H0Z"
									fill="white"
								/>
							</svg>
						</div>
						{/* Queue Button */}
						<div className="footer__queue-list">
							<div className="footer__box--queue-list">
								<div className="footer__box">
									<h1 className="footer__content--box-title">Canciones en cola</h1>
									<div className="footer__box--content">
										{queueTracks.length === 0 ? (
											<Fragment>
												<p className="footer__box--advice">Ninguna canción en cola</p>
												<p className="footer__box--advice">Pero puedes agregar así...</p>
											</Fragment>
										) : (
											queueTracks
										)}
									</div>
								</div>
								<div className="footer__triangle-3">
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
							<svg
								onClick={() => {
									showLists(2);
								}}
								width="34"
								height="30"
								viewBox="0 0 34 30"
								fill="none"
								id="queue"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M6.47026 7.38283L4.00003 5.21201L4.00003 9.55364L6.47026 7.38283ZM8.64526 8.13399C9.09844 7.73574 9.09844 7.02991 8.64526 6.63166L3.66015 2.25079C3.01402 1.68297 2.00003 2.14178 2.00003 3.00195V11.7637C2.00003 12.6239 3.01402 13.0827 3.66015 12.5149L8.64526 8.13399ZM14 11C14 10.4477 14.4477 10 15 10L31 10C31.5523 10 32 10.4477 32 11C32 11.5523 31.5523 12 31 12L15 12C14.4477 12 14 11.5523 14 11ZM15 2C14.4477 2 14 2.44772 14 3C14 3.55228 14.4477 4 15 4L31 4C31.5523 4 32 3.55228 32 3C32 2.44771 31.5523 2 31 2H15ZM2 19C2 18.4477 2.44772 18 3 18H31C31.5523 18 32 18.4477 32 19C32 19.5523 31.5523 20 31 20H3C2.44772 20 2 19.5523 2 19ZM3 26C2.44772 26 2 26.4477 2 27C2 27.5523 2.44772 28 3 28H31C31.5523 28 32 27.5523 32 27C32 26.4477 31.5523 26 31 26H3Z"
									fill="white"
								/>
								<path
									d="M4.00003 5.21201L4.9902 4.08526C4.54766 3.69636 3.91843 3.60253 3.38167 3.8454C2.84491 4.08827 2.50003 4.62286 2.50003 5.21201L4.00003 5.21201ZM6.47026 7.38283L7.46043 8.50957C7.7845 8.22478 7.97026 7.81425 7.97026 7.38283C7.97026 6.9514 7.7845 6.54087 7.46043 6.25608L6.47026 7.38283ZM4.00003 9.55364L2.50003 9.55364C2.50003 10.1428 2.84491 10.6774 3.38167 10.9203C3.91843 11.1631 4.54766 11.0693 4.9902 10.6804L4.00003 9.55364ZM8.64526 6.63166L9.63543 5.50492L9.63543 5.50492L8.64526 6.63166ZM8.64526 8.13399L9.63543 9.26074L9.63544 9.26074L8.64526 8.13399ZM3.66015 2.25079L4.65032 1.12404L4.65032 1.12404L3.66015 2.25079ZM3.66015 12.5149L2.66997 11.3881L2.66997 11.3881L3.66015 12.5149ZM15 10L15 8.5H15V10ZM31 10L31 11.5H31V10ZM31 12L31 13.5H31V12ZM15 12L15 10.5H15V12ZM15 4V5.5L15 5.5L15 4ZM31 4V2.5L31 2.5L31 4ZM3.00986 6.33875L5.48009 8.50957L7.46043 6.25608L4.9902 4.08526L3.00986 6.33875ZM5.50003 9.55364L5.50003 5.21201L2.50003 5.21201L2.50003 9.55364L5.50003 9.55364ZM5.48009 6.25608L3.00986 8.4269L4.9902 10.6804L7.46043 8.50957L5.48009 6.25608ZM7.65509 7.75841C7.4285 7.55928 7.4285 7.20637 7.65509 7.00725L9.63544 9.26074C10.7684 8.26511 10.7684 6.50054 9.63543 5.50492L7.65509 7.75841ZM2.66997 3.37753L7.65509 7.75841L9.63543 5.50492L4.65032 1.12404L2.66997 3.37753ZM3.50003 3.00195C3.50003 3.43204 2.99303 3.66143 2.66997 3.37753L4.65032 1.12404C3.03501 -0.295485 0.50003 0.851513 0.50003 3.00195H3.50003ZM3.50003 11.7637V3.00195H0.50003V11.7637H3.50003ZM2.66997 11.3881C2.99303 11.1042 3.50003 11.3336 3.50003 11.7637H0.50003C0.50003 13.9141 3.035 15.0611 4.65032 13.6416L2.66997 11.3881ZM7.65509 7.00724L2.66997 11.3881L4.65032 13.6416L9.63543 9.26074L7.65509 7.00724ZM15 8.5C13.6193 8.5 12.5 9.61929 12.5 11H15.5C15.5 11.2761 15.2761 11.5 15 11.5V8.5ZM31 8.5L15 8.5L15 11.5L31 11.5L31 8.5ZM33.5 11C33.5 9.61929 32.3807 8.5 31 8.5V11.5C30.7239 11.5 30.5 11.2761 30.5 11H33.5ZM31 13.5C32.3807 13.5 33.5 12.3807 33.5 11H30.5C30.5 10.7239 30.7239 10.5 31 10.5V13.5ZM15 13.5L31 13.5L31 10.5L15 10.5L15 13.5ZM12.5 11C12.5 12.3807 13.6193 13.5 15 13.5V10.5C15.2761 10.5 15.5 10.7239 15.5 11H12.5ZM15.5 3C15.5 3.27614 15.2761 3.5 15 3.5V0.5C13.6193 0.5 12.5 1.61929 12.5 3H15.5ZM15 2.5C15.2761 2.5 15.5 2.72386 15.5 3H12.5C12.5 4.38071 13.6193 5.5 15 5.5V2.5ZM31 2.5L15 2.5L15 5.5L31 5.5L31 2.5ZM30.5 3C30.5 2.72386 30.7239 2.5 31 2.5V5.5C32.3807 5.5 33.5 4.38071 33.5 3H30.5ZM31 3.5C30.7239 3.5 30.5 3.27614 30.5 3H33.5C33.5 1.61929 32.3807 0.5 31 0.5V3.5ZM15 3.5H31V0.5H15V3.5ZM3 16.5C1.61929 16.5 0.5 17.6193 0.5 19H3.5C3.5 19.2761 3.27614 19.5 3 19.5V16.5ZM31 16.5H3V19.5H31V16.5ZM33.5 19C33.5 17.6193 32.3807 16.5 31 16.5V19.5C30.7239 19.5 30.5 19.2761 30.5 19H33.5ZM31 21.5C32.3807 21.5 33.5 20.3807 33.5 19H30.5C30.5 18.7239 30.7239 18.5 31 18.5V21.5ZM3 21.5H31V18.5H3V21.5ZM0.5 19C0.5 20.3807 1.61929 21.5 3 21.5V18.5C3.27614 18.5 3.5 18.7239 3.5 19H0.5ZM3.5 27C3.5 27.2761 3.27614 27.5 3 27.5V24.5C1.61929 24.5 0.5 25.6193 0.5 27H3.5ZM3 26.5C3.27614 26.5 3.5 26.7239 3.5 27H0.5C0.5 28.3807 1.61929 29.5 3 29.5V26.5ZM31 26.5H3V29.5H31V26.5ZM30.5 27C30.5 26.7239 30.7239 26.5 31 26.5V29.5C32.3807 29.5 33.5 28.3807 33.5 27H30.5ZM31 27.5C30.7239 27.5 30.5 27.2761 30.5 27H33.5C33.5 25.6193 32.3807 24.5 31 24.5V27.5ZM3 27.5H31V24.5H3V27.5Z"
									fill="white"
								/>
							</svg>
						</div>
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
		</Fragment>
	);
}

// utils
function convertArtistsToAnchor(artists) {
	let artists_len = artists.length;
	return artists.map((artist, index) => (
		<a
			key={artist.name}
			target="_blank"
			className="song__details--anchor"
			rel="noreferrer noopener"
			href={artist.external_urls.spotify}
		>
			{artist.name} {index >= artists_len - 1 ? "" : ", "}
		</a>
	));
}

function mapUsers(userList) {
	return userList.map((user) => (
		/* 
		<div key={user.id} className="aside__container--user">
		// Las keys se repiten porque son los mismos, pero no se puede usar el mismo key porque se repite en el map - Copilot :)
		*/
		<div key={user.id} className="aside__container--user">
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={user.uri ? user.uri : "user is not authenticated in spotify"}
			>
				<img
					src={
						user.image_url === null
							? "https://cdn3.iconfinder.com/data/icons/login-6/512/LOGIN-10-512.png"
							: user.image_url
					}
					alt="avatar"
				/>
			</a>
			<div>
				<p>
					Id: <span>{user.id}</span>
				</p>
				<p>
					Usuario: <span>{user.display_name === null ? user.id : user.display_name}</span>
				</p>
				{/* 
				<br /> 
				<p>
					uri: <u>{user.uri ? user.uri : "user is not authenticated in spotify"}</u>
				</p>
				<br />
				*/}
				<p>
					Autenticado: <span>{user.is_authenticated ? "Si" : "no"}</span>
				</p>
				{/* <p>
					spotify public link:
					{user.external_url === null ? (
						<>
							{" "}
							<u> No url for anonymous users</u>
						</>
					) : (
						<a href={user.external_url}> {user.external_url}</a>
					)}
				</p> */}
			</div>
		</div>
	));
}

function showQrCode() {
	return (
		// QR reference: qrcode.react
		<div className="aside__container--qr">
			<h1 className="aside__title--qr">¡Tus amigos se pueden unir escaneando este código QR!</h1>
			<QRCode value={window.location.href} level="M" size={250} bgColor="white" />
		</div>
	);
}

function sendVoteToSkip() {
	function voteToSkipResponse(data, responseCode) {
		if (responseCode === 201) {
			const Toast = Swal.mixin({
				customClass: {
					title: "swal-text",
				},
				toast: true,
				position: "top",
				showConfirmButton: false,
				background: "var(--gradient)",
				timer: 2000,
				timerProgressBar: true,
			});

			Toast.fire({
				icon: "success",
				title: "Voto enviado exitosamente",
			});
		} else if (responseCode === 410) {
			Swal.fire({
				customClass: {
					title: "swal-title",
					confirmButton: "swal-button-text",
					htmlContainer: "swal-text",
				},
				type: "info",
				title: "⏱",
				background: "var(--gradient)",
				text: "Se terminó el tiempo para votar",
				timer: 2000,
			});
		} else if (responseCode === 208) {
			Swal.fire({
				customClass: {
					title: "swal-title",
					confirmButton: "swal-button-text",
					htmlContainer: "swal-text",
				},
				type: "info",
				title: "¡Voto enviado!",
				background: "var(--gradient)",
				text: "Ya votaste para saltar esta canción",
				timer: 2000,
			});
		}
	}
	let body = {
		code: localStorage.getItem("room_code"),
		track_id: localStorage.getItem("track_id"),
	};
	voteToSkip(body, voteToSkipResponse);
}

const showLists = (list) => {
	const wrapper = document.getElementById("wrapper");
	const lists = document.querySelectorAll(
		".footer__tracks-list, .footer__recommended-list, .footer__queue-list"
	);
	// console.log(lists[list]);
	lists.forEach((listChild) => {
		if (listChild !== lists[list]) {
			listChild.children[0].classList.remove("show__list");
			listChild.children[1].classList.remove("active");
		}
	});
	lists[list].children[0].classList.toggle("show__list");
	lists[list].children[1].classList.toggle("active");

	wrapper.addEventListener("click", () => {
		lists.forEach((listChild) => {
			listChild.children[0].classList.remove("show__list");
			listChild.children[1].classList.remove("active");
		});
	});
};

window.onload = () => {};

let image_b64 =
	"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";
