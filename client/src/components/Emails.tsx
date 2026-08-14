import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Box, Checkbox, IconButton, Typography, styled } from '@mui/material';
import { DeleteOutline, RefreshOutlined, MoreVertOutlined } from '@mui/icons-material';
import Email from './Email';
import useApi from '../hooks/useApi';
import { API_URLS } from '../services/api.urls';
import NoMails from './common/NoMails';
import { EMPTY_TABS } from '../constants/constant';
import { API_URI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Mail } from '../types';
import type { MainOutletContext } from '../pages/Main';

interface OutletContext extends MainOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

const Toolbar = styled(Box)({
  position: 'sticky',
  top: '64px',
  zIndex: 10,
  backgroundColor: '#ffffff',
  padding: '4px 12px',
  borderBottom: '1px solid #dadce0',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const ListContainer = styled(Box)({
  padding: '4px 0 24px',
});

const ToolbarButton = styled(IconButton)({
  color: '#5f6368',
});

const Emails: React.FC = () => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const deleteEmailsService = useApi(API_URLS.deleteSelectedEmails);

  const { type = '' } = useParams();
  const { openDrawer } = useOutletContext<OutletContext>();
  const { user, setEmails: setSharedEmails } = useAuth();
  const { sidebarWidth } = useOutletContext<OutletContext>();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const userEmail = user?.email;
        if (!userEmail) {
          console.error('User email not found');
          return;
        }

        const response = await axios.get(`${API_URI}/emails/${type}?userEmail=${userEmail}`);
        const fetchedEmails = response.data as Mail[];
        setEmails(fetchedEmails);
        setSharedEmails(fetchedEmails);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();

    return () => {
      setSelectedEmails([]);
    };
  }, [type, refresh, user?.email]);

  useEffect(() => {
    setSelectedEmails([]);
  }, [type]);

  const selectAllEmails = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmails(emails.map((email) => email._id));
    } else {
      setSelectedEmails([]);
    }
  };

  const deleteSelectedEmails = async () => {
    try {
      if (selectedEmails.length === 0) return;
      await deleteEmailsService.call({
        messageIds: selectedEmails,
        type: 'bin',
        value: true,
      });
      setRefresh((prev) => !prev);
      setSelectedEmails([]);
    } catch (error) {
      console.error('Error updating emails:', error);
    }
  };

  const allSelected = emails.length > 0 && selectedEmails.length === emails.length;

  return (
    <Box style={{ width: `calc(100% - ${sidebarWidth}px)`, marginLeft: sidebarWidth }}>
      <Toolbar>
        <Checkbox
          size="small"
          checked={allSelected}
          onChange={selectAllEmails}
          indeterminate={selectedEmails.length > 0 && !allSelected}
        />
        <ToolbarButton onClick={() => setRefresh((prev) => !prev)}>
          <RefreshOutlined />
        </ToolbarButton>
        <ToolbarButton onClick={deleteSelectedEmails} disabled={selectedEmails.length === 0}>
          <DeleteOutline />
        </ToolbarButton>
        {selectedEmails.length > 0 && (
          <Typography variant="body2" style={{ marginLeft: 8, color: '#5f6368' }}>
            {selectedEmails.length} selected
          </Typography>
        )}
        <Box style={{ marginLeft: 'auto', display: 'flex' }}>
          <ToolbarButton>
            <MoreVertOutlined />
          </ToolbarButton>
        </Box>
      </Toolbar>

      <ListContainer>
        {emails?.map?.((email) => (
          <Email
            key={email._id}
            email={email}
            starred={email.starred}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
            refreshList={() => setRefresh((prev) => !prev)}
          />
        ))}
      </ListContainer>

      {emails.length === 0 && <NoMails message={EMPTY_TABS[type]} type={type} />}
    </Box>
  );
};

export default Emails;