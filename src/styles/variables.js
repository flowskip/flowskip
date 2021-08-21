import { css } from "styled-components";

const variables = css`
	:root {
		--font-bold: "Bungee", cursive;
		--font-light: "Bungee Hairline", cursive;
		--font-shade: "Bungee Shade", cursive;
		--blue: #23049d;
		--purple: #aa2ee6;
		--pink: #ff79cd;
		--active: #00ff00;
		--gradient: linear-gradient(
			90deg,
			rgba(35, 4, 157, 1) 0%,
			rgba(170, 46, 230, 1) 50%,
			rgba(255, 121, 205, 1) 100%
		);
		--progressbar: linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(170, 0, 0, 1) 100%);
		--scrollbar-color: #ffffff44;
		--scrollbar-color-hover: #ffffff;
	}
`;

export default variables;
