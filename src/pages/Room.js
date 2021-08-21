import React, { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import {
	joinRoom,
	calculateDeltas,
	getRoomDetails,
	getTracks,
	addTrackToQueue,
} from "../components/FlowskipApi";
import MusicPlayer from "../components/MusicPlayer";
import Loader from "../components/Loader";

const defTrackId = "";
const defCurrentPlayback = {};
const defParticipants = {
	all: [],
	gone: [],
	new: [],
};
const defVotesToSkip = {
	all: [],
	gone: [],
};
const defQueue = {
	all: [],
	new: [],
};
const defTracks = {
	recommended_tracks: [],
	success_tracks: [],
	queue_tracks: [],
};
const defRoomDetails = null;

const defShowPlayer = false;
export default function Room() {
	const [showMusicPlayer, setShowMusicPlayer] = useState(defShowPlayer);
	const [, setDeltas] = useState(null);
	const [tracks, setTracks] = useState(defTracks);
	const [recommendedTracks, setRecommendedTracks] = useState([]);
	const [successTracks, setSuccessTracks] = useState([]);
	const [queueTracks, setQueueTracks] = useState([]);
	const trackId = useRef(defTrackId);
	const oldTrackId = useRef(defTrackId);
	const roomDetails = useRef(defRoomDetails);
	const currentPlayback = useRef(defCurrentPlayback);
	const participants = useRef(defParticipants);
	const votesToSkip = useRef(defVotesToSkip);
	const queue = useRef(defQueue);
	//const [queue, setQueue] = useState(defQueue);

	const windowPath = window.location.pathname.split("/");
	const roomCodeFromPath = useRef(windowPath[2] ? windowPath[2].toString() : null);
	const interval = useRef(null);

	useEffect(() => {
		interval.current = setInterval(updateState, 1000);
		if (roomDetails.current === null) {
			updateRoomDetails();
		}
		return function cleanup() {
			clearInterval(interval.current);
		};
	}, []);

	useEffect(() => {
		let mapRecommendedTracks = mapTracks(tracks.recommended_tracks, "addSongToQueue");
		let mapSuccessTracks = mapTracks(tracks.success_tracks)
		let mapQueueTracks = mapTracks(tracks.queue_tracks);
		
		setRecommendedTracks(mapRecommendedTracks);

		if (mapSuccessTracks.length !== successTracks.length){
			setSuccessTracks(mapSuccessTracks);
		}

		if (mapQueueTracks.length !== queueTracks.length){
			setQueueTracks(mapQueueTracks);
		}
	}, [tracks]);

	useEffect(() => {
		updateTracksLists();
	}, [queueTracks]);

	if (roomCodeFromPath.current !== localStorage.getItem("room_code")) {
		localStorage.setItem("room_code", roomCodeFromPath.current);
	}

	return (
		<Fragment>
			{showMusicPlayer && renderMusicPlayer()}
			{!showMusicPlayer && <Loader />}
		</Fragment>
	);

	function updateProps(data) {
		if (data.current_playback.item === undefined) {
			trackId.current = "";
		} else {
			trackId.current = data.current_playback.item.id;
		}
		currentPlayback.current = data.current_playback;
		participants.current = data.participants;
		votesToSkip.current = data.votes_to_skip;
	}

	function updateState() {
		let actualState = {
			track_id: trackId.current,
			code: roomCodeFromPath.current,
			participants: participants.current.all,
			votes: votesToSkip.current.all,
			queue: queue.current.all,
		};
		function calculateDeltasResponse(data, responseCode) {
			if (responseCode === 200) {
				updateProps(data);
				setDeltas(data);
				if (!showMusicPlayer) {
					setShowMusicPlayer(true);
				}
			} else if (responseCode === 400) {
				console.log(data);
			} else if (responseCode === 404) {
				localStorage.removeItem("room_code");
				localStorage.removeItem("spotify_authenticated");
				window.location.href = "/";
			} else if (responseCode === 500) {
				console.log(data);
			}
		}
		if (trackId.current !== oldTrackId.current) {
			console.log("track id changed");
			localStorage.setItem("track_id", trackId.current);
			oldTrackId.current = trackId.current;
			updateRoomDetails();
		}
		calculateDeltas(actualState, calculateDeltasResponse);
	}

	function joinRoomFromCodeInPath() {
		function joinRoomResponse(data, responseCode) {
			// handle http responseCode
			if (responseCode === 201) {
				updateRoomDetails();
			} else {
				localStorage.clear();
			}
		}
		let data = {
			code: roomCodeFromPath.current,
		};
		joinRoom(data, joinRoomResponse);
	}

	function updateRoomDetails() {
		function getRoomDetailsResponse(data, responseCode) {
			if (responseCode === 200) {
				roomDetails.current = data;
			} else if (responseCode === 403) {
				if (data.detail === "user not in room") {
					joinRoomFromCodeInPath();
				}
			}
			// logic to update the room details if apply
		}
		getRoomDetails(getRoomDetailsResponse);
		updateTracksLists();
	}

	function updateTracksLists() {
		function getTracksResponse(data, responseCode) {
			if (responseCode === 200) {
				setTracks(data);
			} else {
				console.warn("No tracks obtained, data: ", data);
			}
		}
		getTracks(localStorage.getItem("room_code"), getTracksResponse);
	}

	function renderMusicPlayer() {
		return (
			<MusicPlayer
				currentPlayback={currentPlayback.current}
				participants={participants.current}
				votesToSkip={votesToSkip.current}
				queue={queue.current}
				roomDetails={roomDetails.current}
				successTracks={successTracks}
				recommendedTracks={recommendedTracks}
				queueTracks={queueTracks}
			/>
		);
	}

	function sendTrackToQueue(trackId) {
		function addTrackToQueueResponse(data, statusCode) {
			if (statusCode === 201) {
				console.log("Track added to queue");
			} else {
				console.log(statusCode);
			}
		}

		let body = {
			track_id: trackId,
			code: localStorage.getItem("room_code"),
		};
		console.log(body);
		addTrackToQueue(body, addTrackToQueueResponse);
	}

	function defineTrackActionOnClick(action, track) {
		if (action === "openSongInSpotify") {
			window.open(track.external_url, "_blank", "noreferrer", "noopener'");
		} else if (action === "addSongToQueue") {
			sendTrackToQueue(track.track_id);
		} else {
			console.log("No action defined");
		}
	}

	function mapTracks(tracksList, action = "openSongInSpotify") {
		return tracksList.map((track) => (
			/*
       <div key={track.track_id} className="footer__box--content-grid">
       // Las keys se repiten porque son los mismos, pero no se puede usar el mismo key porque se repite en el map - Copilot :)
       */
			<Fragment>
				<div onClick={() => defineTrackActionOnClick(action, track)}>
					<div className="footer__box--content-grid">
						<a target="_blank" rel="noreferrer noopener" href={track.uri}>
							<img src={track.album_image_url} title={track.name} alt={track.name} />
						</a>
						<div>
							{/* <p>track_id: {track.track_id}</p> <br /> */}
							<p>
								song: <span>{track.name}</span>
							</p>
							<p>
								by <span>{track.artists_str}</span>
							</p>
							<p>
								album: <span>{track.album_name}</span>
							</p>
							{/* <p>external_url: {track.external_url}</p> This open just the track in the web */}
							{/* <p>track_id: {track.track_id}</p> */}
							{/* <p>uri: {track.uri}</p> This open the track in his own albun on spotify's app */}
						</div>
					</div>
				</div>
			</Fragment>
		));
	}
}
