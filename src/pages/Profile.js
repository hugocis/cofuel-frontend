import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Profile = () => {
  const [user, setUser] = useState({ vehicles: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        try {
          const response = await axios.get('https://cofuel-backend-63452a272e1b.herokuapp.com/api/users/me', {
            headers: { 'x-access-token': storedUser.token }
          });
          setUser(response.data);
          setFormData({
            username: response.data.username,
            email: response.data.email,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.put('https://cofuel-backend-63452a272e1b.herokuapp.com/api/users/me', formData, {
        headers: { 'x-access-token': storedUser.token }
      });
      setUser(response.data);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post('https://cofuel-backend-63452a272e1b.herokuapp.com/api/vehicles', 
      {
        ...vehicleData, 
        userId: user.id 
      },
      {
        headers: { 'x-access-token': storedUser.token }
      });

      setUser((prevUser) => ({
        ...prevUser,
        vehicles: [...(prevUser.vehicles || []), response.data]
      }));
      alert('Vehicle added successfully!');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ProfileContainer>
      <h1>Profile</h1>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Label htmlFor="username">Username:</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </InputWrapper>
          <ButtonWrapper>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={() => setEditing(false)}>Cancel</Button>
          </ButtonWrapper>
        </form>
      ) : (
        <ProfileDetails>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <ButtonWrapper>
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </ButtonWrapper>
        </ProfileDetails>
      )}
      <VehicleContainer>
        <h2>Add Vehicle</h2>
        <form onSubmit={handleAddVehicle}>
          <InputWrapper>
            <Label htmlFor="make">Make:</Label>
            <Input
              id="make"
              name="make"
              type="text"
              value={vehicleData.make}
              onChange={handleVehicleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="model">Model:</Label>
            <Input
              id="model"
              name="model"
              type="text"
              value={vehicleData.model}
              onChange={handleVehicleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="year">Year:</Label>
            <Input
              id="year"
              name="year"
              type="text"
              value={vehicleData.year}
              onChange={handleVehicleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="licensePlate">License Plate:</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              type="text"
              value={vehicleData.licensePlate}
              onChange={handleVehicleChange}
            />
          </InputWrapper>
          <ButtonWrapper>
            <Button type="submit">Add Vehicle</Button>
          </ButtonWrapper>
        </form>
      </VehicleContainer>
    </ProfileContainer>
  );
};

export default Profile;

// Styled-components for the layout
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileDetails = styled.div`
  text-align: left;
`;

const VehicleContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const InputWrapper = styled.div`
  margin: 10px 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #ffcc66;
  color: white;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #ffaa00;
  }
`;
