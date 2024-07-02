import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState({});
  const [participants, setParticipants] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const mapRef = useRef(null);
  const autocompletePickupRef = useRef(null);
  const autocompleteDropoffRef = useRef(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('https://cofuel-backend-63452a272e1b.herokuapp.com/api/trips', {
          headers: { 'x-access-token': storedUser.token }
        });
        setTrips(response.data);

        const usersResponse = await axios.get('https://cofuel-backend-63452a272e1b.herokuapp.com/api/users', {
          headers: { 'x-access-token': storedUser.token }
        });
        const usersMap = {};
        usersResponse.data.forEach(user => {
          usersMap[user.id] = user.username;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching trips or users:', error);
      }
    };

    fetchTrips();
  }, [trips]); // Incluyendo 'trips' en la lista de dependencias

  useEffect(() => {
    if (popupOpen && selectedTripId && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2
      });
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      const route = async () => {
        const trip = trips.find(t => t.id === selectedTripId);
        if (!trip) return;

        const waypoints = [
          {
            location: pickupLocation,
            stopover: true
          }
        ];

        directionsService.route({
          origin: `${trip.start_location.latitude},${trip.start_location.longitude}`,
          destination: `${trip.end_location.latitude},${trip.end_location.longitude}`,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        });
      };

      route();

      autocompletePickupRef.current = new window.google.maps.places.Autocomplete(document.getElementById('pickupLocation'));
      autocompleteDropoffRef.current = new window.google.maps.places.Autocomplete(document.getElementById('dropoffLocation'));
    }
  }, [popupOpen, selectedTripId, pickupLocation, dropoffLocation, trips]);

  const fetchParticipants = async (tripId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`https://cofuel-backend-63452a272e1b.herokuapp.com/api/participants/${tripId}`, {
        headers: { 'x-access-token': storedUser.token }
      });
      setParticipants(prevState => ({ ...prevState, [tripId]: response.data }));
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleAddParticipant = async (tripId, userId) => {
    try {
      if (userId === trips.find(trip => trip.id === tripId).user_id) {
        alert("You can't join your own trip.");
        return;
      }
      setSelectedTripId(tripId);
      setPopupOpen(true);
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const addParticipant = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await axios.post('https://cofuel-backend-63452a272e1b.herokuapp.com/api/participants', {
        tripId: selectedTripId,
        userId: storedUser.id,
        pickupLocation,
        dropoffLocation
      }, {
        headers: { 'x-access-token': storedUser.token }
      });
      setPopupOpen(false);
      fetchParticipants(selectedTripId);  // Refresh participants
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  return (
    <TripsContainer>
      <h1>Trips</h1>
      {trips.length === 0 ? (
        <p>No trips available.</p>
      ) : (
        trips.map(trip => (
          <TripCard key={trip.id}>
            <TripInfo>
              <p><strong>Owner:</strong> {users[trip.user_id] || trip.user_id}</p>
              <p><strong>Vehicle:</strong> {trip.vehicle_id}</p>
              <p><strong>Start Location:</strong> {trip.start_location ? `${trip.start_location.latitude}, ${trip.start_location.longitude}` : 'Unknown'}</p>
              <p><strong>End Location:</strong> {trip.end_location ? `${trip.end_location.latitude}, ${trip.end_location.longitude}` : 'Unknown'}</p>
              <ButtonContainer>
                <StyledButton onClick={() => fetchParticipants(trip.id)}>Show Participants</StyledButton>
                <StyledButton onClick={() => handleAddParticipant(trip.id, JSON.parse(localStorage.getItem('user')).id)}>Add Participant</StyledButton>
              </ButtonContainer>
              {participants[trip.id] && (
                <ParticipantList>
                  {participants[trip.id].map(participant => (
                    <li key={participant.id}>{users[participant.user_id] || participant.user_id}</li>
                  ))}
                </ParticipantList>
              )}
            </TripInfo>
            <MapContainer>
              {trip.start_location && trip.end_location && (
                <iframe
                  width="250"
                  height="150"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '10px' }}
                  src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyC_LtP0pEQY_Bd1CMcQSPAa8tm67P4bkDE&origin=${trip.start_location.latitude},${trip.start_location.longitude}&destination=${trip.end_location.latitude},${trip.end_location.longitude}&mode=driving`}
                  title={`Map of trip from ${trip.start_location.latitude},${trip.start_location.longitude} to ${trip.end_location.latitude},${trip.end_location.longitude}`} // Proporcionando un título único para cada iframe
                  allowFullScreen
                ></iframe>
              )}
            </MapContainer>
          </TripCard>
        ))
      )}
      {popupOpen && (
        <Popup>
          <PopupContent>
            <h2>Add Pickup and Dropoff Locations</h2>
            <PopupInner>
              <InputWrapper>
                <Label>Pickup Location:</Label>
                <Input id="pickupLocation" type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
              </InputWrapper>
              <InputWrapper>
                <Label>Dropoff Location:</Label>
                <Input id="dropoffLocation" type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
              </InputWrapper>
              <MapPreview ref={mapRef} />
            </PopupInner>
            <ButtonContainer>
              <StyledButton onClick={addParticipant}>Add Participant</StyledButton>
              <StyledButton onClick={() => setPopupOpen(false)}>Cancel</StyledButton>
            </ButtonContainer>
          </PopupContent>
        </Popup>
      )}
    </TripsContainer>
  );
};

export default Trips;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const TripsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #66ffcc, #ffcc66);
  background-size: 200% 200%;
  animation: ${gradientBackground} 10s ease infinite;
`;

const TripCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 20px;
  margin: 10px 0;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%;
`;

const TripInfo = styled.div`
  flex: 1;
  padding: 20px;
`;

const MapContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const MapPreview = styled.div`
  width: 50%;
  height: 300px;
  border-radius: 10px;
`;
const PopupInner = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;


const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #66ccff;
  color: white;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #3399ff;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%; /* Reduced width */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  margin: 10px 0;
  width: 45%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ParticipantList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
`;
