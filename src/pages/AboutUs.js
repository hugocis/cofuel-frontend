import React from 'react';
import { GradientContainer, Title, Subtitle } from '../styles/CommonStyles';
import styled from 'styled-components';
import hugo from '../assets/teamMembers/hugo.jpg';
import javier from '../assets/teamMembers/javier.jpg';
import alicia from '../assets/teamMembers/alicia.jpg';
import estelle from '../assets/teamMembers/estelle.jpg';
import fernando from '../assets/teamMembers/fernando.jpg';

const TeamContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1000px;
  width: 100%;
`;

const Member = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const MemberImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const MemberName = styled.p`
  margin: 10px 0 5px;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
`;

const MemberRole = styled.p`
  margin: 0;
  font-size: 1em;
  color: #777;
`;

const AboutSection = styled.div`
  max-width: 800px;
  text-align: center;
  margin: 40px 0;
  padding: 0 20px;

  p {
    font-size: 1.1em;
    line-height: 1.5;
    color: #555;
  }

  a {
    color: #0066cc;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AboutUs = () => {
  const members = [
    { src: hugo, name: 'Hugo Cisneros', role: 'Software Engineer' },
    { src: javier, name: 'Javier de Santos', role: 'Software Engineer' },
    { src: alicia, name: 'Alicia García', role: 'Software Engineer' },
    { src: estelle, name: 'Estelle Pamen', role: 'Software Engineer' },
    { src: fernando, name: 'Fernando Teba', role: 'Software Engineer' },
  ];

  return (
    <GradientContainer>
      <Title>More About Us</Title>
      <AboutSection>
        <Subtitle>Our Mission</Subtitle>
        <p>
          Our mission is to deliver exceptional solutions through a dedicated and passionate team.
        </p>
        <Subtitle>Our Team</Subtitle>
        <TeamContainer>
          {members.map((member, index) => (
            <Member key={index}>
              <MemberImage src={member.src} alt={member.name} />
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
            </Member>
          ))}
        </TeamContainer>
        <Subtitle>Contact Us</Subtitle>
        <p>If you'd like to learn more about our team, please reach out to us at <a href="mailto:contact@ourcompany.com">contact@ourcompany.com</a>.</p>
      </AboutSection>
    </GradientContainer>
  );
};

export default AboutUs;
