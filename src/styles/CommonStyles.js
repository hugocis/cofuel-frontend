import styled, { keyframes } from 'styled-components';

// Animaciones
export const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Contenedor común con fondo de gradiente
export const GradientContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #66ffcc, #ffcc66);
  background-size: 200% 200%;
  animation: ${gradientBackground} 10s ease infinite;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

// Títulos y Subtítulos
export const Title = styled.h1`
  font-size: 3em;
  margin-bottom: 20px;
  color: #333;
`;

export const Subtitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #666;
`;

// Botón estilizado
export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  padding: 15px;
  margin: 10px 0;
  background: #ffcc66;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ffa500;
  }

  &:focus {
    outline: 3px solid #333;
  }

  svg {
    margin-right: 10px;
  }
`;

// Input estilizado
export const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 16px;
`;

