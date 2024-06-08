import React from 'react';
import { GradientContainer, Title } from '../styles/CommonStyles';
import styled from 'styled-components';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const LinksContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`;

const LinkList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 80%;
  max-width: 600px;
`;

const LinkItem = styled.li`
  background: #ffcc66;
  padding: 20px;
  margin: 15px 0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1.2em;
  transition: background 0.3s;

  &:hover {
    background: #ffb84d;
  }

  a {
    color: #333;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }

    svg {
      margin-left: 10px;
    }
  }

  p {
    margin: 10px 0 0;
    font-size: 0.9em;
    color: #666;
  }
`;

const Links = () => {
  return (
    <GradientContainer>
      <LinksContainer>
        <Title>Useful Links</Title>
        <LinkList>
          <LinkItem>
            <a href="https://vercel.com/hugocis-projects/co-fuel" target="_blank" rel="noopener noreferrer">
              Vercel Deployment <FaExternalLinkAlt />
            </a>
            <p>Visit the CoFuel project deployed on Vercel.</p>
          </LinkItem>
          <LinkItem>
            <a href="https://github.com/hugocis/CoFuel" target="_blank" rel="noopener noreferrer">
              GitHub Repository <FaGithub />
            </a>
            <p>Explore the source code of the CoFuel project on GitHub.</p>
          </LinkItem>
        </LinkList>
      </LinksContainer>
    </GradientContainer>
  );
};

export default Links;
