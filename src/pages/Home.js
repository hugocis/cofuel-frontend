// src/pages/Home.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { GradientContainer, Title, Subtitle, Button } from '../styles/CommonStyles';
import styled from 'styled-components';

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/assets/background.png') no-repeat center center/cover;
  z-index: -1;
  opacity: 0.2;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      navigate('/map');
    }
  }, [navigate]);

  return (
    <GradientContainer>
      <BackgroundImage />
      <Title>Where Every Trip Counts</Title>
      <Subtitle>Join us and start your journey today!</Subtitle>
      <StyledLink to="/signup">
        <Button>
          <FaUserPlus />
          Create an account
        </Button>
      </StyledLink>
    </GradientContainer>
  );
};

export default Home;
