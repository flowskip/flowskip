import { css } from "styled-components";

const variables = css`
	:root {
		--font-bold: "Bungee", cursive;
		--font-light: "Bungee Hairline", cursive;
		--font-shade: "Bungee Shade", cursive;
		--white: rgb(255, 255, 255);
		--light-white: rgba(222, 222, 222, 1);
		--black: rgb(0, 0, 0);
		--blue: rgba(35, 4, 157, 1);
		--purple: rgba(170, 46, 230, 1);
		--pink: rgba(255, 121, 205, 1);
		--active: #00ff00;
		--gradient: linear-gradient(
			90deg,
			rgba(35, 4, 157, 1) 0%,
			rgba(170, 46, 230, 1) 50%,
			rgba(255, 121, 205, 1) 100%
		);
		--progressbar: linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(170, 0, 0, 1) 100%);
		--scrollbar-color: #ffffff44;
		--scrollbar-color-hover: var(--white);
	}
`;

export default variables;
