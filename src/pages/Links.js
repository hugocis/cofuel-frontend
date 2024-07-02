import React from 'react';
import { GradientContainer, Title } from '../styles/CommonStyles';
import styled from 'styled-components';
import { FaExternalLinkAlt, FaGithub, FaCloud, FaCloudUploadAlt } from 'react-icons/fa';

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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
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
            <a href="https://dashboard.heroku.com/apps/cofuel-backend" target="_blank" rel="noopener noreferrer">
              Heroku Dashboard <FaCloud />
            </a>
            <p>Access the CoFuel backend on Heroku.</p>
          </LinkItem>
          <LinkItem>
            <a href="https://cofuel-backend-63452a272e1b.herokuapp.com/" target="_blank" rel="noopener noreferrer">
              Heroku Deployment <FaCloudUploadAlt />
            </a>
            <p>Visit the CoFuel backend deployed on Heroku.</p>
          </LinkItem>
          <LinkItem>
            <a href="https://vercel.com/hugocis-projects/cofuel-frontend" target="_blank" rel="noopener noreferrer">
              Vercel Frontend Deployment <FaExternalLinkAlt />
            </a>
            <p>Visit the CoFuel frontend deployed on Vercel.</p>
          </LinkItem>
          <LinkItem>
            <a href="https://cofuel.vercel.app/" target="_blank" rel="noopener noreferrer">
              CoFuel Application <FaExternalLinkAlt />
            </a>
            <p>Explore the CoFuel application.</p>
          </LinkItem>
        </LinkList>
      </LinksContainer>
    </GradientContainer>
  );
};

export default Links;
