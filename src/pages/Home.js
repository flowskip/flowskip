import React from "react";
import { useRef } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { joinRoom } from "../components/FlowskipApi";

import Loader from "../components/Loader";
import Button from "../components/Button";
import LogoImg from "../assets/img/logo.png";

const defRoomCodeInDb = localStorage.getItem("room_code") !== null ? localStorage.getItem("room_code") : "";
const defInputCode = "";
export default function Home() {
	// const [roomCode, setRoomCode] = useState(defRoomCodeInDb);
	// const [inputCode, setInputCode] = useState(defInputCode);
	const roomCodeInDb = useRef(defRoomCodeInDb);
	const inputCode = useRef(defInputCode);

	const history = useHistory();

	if (roomCodeInDb.current !== "") {
		// ? Comment to avoid auto redirect if there's a room code in local storage
		console.log("Room code in LocalStorage!");
		history.push("room/" + roomCodeInDb.current);
		return null;
	}

	return (
		<MainContainer>
			<LogoContainer>
				<Logo src={LogoImg} alt="Logo" />
			</LogoContainer>
			<CenterSection>
				<Title>¡Bienvenido!</Title>
				<Form action="">
					<InputText onChange={() => readInput()} id="code" type="text" placeholder="Código" />
					<InputSubmit type="submit" onClick={(e) => joinRoomFromCode(e)} value="&#9654;" />
				</Form>
				<Button onClick={(e) => createRoomClick(e)}>Nueva Sala</Button>
			</CenterSection>
		</MainContainer>
	);

	function createRoomClick(e) {
		e.preventDefault();
		if (localStorage.getItem("spotify_authenticated") !== "true") {
			localStorage.setItem("next", "config-room");
		}
		history.push("config-room");
	}

	function joinRoomResponse(data, responseCode) {
		let roomCode = "";
		if (responseCode === 201) {
			roomCode = inputCode.current;
			localStorage.setItem("room_code", roomCode);
			history.push("room/" + roomCode);
		} else if (responseCode === 208) {
			roomCode = data.code;
			localStorage.setItem("room_code", roomCode);
			history.push("room/" + roomCode);
		}
	}

	function joinRoomFromCode(e) {
		e.preventDefault();
		if (inputCode.current !== "" && inputCode.current.length >= 3) {
			console.log("Join From Room Code");
			joinRoom({ code: inputCode.current }, joinRoomResponse);
			// here. Set loading screen!
		} else {
			alert("Enter a code in the field");
			document.getElementById("code").focus();
		}
	}

	function readInput() {
		var input = document.getElementById("code");
		inputCode.current = input.value;
		console.log(inputCode.current);
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
		gap: 20px;
	}

	@media screen and (min-width: 901px) {
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
`;

const CenterSection = styled.section`
	display: grid;
	grid-template-rows: 30% 30% 30%;
	place-items: center center;
	max-width: 300px;
	margin: 0 auto;

	@media screen and (orientation: landscape) and (max-width: 900px) {
		height: 100%;
		max-height: 300px;
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
	color: var(--white);
	font-size: clamp(2.5rem, 8vw, 4rem);
	text-align: center;
	font-family: var(--font-bold);

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
	color: var(--white);
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
