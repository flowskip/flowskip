import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components'

import { startSession, createUser, getSpotifyAuthenticationUrl } from '../components/FlowskipApi';

import './styles/home.css'

import LogoImg from '../assets/img/logo.png'


const defUrl = "";
const isSessionKeyInDbAtStart = localStorage.getItem('session_key') !== null;
const isUserCreatedAtStart = localStorage.getItem('user_created') === 'true';
export default function Home(){
    const [sessionKeyInDb, setSessionKeyInDb] = useState(isSessionKeyInDbAtStart);
    const [userCreated, setUserCreated] = useState(isUserCreatedAtStart);
    const [url, setUrl] = useState(defUrl);
    const history = useHistory();
    useEffect(()=>{
        if(!sessionKeyInDb){
            console.log("getting session_key");
            startSession(setSessionKeyInDb)
        }
        else{
            if(!userCreated){
                console.log("creating user");
                createUser(setUserCreated);
            }
            else{
                // Here all the code to be done with a user
                console.log("blank");
            }
        }
    }, [sessionKeyInDb, userCreated]);

    useEffect(()=>{
        if(url !== ""){
            window.open(url,'_blank');
        }
    },[url])
    
    return(
        <React.Fragment>
            <main className="main">
                <Logo>
                    <img className="main__logo" src={LogoImg} alt="Logo" />
                </Logo>
                <div className="main__container">
                    <Welcome>¡Bienvenido!</Welcome>
                    <form className="main__container--form" action="">
                        <input type="text" placeholder="Código" />
                        <input type="submit" value="&#9654;" />
                    </form>
                    <button onClick={() => verifySpotifyAuth()} className="main__container--button">Crear Nueva Sala</button>
                </div>
            </main>
        </React.Fragment>
    );

    function verifySpotifyAuth(){
        console.log("CLICK!");
        if(localStorage.getItem("spotify_authenticated") === 'true'){
            history.push("create-room")
        }
        else{
            getSpotifyAuthenticationUrl(setUrl);
        }
    }
}

const Logo = styled.div `
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Welcome = styled.h1 `
    color: white;
    font-size: clamp(2.5rem, 8vw, 4rem);
    text-align: center;
    font-family: var(--font-bungee-bold);

    @media screen and (orientation: landscape) and (max-width: 900px) {
        font-size: clamp(2.5rem, 8vh, 4rem);
    }

`