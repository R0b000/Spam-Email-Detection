import React, { useState } from 'react';
import { Dialog, Button, Box, Typography, styled } from '@mui/material';
import httpClient from '../../Configuration/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileContainer = styled(Box)({
  padding: '20px',
});

const Username = styled('span')({
  fontWeight: 'bold',
  color: '#007bff',
});

const EmailStyled = styled('span')({
  color: '#28a745',
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

  const userName = user?.name;
  const userEmail = user?.email;

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await httpClient.post('/logout');
      if (result.data === 'Logout success' || result.data?.message === 'Logout success') {
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
      navigate('/auth/login');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <ProfileContainer>
        <Typography variant="h6">User Profile</Typography>
        {userName && (
          <Typography>
            Welcome, <Username>{userName}</Username>
          </Typography>
        )}
        {userEmail && (
          <Typography>
            Email: <EmailStyled>{userEmail}</EmailStyled>
          </Typography>
        )}
        <Box className="mt-4 flex gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button onClick={handleLogout} disabled={loading} color="error">
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </Box>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ProfileContainer>
    </Dialog>
  );
};

export default Profile;
