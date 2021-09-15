import React, { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import {
	joinRoom,
	calculateDeltas,
	getRoomDetails,
	getTracks,
	addTrackToQueue,
	getUserDetails,
	leaveRoom,
	listAllFeaturedPlaylists,
	search
} from "../components/FlowskipApi";
import MusicPlayer from "../components/MusicPlayer";
import Loader from "../components/Loader";
import JustLoader from "../components/JustLoader";

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
const defRecommendedTracks = [];
const defSuccessTracks = [];
const defQueueTracks = [];
const defFeaturedPlaylists = [];
const defQueryResults = [];
const defQuery = "";

export default function Room() {
	const [deltas, setDeltas] = useState(null);
	const [tracks, setTracks] = useState(defTracks);
	const [clickProperties, setClickProperties] = useState({isClicked: false, trackId: ""});
	const [lifeCycleStatus, setLifeCycleStatus] = useState("starting");
	const [query, setQuery] = useState(defQuery);
	const controllers = useRef([]);
	const recommendedTracks = useRef(defRecommendedTracks);
	const successTracks = useRef(defSuccessTracks);
	const queueTracks = useRef(defQueueTracks);
	const featuredPlaylists = useRef(defFeaturedPlaylists);
	const queryTracks = useRef(defQueryResults)
	const trackId = useRef(defTrackId);
	const oldTrackId = useRef(defTrackId);
	const roomDetails = useRef(defRoomDetails);
	const user = useRef(null);
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
		if (user.current === null) {
			updateUserDetails();
		}
		if (featuredPlaylists.current.length === 0 && recommendedTracks.current.length === 0){
			getFeaturedPlaylists();
		}
		let cleanupSignals = controllers.current;
		return function cleanup() {
			cleanupSignals.forEach((ctr) => {
				ctr.abort()
			})
		};
	}, []);

	useEffect(() => {
		let mapRecommendedTracks = mapTracks(tracks.recommended_tracks, "addSongToQueue");
		let mapSuccessTracks = mapTracks(tracks.success_tracks)
		let mapQueueTracks = mapTracks(tracks.queue_tracks);
		
		recommendedTracks.current = mapRecommendedTracks;

		if (mapSuccessTracks.length !== successTracks.length){
			successTracks.current = mapSuccessTracks;
		}
		if (mapQueueTracks.length !== queueTracks.length){
			queueTracks.current = mapQueueTracks;
		}

		if(query.length > 0){
			updateQueryResults();
		} else {
			queryTracks.current = [];
		}

		return function cleanup(){
			mapRecommendedTracks = defRecommendedTracks;
			mapSuccessTracks = defSuccessTracks;
			mapQueueTracks = defQueueTracks;
		}
	}, [tracks, query, clickProperties]);

	if (roomCodeFromPath.current !== localStorage.getItem("room_code")) {
		localStorage.setItem("room_code", roomCodeFromPath.current);
	}

	if (!["starting", "started", "exiting", "exited"].includes(lifeCycleStatus)){
		console.error(`lifeCycleStatus '${lifeCycleStatus}' not implemented`);
		return(
			<Fragment>
				<Loader />
			</Fragment>
		);
	}

	return (
		<Fragment>
			{lifeCycleStatus === "starting" && <Loader />}
			{lifeCycleStatus === "started" && renderMusicPlayer()}
			{lifeCycleStatus === "exiting" && exitRoom()}
			{lifeCycleStatus === "exited" &&  userHasExitedAlready()}
		</Fragment>
	);

	function userHasExitedAlready(){
		localStorage.clear();
		window.location.href = "/";
	}
	
	function exitRoom(){
		async function leaveRoomAndContinue (){
			const ensureLeave = (err) => {
				localStorage.clear();
				window.location.href = "/";
			}
			clearInterval(interval.current);
			leaveRoom(leaveRoomResponse, {}, ensureLeave);
			setLifeCycleStatus("exited");
		}
		leaveRoomAndContinue();
		return <Loader/>;
	}
	function updateProps(data) {
		if (data.current_playback.item === undefined) {
			trackId.current = "";
		} else {
			trackId.current = data.current_playback.item.id;
		}
		currentPlayback.current = data.current_playback;
		participants.current = data.participants;
		votesToSkip.current = data.votes_to_skip;
		queue.current = data.queue;
		if(queue.current.new.length > 0){
			updateTracksLists();
		}
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
				if (lifeCycleStatus !== "started" && lifeCycleStatus !== "exiting") {
					setLifeCycleStatus("started");
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
				if (data.detail === "user not in room" && lifeCycleStatus !== "exiting") {
					joinRoomFromCodeInPath();
				}
			}
			// logic to update the room details if apply
		}
		let controller = new AbortController();
		let signal = controller.signal
		getRoomDetails(getRoomDetailsResponse, {signal: signal});
		controllers.current.push(controller);
		updateTracksLists();
	}

	function updateUserDetails() {
		function getUserDetailsResponse(data, responseCode) {
			if (responseCode === 200) {
				user.current = data;
			} else {
				console.log("user details not get");
			}
		}
		let controller = new AbortController();
		let signal = controller.signal
		getUserDetails(getUserDetailsResponse, {signal: signal});
		controllers.current.push(controller);
	}


	function updateTracksLists() {
		function getTracksResponse(data, responseCode) {
			if (responseCode === 200) {
				setTracks(data);
			} else {
				console.warn("No tracks obtained, data: ", data);
			}
		}
		if(lifeCycleStatus !== "exiting"){
			getTracks(localStorage.getItem("room_code"), getTracksResponse);
		}
	}

	function getFeaturedPlaylists(){
		function listAllFeaturedPlaylistsResponse(data, responseCode){
			featuredPlaylists.current = mapPlaylists(data.playlists.items);
		}
		let params = {
			code: localStorage.getItem("room_code")
		}
		listAllFeaturedPlaylists(params, listAllFeaturedPlaylistsResponse)
	}

	function updateQueryResults(){
		function searchResponse(data, statusCode){
			if(statusCode === 200){
				data.tracks.items.forEach(item => {
					item.track_id = item.id;
					item.album_image_url = item.album.images[1].url;
					item.artists_str = item.artists.map(artist => artist.name).join(", ");
					item.album_name = item.album.name;
				});
				queryTracks.current = mapTracks(data.tracks.items, "addSongToQueue");
			} else {
				console.warn("not success response");
				console.log(data, statusCode);
			}
		}
		
		let params = {
			q:query,
			type: "track",
			code: localStorage.getItem("room_code")
		}
		search(params, searchResponse)
	}

	function renderMusicPlayer() {
		return (
			<MusicPlayer
				currentPlayback={currentPlayback.current}
				participants={participants.current}
				votesToSkip={votesToSkip.current}
				queue={queue.current}
				roomDetails={roomDetails.current}
				successTracks={successTracks.current}
				recommendedTracks={recommendedTracks.current}
				queueTracks={queueTracks.current}
				featuredPlaylists={featuredPlaylists.current}
				query={query}
				setQuery={setQuery}
				queryTracks={queryTracks.current}
				user={user.current}
				lifeCycleStatusState={[lifeCycleStatus, setLifeCycleStatus]}
			/>
		);
	}

	function sendTrackToQueue(e, trackId) {
		function addTrackToQueueResponse(data, statusCode) {
			if (statusCode === 201) {
				setQuery(defQuery);
			} else {
				console.log(statusCode);
			}
		}

		let body = {
			track_id: trackId,
			code: localStorage.getItem("room_code"),
		};
		if(JSON.stringify(deltas.current_playback) === "{}" ){
			window.open("https://open.spotify.com/track/" + trackId, "_blank", "noreferrer", "noopener'");
		}
		else{
			setClickProperties({isClicked: true, trackId: trackId});
			addTrackToQueue(body, addTrackToQueueResponse);
		}
	}

	function defineTrackActionOnClick(e, action, track) {
		if (action === "openSongInSpotify") {
			window.open(track.external_url, "_blank", "noreferrer", "noopener'");
		} else if (action === "addSongToQueue") {
			sendTrackToQueue(e, track.track_id);
		} else {
			console.log("No action defined");
		}
	}

	function mapTracks(tracksList, action = "openSongInSpotify") {
		const showAsyncMsg = clickProperties.isClicked && action === "addSongToQueue";
		return tracksList.map((track, index) => (
				<div key={index + track.track_id} id={action === "addSongToQueue" ? `queue:${track.track_id}` : track.track_id} onClick={(e) => defineTrackActionOnClick(e, action, track)}>
					<div className="footer__box--content-grid">
						{ showAsyncMsg && clickProperties.trackId === track.track_id ? <JustLoader /> : <img src={track.album_image_url} title={track.name} alt={track.name} />}
						<div>
							{showAsyncMsg && clickProperties.trackId === track.track_id ? (<p>Enviando canción a la cola</p>):(<Fragment><p>
								song: <span>{track.name}</span>
							</p>
							<p>
								by <span>{track.artists_str}</span>
							</p>
							<p>
								album: <span>{track.album_name}</span>
							</p></Fragment>)}
						</div>
					</div>
				</div>
		));
	}

	function definePlaylistActionOnClick(action, playlist) {
		if (action === "openPlaylistInSpotify") {
			window.open(playlist.external_urls.spotify, "_blank", "noreferrer", "noopener'");
		} else {
			console.log("No action defined");
		}
	}

	function mapPlaylists(playlists, action = "openPlaylistInSpotify"){
		return playlists.map((playlist, index) => (
			<div key={playlist.track_id} id={playlist.track_id} onClick={() => definePlaylistActionOnClick(action, playlist)}>
				<div className="footer__box--content-grid">
					<img src={playlist.images[0].url} title={playlist.name} alt={playlist.name} />
					<div>
						<Fragment><p>
							Playlist: <span>{playlist.name}</span>
						</p>
						<p>
							Description: <span>{playlist.description}</span>
						</p></Fragment>
					</div>
				</div>
			</div>
	));
	}
}

function leaveRoomResponse(data, responseCode) {
	localStorage.removeItem("room_code");
	localStorage.removeItem("track_id");
	localStorage.removeItem("playlist_id");
	localStorage.removeItem("tracksInSubscriptionPlaylist");
	if (responseCode === 200) {
		console.log("OK");
	} else if (responseCode === 404) {
		console.log("Room doesn't exist");
	} else {
		console.log("Leave room with problem");
	}
	window.location.href = "/";
}
