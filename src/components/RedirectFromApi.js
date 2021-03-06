import React from "react";
import { useHistory } from "react-router";
import Loader from "./Loader";
import { getRoomDetails } from "./FlowskipApi";
import Swal from "sweetalert2";

export default function RedirectFromApi() {
	const loadingScreen = true;
	const okResponseCodes = ["200", "208"];
	const hasNextPathname = localStorage.getItem("next") === null ? false : true;
	const nextPathname = localStorage.getItem("next");
	localStorage.removeItem("next");

	// Getting session_key and status from the windowsParams
	const windowParams = new URL(window.location.href);
	const sessionKeyFromParams = windowParams.searchParams.get("session_key").toString();
	const statusFromParams = windowParams.searchParams.get("status").toString();
	const history = useHistory();

	handleRedirectResponse();

	return <React.Fragment>{loadingScreen && <Loader />}</React.Fragment>;

	function handleRedirectResponse() {
		if (statusFromParams === "401") {
			history.push("spotify-not-authorized");
		} else if (okResponseCodes.includes(statusFromParams)) {
			successfullyAuthenticated();
		} else {
			history.push("error");
		}
	}

	function successfullyAuthenticated() {
		localStorage.setItem("spotify_authenticated", "true");
		if (statusFromParams === "208") {
			if (localStorage.getItem("session_key") !== sessionKeyFromParams) {
				localStorage.setItem("session_key", sessionKeyFromParams);
			}
		}
		if (!hasNextPathname) {
			Swal.fire({
				customClass: {
					title: "swal-title",
					confirmButton: "swal-button-text",
					htmlContainer: "swal-text",
				},
				title: "Redirected from Spotify",
				text: "You have been redirected from Spotify. Please wait while we load your room.",
				type: "info",
				confirmButtonText: "Ok",
			});
			history.push("/");
		} else {
			if (nextPathname === "config-room") {
				history.push(nextPathname);
			} else {
				getRoomDetails(getRoomDetailsResponse);
			}
		}
	}

	function getRoomDetailsResponse(data, responseCode) {
		if (responseCode === 404) {
			console.log("No room, pushing to: " + nextPathname);
			history.push(nextPathname);
		} else if (responseCode === 200) {
			console.log();
			if (data.user_is_host === true) {
				// TODO: Open the config room instead the room
				history.push("room/" + data.code);
			} else {
				history.push("room/" + data.code);
			}
		}
	}
}
