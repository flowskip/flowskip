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

    ::placeholder {
        color: #000000;
        font-family: sans-serif;
        font-size: 1.8rem;
        text-align: center;
    }
`;

export default GlobalStyle;
