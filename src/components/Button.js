import styled from "styled-components";

const Button = styled.button`
  height: 80%;
  max-height: 80px;
  border-radius: 10px;
  font-size: 1.6rem;
  line-height: 1.6rem;
  background-color: var(--purple);
  color: white;
  font-family: var(--font-bungee-bold);
  border: none;
  box-shadow: 5px 5px 10px 5px #00000033;
  padding: 5px 20px;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  max-width: 300px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    filter: brightness(120%);
  }
`;

export default Button;
