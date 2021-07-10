import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getUserDetails } from "../components/FlowskipApi";

const defUserDetails = {};
const defIsPremium = true;
export default function ConfigRoom() {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState(defUserDetails);
  const [isPremium, setIsPremium] = useState(defIsPremium);

  useEffect(() => {
    if (
      Object.keys(userDetails).length === 0 &&
      userDetails.constructor === Object
    ) {
      getUserDetails(setUserDetails);
    } else {
      if (!userDetails.spotify_user.product === "premium") {
        console.log("user is not premium");
        setIsPremium(false);
      } else if (userDetails.spotify_user.product === "premium") {
        console.log("user is premium");
      } else {
        console.log("error");
      }
    }
  }, [userDetails]);

  function handleChange() {
    var input = document.getElementById("votes");
    input.addEventListener("input", function () {
      if (this.value.length > 2) this.value = this.value.slice(0, 2);
    });
  }

  return (
    <React.Fragment>
      {isPremium && renderConfigRoom()}
      {!isPremium && renderUpgradeToSpotifyPremium()}
    </React.Fragment>
  );

  function renderConfigRoom() {
    return (
      <MainContainer>
        <Title>Configuración de la sala</Title>
        <Controls>
          <Subtitle>Controles de los invitados</Subtitle>
          <InputsContainer>
            <RadioButton
              type="radio"
              name="controls"
              id="control"
            ></RadioButton>
            <Label htmlFor="control">Reproducir / Pausar</Label>
            <RadioButton
              type="radio"
              name="controls"
              id="nocontrol"
            ></RadioButton>
            <Label htmlFor="nocontrol">Ninguno</Label>
          </InputsContainer>
        </Controls>
        <Votes>
          <Subtitle>Votos para saltar canción</Subtitle>
          <Input
            id="votes"
            onChange={handleChange}
            type="number"
            placeholder="2"
          ></Input>
        </Votes>
        <RoomButton>¡Crear sala!</RoomButton>
        <BackButton onClick={() => history.push("/")}>Return</BackButton>
      </MainContainer>
    );
  }

  function renderUpgradeToSpotifyPremium() {
    return (
      <MainContainer>
        <h1>Create a room requires spotify premium</h1>
        <h3>Premium is the ultimate experience in spotify, Upgrade Now</h3>
        <p>
          put a link to spotify premium, es un guiño para que spotify nos ponga
          en el carrusel c:
        </p>
        <br />
        <Button>Crear Sala</Button>
        <Button onClick={() => history.push("/")}>Return to home</Button>
      </MainContainer>
    );
  }
}

const MainContainer = styled.main`
  display: grid;
  padding: 15vh 0;
  height: 100vh;
  max-height: 800px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  grid-template-rows: 100px repeat(2, 25%) repeat(2, 15%);
  grid-template-areas:
    "Title"
    "Controls"
    "Votes"
    "ButtonOne"
    "ButtonTwo";
  gap: 10px;
  position: relative;

  @media screen and (max-width: 777px) and (orientation: landscape) {
    padding: 0;
    margin: 20px auto 0;
    grid-template-columns: repeat(2, minmax(10%, 1fr));
    width: 100%;
    max-height: 500px;
    min-width: 90vw;
    grid-template-rows: 100px 25%;
    grid-template-areas: "Title Title" "Controls Votes" "ButtonOne ButtonTwo";
    place-items: center center;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 8vw, 3rem);
  line-height: clamp(2.8rem, 8vw, 3.3rem);
  font-family: var(--font-bungee-bold);
  color: white;
  text-align: center;
  grid-area: Title;
`;

const Controls = styled.div`
  text-align: center;
  grid-area: Controls;
`;

const Subtitle = styled.h2`
  color: white;
  font-size: 2rem;
  line-height: 2.3rem;
  font-family: var(--font-bungee-bold);
`;

const InputsContainer = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-evenly;
`;

const RadioButton = styled.input`
  display: none;

  &:checked + label {
    padding: 5px 10px;
    background: var(--purple);
    box-shadow: 0 3px 10px 1px #00000033;
  }

  &:checked + label::before {
    display: none;
  }
`;

const Label = styled.label`
  color: white;
  font-size: 1.6rem;
  position: relative;
  padding: 5px 5px 5px 30px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;

  &::before {
    content: "";
    background: white;
    height: 20px;
    width: 20px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    border: 2px solid var(--purple);
  }
`;

const Votes = styled.div`
  text-align: center;
  grid-area: Votes;
`;

const Input = styled.input`
  text-align: center;
  margin-top: 20px;
  background: transparent;
  border: none;
  width: 40px;
  padding: 5px;
  color: white;
  font-size: 1.8rem;
  border-bottom: 1px solid white;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: white;
  }
`;

const RoomButton = styled(Button)`
  grid-area: ButtonOne;
  padding: 10px 0;
`;

const BackButton = styled(Button)`
  max-width: 150px;
  display: block;
  grid-area: ButtonTwo;
`;
