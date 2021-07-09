import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getUserDetails } from "../components/FlowskipApi";

const defUserDetails = {};
const defIsPremium = true;
export default function ConfigRoom() {
  const history = useHistory()
  const [userDetails, setUserDetails] = useState(defUserDetails);
  const [isPremium, setIsPremium] = useState(defIsPremium);

  useEffect(() => {
    if(Object.keys(userDetails).length === 0 && userDetails.constructor === Object){
      getUserDetails(setUserDetails);
    }
    else{
      if(! userDetails.spotify_user.product === 'premium'){
        console.log("user is not premium");
        setIsPremium(false);
      }
      else if(userDetails.spotify_user.product === 'premium'){
        console.log("user is premium");
      }
      else{
        console.log("error");
      }
    }
    
  }, [userDetails])

  

  return (
    <React.Fragment>
      {isPremium && renderConfigRoom()}
      {!isPremium && renderUpgradeToSpotifyPremium()}
    </React.Fragment>
  );

  function renderConfigRoom(){
    return(
      <MainContainer>
        <h1>User is premium, so... he/she can create a room</h1>
        <br/>
        <Button onClick={() => history.push("/")}>Return to home</Button>
      </MainContainer>
    );
  }

  function renderUpgradeToSpotifyPremium(){
    return(
      <MainContainer>
        <h1>Create a room requires spotify premium</h1>
        <h3>Premium is the ultimate experience in spotify, Upgrade Now</h3>
        <p>put a link to spotify premium, es un guiño para que spotify nos ponga en el carrusel c:</p>
        <br/>
        <Button onClick={() => history.push("/")}>Return to home</Button>
      </MainContainer>
    );
  }
}

const MainContainer = styled.main`
  display: grid;
  grid-template-areas: "Title
                      Controls";
`;

// const Title = styled.h1`
//   color: white;
//   font-size: clamp(2.5rem, 8vw, 4rem);
//   text-align: center;
//   font-family: var(--font-bungee-bold);

//   @media screen and (orientation: landscape) and (max-width: 900px) {
//     font-size: clamp(2.5rem, 8vh, 4rem);
//   }
// `;

// const Subtitle = styled.h2`
//   color: white;
//   font-size: 1.6rem;
//   text-align: center;
//   font-family: var(--font-bungee-bold);
//   opacity: 0.9;
// `;

// const Divider = styled.div`
//   display: flex;
//   flex-direction: column-reverse;
//   place-items: center center;
// `;

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: 50% 50%;
//   place-items: center center;
//   margin: 0 0 20px;
// `;

// const Buttons = styled.div`
//   display: grid;
//   grid-template-rows: repeat(1fr, 2);
// `;
