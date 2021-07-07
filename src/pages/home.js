import React from 'react'
import styled from 'styled-components'
import LogoImg from '../assets/svg/logo.svg'

export default class Home extends React.Component{
    render(){
        return(
            <React.Fragment>
                <main>
                    <Logo>
                        <img src={LogoImg} alt="Logo" />
                    </Logo>
                    <Welcome>¡Bienvenido!</Welcome>
                </main>
            </React.Fragment>
        )
    }
}

const Logo = styled.div `
    width: 70vw;
    margin: 15vw auto 0;

    img {
        width: 100%;
    }
`

const Welcome = styled.h1 `
    
`