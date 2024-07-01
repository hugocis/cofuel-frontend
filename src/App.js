import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import AboutCoFuel from './pages/AboutCoFuel';
import Links from './pages/Links';
import Login from './pages/Login';
import Register from './pages/Register';
import Planning from './pages/Planning';
import Profile from './pages/Profile';
import TripHistory from './pages/TripHistory';
import Trips from './pages/Trips';
import styled from 'styled-components'; 
import './styles/CommonStyles.css';
import './styles/CommonStyles.js';
import { AuthProvider } from './utils/auth'; // Import the AuthProvider
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; 
`;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Navbar />
          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/about-cofuel" element={<AboutCoFuel />} />
              <Route path="/links" element={<Links />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/planning" element={<PrivateRoute element={<Planning />} />} /> {/* Use PrivateRoute for protected routes */}
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} /> {/* Use PrivateRoute for protected routes */}
              <Route path="/trip-history" element={<PrivateRoute element={<TripHistory />} />} /> {/* Use PrivateRoute for protected routes */}
              <Route path="/trips" element={<PrivateRoute element={<Trips />} />} /> {/* Use PrivateRoute for protected routes */}
            </Routes>
          </Content>
          <Footer />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

export default App;
