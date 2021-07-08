import React from 'react'
import styled from 'styled-components'
import { Link } from "react-router-dom";

import './styles/configroom.css'

export default class ConfigRoom extends React.Component{

    handleChange = () => {
        var input =  document.getElementById('votes');
        input.addEventListener('input',function(){
        if (this.value.length > 2) 
            this.value = this.value.slice(0,2); 
        })
    }  

    render(){
        return(
            <React.Fragment>
                <main className="main__config-room">
                    <Title>Configuración de la sala</Title>
                    <Subtitle>Controles de los invitados</Subtitle>
                    <form className="form__config-room">
                        <Grid>
                            <Divider>
                                <input type="radio" name="controls" id="no" />
                                <label for="no">Ninguno</label>
                            </Divider>
                            <Divider>
                                <input type="radio" name="controls" id="yes" />
                                <label for="yes">Play / Pause</label>
                            </Divider>
                        </Grid>
                        <Divider>
                            <input onChange={this.handleChange} type="number" name="number-of-skips" placeholder="2" id="votes" />
                            <Subtitle>Votos para saltar canción</Subtitle>
                        </Divider>
                        <input className="btn__create-room" type="submit" value="Crear Sala" />
                        <Link to="/" className="btn__back">Regresar</Link>
                    </form>
                </main>
            </React.Fragment>
        )
    }
}

const Title = styled.h1 `
    color: white;
    font-size: clamp(2.5rem, 8vw, 4rem);
    text-align: center;
    font-family: var(--font-bungee-bold);

    @media screen and (orientation: landscape) and (max-width: 900px) {
        font-size: clamp(2.5rem, 8vh, 4rem);
    }
`

const Subtitle = styled.h2 `
    color: white;
    font-size: 1.6rem;
    text-align: center;
    font-family: var(--font-bungee-bold);
    opacity: .9;
`

const Divider = styled.div `
    display: flex;
    flex-direction: column-reverse;
    place-items: center center;
`

const Grid = styled.div `
    display: grid;
    grid-template-columns: 50% 50%;
    place-items: center center;
    margin: 0 0 20px;
`

const Buttons = styled.div `
    display: grid;
    grid-template-rows: repeat(1fr, 2);
`