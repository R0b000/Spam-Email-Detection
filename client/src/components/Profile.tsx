import React, { useState } from 'react';
import { Dialog, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authController } from '../Manager/Controller/authController';
import { useAuth } from '../context/AuthContext';

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

      const result = await authController.logout();

      console.log(result);

      if (result.message === 'Logout success') {
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
      <div className="p-5">
        <h2 className="m-0 mb-3">User Profile</h2>
        {userName && (
          <p className="m-0 mb-2">
            Welcome, <span className="font-bold text-brand-blue">{userName}</span>
          </p>
        )}
        {userEmail && (
          <p className="m-0 mb-4">
            Email: <span className="text-green-600">{userEmail}</span>
          </p>
        )}
        <Button onClick={onClose} color="primary" className="mr-2">
          Close
        </Button>
        <Button onClick={handleLogout} color="primary" disabled={loading}>
          Logout
        </Button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </Dialog>
  );
};

export default Profile;