import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Planning = () => {
  const mapContainerRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [directDistance, setDirectDistance] = useState('');
  const [directDuration, setDirectDuration] = useState('');
  const [waypoints, setWaypoints] = useState([{ id: 0, location: '' }]);
  const [legs, setLegs] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${storedUser.token}` }
          });
          const { data } = response;
          if (data) {
            setAvatarUrl(data.avatarUrl);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      try {
        const usersResponse = await axios.get('/api/users');
        if (usersResponse.data) {
          setOtherUsers(usersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching other users:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const initializeMap = (position) => {
      const { latitude, longitude } = position.coords;
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      new window.google.maps.Marker({
        map,
        position: { lat: latitude, lng: longitude },
        title: "You are here",
        icon: {
          url: avatarUrl,
          scaledSize: new window.google.maps.Size(50, 50),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(25, 25),
        },
      });

      otherUsers.forEach(user => {
        if (user.latitude && user.longitude && user.avatarUrl) {
          new window.google.maps.Marker({
            map,
            position: { lat: user.latitude, lng: user.longitude },
            title: user.username,
            icon: {
              url: user.avatarUrl,
              scaledSize: new window.google.maps.Size(50, 50),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(25, 25),
            },
          });
        }
      });

      new window.google.maps.places.Autocomplete(document.getElementById('origin'));
      new window.google.maps.places.Autocomplete(document.getElementById('destination'));

      waypoints.forEach((waypoint) => {
        new window.google.maps.places.Autocomplete(document.getElementById(`waypoint-${waypoint.id}`));
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      const calculateRoute = () => {
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        
        if (!originInput || !destinationInput) {
          console.error('Origin or destination input not found');
          return;
        }

        const origin = originInput.value;
        const destination = destinationInput.value;
        const waypts = waypoints.map((waypoint) => {
          const waypointInput = document.getElementById(`waypoint-${waypoint.id}`);
          return {
            location: waypointInput ? waypointInput.value : '',
            stopover: true,
          };
        }).filter(waypoint => waypoint.location);

        if (origin && destination) {
          directionsService.route(
            {
              origin,
              destination,
              waypoints: waypts,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                const route = result.routes[0];
                setLegs(route.legs);
                const totalDistance = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000;
                const totalDuration = route.legs.reduce((acc, leg) => acc + leg.duration.value, 0) / 60;
                setDistance(totalDistance.toFixed(2) + ' km');
                setDuration(totalDuration.toFixed(2) + ' min');
                setTripDetails({ origin, destination, waypoints: waypts, distance: totalDistance, duration: totalDuration });
              } else {
                console.error('Error fetching directions', result);
              }
            }
          );

          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                const directRoute = result.routes[0];
                const directLeg = directRoute.legs[0];
                setDirectDistance(directLeg.distance.text);
                setDirectDuration(directLeg.duration.text);
              } else {
                console.error('Error fetching direct directions', result);
              }
            }
          );
        }
      };

      document.getElementById('calculate').addEventListener('click', calculateRoute);
    };

    const handleScriptLoad = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initializeMap(position);
          },
          (error) => {
            console.error('Error getting location:', error);
            initializeMap({ coords: { latitude: -34.397, longitude: 150.644 } });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        initializeMap({ coords: { latitude: -34.397, longitude: 150.644 } });
      }
    };

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_LtP0pEQY_Bd1CMcQSPAa8tm67P4bkDE&libraries=places&async=2`;
      script.async = true;
      script.defer = true;
      script.onload = handleScriptLoad;
      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
      };
      document.head.appendChild(script);
    } else {
      handleScriptLoad();
    }
  }, [avatarUrl, waypoints, otherUsers]);

  const addWaypoint = () => {
    setWaypoints([...waypoints, { id: waypoints.length, location: '' }]);
  };

  const removeWaypoint = (id) => {
    setWaypoints(waypoints.filter(waypoint => waypoint.id !== id));
  };

  const resetWaypoints = () => {
    setWaypoints([{ id: 0, location: '' }]);
    setDistance('');
    setDuration('');
    setDirectDistance('');
    setDirectDuration('');
    setLegs([]);
    document.getElementById('origin').value = '';
    document.getElementById('destination').value = '';
  };

  const setCurrentLocation = async (inputId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                document.getElementById(inputId).value = results[0].formatted_address;
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const publishTrip = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !tripDetails) {
      console.error('User or trip details missing');
      return;
    }
  
    try {
      const response = await axios.post('/api/trips', {
        userId: storedUser.id,
        vehicleId: tripDetails.vehicleId, // Add appropriate vehicleId if available
        startLocation: tripDetails.origin,
        endLocation: tripDetails.destination,
        startTime: tripDetails.startTime, // Add appropriate startTime if available
        endTime: tripDetails.endTime, // Add appropriate endTime if available
        cost: tripDetails.cost // Add appropriate cost if available
      }, {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });
      console.log('Trip published successfully:', response.data);
      alert('Trip published successfully!');
    } catch (error) {
      console.error('Error publishing trip:', error.response?.data || error.message);
      alert('Failed to publish trip');
    }
  };
  

  return (
    <Wrapper>
      <ContentContainer>
        <LeftContainer>
          <InputContainer>
            <InputsWrapper>
              <InputWrapper>
                <Label htmlFor="origin">Origin:</Label>
                <InputGroup>
                  <Input id="origin"type="text"
                  placeholder="Enter origin"
                />
                <LocationButton onClick={() => setCurrentLocation('origin')}>📍</LocationButton>
              </InputGroup>
            </InputWrapper>
            {waypoints.map((waypoint, index) => (
              <WaypointContainer key={index}>
                <InputWrapper>
                  <Label htmlFor={`waypoint-${waypoint.id}`}>Stop {index + 1}:</Label>
                  <WaypointInputGroup>
                    <Input
                      id={`waypoint-${waypoint.id}`}
                      type="text"
                      placeholder={`Enter stop ${index + 1}`}
                    />
                    <RemoveButton onClick={() => removeWaypoint(waypoint.id)}>X</RemoveButton>
                  </WaypointInputGroup>
                </InputWrapper>
              </WaypointContainer>
            ))}
            <InputWrapper>
              <Label htmlFor="destination">Destination:</Label>
              <InputGroup>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Enter destination"
                />
                <LocationButton onClick={() => setCurrentLocation('destination')}>📍</LocationButton>
              </InputGroup>
            </InputWrapper>
          </InputsWrapper>
          <ButtonWrapper>
            <Button onClick={addWaypoint}>Add Stop</Button>
            <Button id="calculate">Calculate Route</Button>
            <Button onClick={resetWaypoints}>Reset</Button>
          </ButtonWrapper>
        </InputContainer>
      </LeftContainer>
      <MapContainerWrapper>
        <MapContainer ref={mapContainerRef} />
      </MapContainerWrapper>
    </ContentContainer>
    <InfoContainer>
      {legs.length > 0 ? (
        <>
          {legs.map((leg, index) => (
            <InfoItem key={index}>
              <strong>Segment {index + 1}:</strong> {leg.distance.text}, {leg.duration.text}
            </InfoItem>
          ))}
          <InfoItem>
            <strong>Total Distance:</strong> {distance}
          </InfoItem>
          <InfoItem>
            <strong>Total Duration:</strong> {duration}
          </InfoItem>
          <DirectInfoContainer>
            <DirectInfoItem>
              <strong>Direct Distance (no stops):</strong> {directDistance}
            </DirectInfoItem>
            <DirectInfoItem>
              <strong>Direct Duration (no stops):</strong> {directDuration}
            </DirectInfoItem>
          </DirectInfoContainer>
          {tripDetails && (
            <Button onClick={publishTrip}>Publish Trip</Button>
          )}
        </>
      ) : (
        <Instructions>
          To use this app, please enter the origin, destination, and any stops you would like to make along your route. Click "Calculate Route" to see the distance and duration of your trip.
        </Instructions>
      )}
    </InfoContainer>
  </Wrapper>
);
};

