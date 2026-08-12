import React, { useState, useEffect } from 'react';
import { Dialog, Button, styled } from '@mui/material';
import axios from 'axios';
import { API_URI } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Define styled components
const ProfileContainer = styled('div')({
  padding: '20px',
});

const Username = styled('span')({
  fontWeight: 'bold',
  color: '#007bff', // Blue color
});

const Email = styled('span')({
  color: '#28a745', // Green color
});

const ErrorMessage = styled('p')({
  color: 'red',
  marginTop: '10px',
});

const Profile = ({ open, onClose }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve the user's name and email from local storage
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    // You can add additional logic here if needed
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.post(`${API_URI}/logout`);

      console.log(result);

      if (result.data === 'Logout success') {
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        setIsLoggedIn(false);
      } else {
        setError('Logout failed. Unexpected server response.');
      }
    } catch (err) {
      console.error(err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
      onClose(); 
      navigate('/login'); 
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <ProfileContainer>
        <h2>User Profile</h2>
        {userName && <p>Welcome, <Username>{userName}</Username></p>}
        {userEmail && <p>Email: <Email>{userEmail}</Email></p>}
        {/* Add more profile details or form for editing */}
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={handleLogout} color="primary" disabled={loading}>
          Logout
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ProfileContainer>
    </Dialog>
  );
};

export default Profile;
