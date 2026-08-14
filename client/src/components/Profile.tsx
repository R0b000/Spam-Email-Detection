import React, { useState } from 'react';
import { Dialog, Button, styled } from '@mui/material';
import axios from 'axios';
import { API_URI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define styled components
const ProfileContainer = styled('div')({
  padding: '20px',
});

const Username = styled('span')({
  fontWeight: 'bold',
  color: '#007bff', // Blue color
});

const EmailStyled = styled('span')({
  color: '#28a745', // Green color
});

const ErrorMessage = styled('p')({
  color: 'red',
  marginTop: '10px',
});

interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

const Profile = ({ open, onClose }: ProfileProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Retrieve the user's name and email from the shared AuthContext (from the DB).
  const userName = user?.name;
  const userEmail = user?.email;

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.post(`${API_URI}/logout`);

      console.log(result);

      if (result.data === 'Logout success' || result.data?.message === 'Logout success') {
        // Clear the authenticated user from the shared AuthContext & session storage.
        logout();
      } else {
        setError('Logout failed. Unexpected server response.');
      }
    } catch (err) {
      console.error(err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
      onClose();
      // Protected routes will also redirect here when the session ends.
      navigate('/login');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <ProfileContainer>
        <h2>User Profile</h2>
        {userName && (
          <p>
            Welcome, <Username>{userName}</Username>
          </p>
        )}
        {userEmail && (
          <p>
            Email: <EmailStyled>{userEmail}</EmailStyled>
          </p>
        )}
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