import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import styled, { keyframes } from 'styled-components';

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #66ffcc, #ffcc66);
  background-size: 200% 200%;
  animation: ${gradientBackground} 10s ease infinite;
  min-height: 60vh;
  padding: 50px;
  justify-content: center;
`;

const Spacer = styled.div`
  height: 10vh; 
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #333;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  width: 250px;
`;

const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #ffcc66;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffaa00;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const LoadingMessage = styled.div`
  color: blue;
  margin-bottom: 10px;
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://cofuel-backend-63452a272e1b.herokuapp.com/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        const token = response.data.token;
        const decodedToken = jwtDecode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: decodedToken.id,
          username: decodedToken.username,
          token
        }));

        setLoading(false);
        navigate('/planning');
      } else {
        setError('Error registering user');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error in setting up request');
    }
  };

  return (
    <Container>
      <Spacer />
      <Title>Register</Title>
      <Form onSubmit={handleRegister}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading && <LoadingMessage>Loading...</LoadingMessage>}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>Register</Button>
      </Form>
    </Container>
  );
};

export default Register;