export default Planning;

// Styled-components for the layout
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #66ffcc, #ffcc66);
  background-size: 200% 200%;
  animation: gradientBackground 10s ease infinite;
  padding: 20px;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  margin-bottom: 10px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  padding-right: 20px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin: 10px 0;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
`;

const WaypointInputGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: calc(100% - 40px);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const LocationButton = styled.button`
  padding: 15px;
  border-radius: 5px;
  border: none;
  background-color: #ffcc66;
  color: white;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  margin-left: 5px;
  &:hover {
    background-color: #ffaa00;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #ffcc66;
  color: white;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #ffaa00;
  }
`;

const MapContainerWrapper = styled.div`
  width: 70%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const WaypointContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
`;

const RemoveButton = styled.button`
  padding: 5px;
  border-radius: 50%;
  border: none;
  background-color: #ff6666;
  color: white;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  &:hover {
    background-color: #ff3333;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;

const InfoItem = styled.div`
  flex: 1;
  text-align: left;
  margin: 5px 0;
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
`;

const DirectInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 80%;
`;

const DirectInfoItem = styled.div`
  text-align: center;
  margin: 5px 0;
  flex: 1;
`;

const Instructions = styled.div`
  text-align: center;
  color: #666;
  margin: 20px 0;
  font-size: 1.1em;
`;
