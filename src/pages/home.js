import React from 'react'
import styled from 'styled-components'

import './styles/home.css'

import LogoImg from '../assets/img/logo.png'

export default class Home extends React.Component{
    render(){
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
                        <button className="main__container--button">Crear Nueva Sala</button>
                    </div>
                </main>
            </React.Fragment>
        )
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