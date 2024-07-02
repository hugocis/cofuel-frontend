import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { GradientContainer, Title, Button, Input } from '../styles/CommonStyles';

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

  const [editVehicleData, setEditVehicleData] = useState(null);

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

  useEffect(() => {
    const fetchVehicles = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        try {
          const response = await axios.get(`https://cofuel-backend-63452a272e1b.herokuapp.com/api/vehicles/${storedUser.id}`, {
            headers: { 'x-access-token': storedUser.token }
          });
          setUser((prevUser) => ({
            ...prevUser,
            vehicles: response.data
          }));
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditVehicleChange = (e) => {
    const { name, value } = e.target;
    setEditVehicleData((prevData) => ({ ...prevData, [name]: value }));
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
        userId: storedUser.id 
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

  const handleDeleteVehicle = async (licensePlate) => {
    const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.delete(`https://cofuel-backend-63452a272e1b.herokuapp.com/api/vehicles/${storedUser.id}/${licensePlate}`, {
        headers: { 'x-access-token': storedUser.token }
      });
      setUser((prevUser) => ({
        ...prevUser,
        vehicles: prevUser.vehicles.filter(vehicle => vehicle.license_plate !== licensePlate)
      }));
      alert('Vehicle deleted successfully!');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditVehicleData(vehicle);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.put(`https://cofuel-backend-63452a272e1b.herokuapp.com/api/vehicles/${storedUser.id}/${editVehicleData.license_plate}`, 
      editVehicleData, {
        headers: { 'x-access-token': storedUser.token }
      });

      setUser((prevUser) => ({
        ...prevUser,
        vehicles: prevUser.vehicles.map(vehicle => vehicle.license_plate === editVehicleData.license_plate ? response.data : vehicle)
      }));
      setEditVehicleData(null);
      alert('Vehicle updated successfully!');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle');
    }
  };

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <GradientContainer>
      <Title>Profile</Title>
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
            <ProfileButton onClick={() => setEditing(true)}>Edit Profile</ProfileButton>
          </ButtonWrapper>
        </ProfileDetails>
      )}
      <GridContainer>
        <LeftColumn>
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
        </LeftColumn>
        <RightColumn>
          <h2>My Vehicles</h2>
          <VehicleGrid>
            {user.vehicles && user.vehicles.length > 0 ? (
              user.vehicles.map((vehicle, index) => (
                <VehicleCard key={index}>
                  <p><strong>Make:</strong> {vehicle.make}</p>
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Year:</strong> {vehicle.year}</p>
                  <p><strong>License Plate:</strong> {vehicle.license_plate}</p>
                  <ButtonWrapper>
                    <EditButton onClick={() => handleEditVehicle(vehicle)}>Edit</EditButton>
                    <DeleteButton onClick={() => handleDeleteVehicle(vehicle.license_plate)}>Delete</DeleteButton>
                  </ButtonWrapper>
                </VehicleCard>
              ))
            ) : (
              <p>No vehicles added yet.</p>
            )}
          </VehicleGrid>
        </RightColumn>
      </GridContainer>
      {editVehicleData && (
        <EditVehicleContainer>
          <h2>Edit Vehicle</h2>
          <form onSubmit={handleUpdateVehicle}>
            <InputWrapper>
              <Label htmlFor="editMake">Make:</Label>
              <Input
                id="editMake"
                name="make"
                type="text"
                value={editVehicleData.make}
                onChange={handleEditVehicleChange}
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="editModel">Model:</Label>
              <Input
                id="editModel"
                name="model"
                type="text"
                value={editVehicleData.model}
                onChange={handleEditVehicleChange}
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="editYear">Year:</Label>
              <Input
                id="editYear"
                name="year"
                type="text"
                value={editVehicleData.year}
                onChange={handleEditVehicleChange}
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="editLicensePlate">License Plate:</Label>
              <Input
                id="editLicensePlate"
                name="licensePlate"
                type="text"
                value={editVehicleData.license_plate}
                onChange={handleEditVehicleChange}
              />
            </InputWrapper>
            <ButtonWrapper>
              <Button type="submit">Update Vehicle</Button>
              <Button type="button" onClick={() => setEditVehicleData(null)}>Cancel</Button>
            </ButtonWrapper>
          </form>
        </EditVehicleContainer>
      )}
    </GradientContainer>
  );
};

export default Profile;

// Styled-components para el layout y botones ajustados
const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center; /* Centra los botones */
  gap: 10px;
  margin-top: 10px; /* Ajusta el margen superior */
`;

const EditButton = styled(Button)`
  background-color: #66ccff;
  width: 80px; /* Ajusta el ancho del botón */
  &:hover {
    background-color: #3399ff;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff6666;
  width: 80px; /* Ajusta el ancho del botón */
  &:hover {
    background-color: #ff3333;
  }
`;

const ProfileButton = styled(Button)`
  width: auto;
  padding: 10px 20px;
`;

const ProfileDetails = styled.div`
  text-align: center; /* Center the text */
  width: 100%;
  max-width: 600px; /* Adjust the maximum width here */
  background: white;
  padding: 20px 20px 40px; /* Add more space at the bottom */
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto; /* Center the container and add top margin */
`;



const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
`;

const LeftColumn = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const RightColumn = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const VehicleCard = styled.div`
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputWrapper = styled.div`
  margin: 10px 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const EditVehicleContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  max-width: 800px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;
