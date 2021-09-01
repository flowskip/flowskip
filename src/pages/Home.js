import React from "react";
import { useRef } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { joinRoom } from "../components/FlowskipApi";
import Swal from "sweetalert2";

import Button from "../components/Button";
import LogoImg from "../assets/img/logo.png";
import Loader from "../components/Loader";

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
				<Form>
					<InvalidCode id="invalid-code">Código inválido.</InvalidCode>
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
		} else if (responseCode === 404) {
			Swal.fire({
				customClass: {
					title: "swal-title",
					confirmButton: "swal-button-text",
					htmlContainer: "swal-text",
				},
				title: "No se encontró el código de la sala",
				text: "El código de la sala no existe.",
				icon: "warning",
				background: "var(--gradient)",
				confirmButtonColor: "rgba(0, 205, 0, 1)",
			});
		}
	}

	function joinRoomFromCode(e) {
		e.preventDefault();
		if (inputCode.current !== "" && inputCode.current.length >= 3) {
			console.log("Join From Room Code");
			joinRoom({ code: inputCode.current }, joinRoomResponse);
			return <Loader />;
		} else {
			const inputCode = document.getElementById("code");
			const invalidCode = document.getElementById("invalid-code");
			inputCode.focus();
			inputCode.style.animationPlayState = "running";
			inputCode.style.border = "2px solid red";
			invalidCode.style.display = "inline-block";
			setTimeout(() => {
				inputCode.style.animationPlayState = "paused";
			}, 500);

			setTimeout(() => {
				inputCode.style.border = "initial";
				invalidCode.style.display = "none";
			}, 2000);
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
	min-height: 100vh;
	display: grid;
	grid-template-rows: 50% 50%;

	@media screen and (max-width: 926px) and (orientation: portrait) {
		padding: 15vw;
		height: 100vh;
		min-height: 100vh;
		display: grid;
		grid-template-rows: 50% 50%;
	}

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
	position: relative;
`;

const InvalidCode = styled.p`
	color: var(--white);
	filter: contrast(150%);
	font: 1.5rem/1.5rem var(--font-bold);
	position: absolute;
	top: -20px;
	display: none;
`;

const InputText = styled.input`
	width: 100%;
	height: 100%;
	padding: 0 10px;
	border-radius: 10px;
	font-size: 1.8rem;
	text-align: center;
	animation: shake 0.5s ease-in-out infinite paused;

	@keyframes shake {
		0% {
			transform: translateX(-10px);
		}
		16% {
			transform: translateX(-10px);
		}
		32% {
			transform: translateX(10px);
		}
		48% {
			transform: translateX(-10px);
		}
		64% {
			transform: translateX(10px);
		}
		80% {
			transform: translateX(-10px);
		}
		100% {
			transform: translateX(-10px);
		}
	}

	&:focus {
		outline: none;
		border: 1px solid var(--primary);
		box-shadow: 0 0 0 3px var(--primary);
	}

	&:hover {
		outline: none;
		border: 1px solid var(--primary);
		box-shadow: 0 0 0 3px var(--primary);
	}

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
