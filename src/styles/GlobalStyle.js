import { createGlobalStyle } from "styled-components";
import variables from "./variables";

const GlobalStyle = createGlobalStyle`

    ${variables};

    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    html {
        font-size: 62.5%;
    }

    body {
        background: var(--gradient);
    }

    svg {
        cursor: pointer;
    }

    ::placeholder {
        color: #000000;
        font-family: sans-serif;
        font-size: 1.8rem;
        text-align: center;
    }

    summary::-webkit-details-marker, summary::marker {
        display: none;
        content: "";
    }

    ::-webkit-scrollbar {
        background: transparent;
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--scrollbar-color);
        border-radius: 20px;
        border: 3px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-color-hover);
        border-radius: 20px;
        border: 2px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
    }

    :focus {
        outline: none;
        color: var(--active);
    }

    .swal-title {
        font: bold 2rem/100% var(--font-bold);
        color: var(--white);
        }

    .swal-button-text {
        font: 1.6rem/100% var(--font-bold);
        color: var(--white);
        padding: 10px 20px;
    }

    .swal-text {
        font: 1.6rem/100% var(--font-bold);
        color: var(--white);
    }

    .swal-text-dark {
        font: 1.6rem/100% var(--font-bold);
        color: var(--black);
    }

    @keyframes shake {
        0% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-10px, 0);
        }
        75% {
            transform: translate(10px, 0);
        }
        100% {
            transform: translate(0, 0);
        }
    }
`;

export default GlobalStyle;
