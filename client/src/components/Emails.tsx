import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { DeleteOutline, RefreshOutlined, MoreVertOutlined } from '@mui/icons-material';
import Email from './Email';
import useApi from '../Helper/useApi';
import { API_URLS } from '../Manager/Service/api.urls';
import NoMails from './common/NoMails';
import { EMPTY_TABS } from '../config/constant';
import { API_URI } from '../Configuration/axios';
import { useAuth } from '../context/AuthContext';
import type { Mail } from '../Model/ResponseModel/EmailModel/EmailResponseModel';
import type { MainOutletContext } from '../pages/Main';

interface OutletContext extends MainOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

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
    <Box className="transition-all" style={{ width: `calc(100% - ${sidebarWidth}px)`, marginLeft: sidebarWidth }}>
      <Box className="sticky top-[64px] z-[10] bg-white px-[4px_12px] border-b border-[#dadce0] flex items-center gap-[4px]">
        <Checkbox
          size="small"
          checked={allSelected}
          onChange={selectAllEmails}
          indeterminate={selectedEmails.length > 0 && !allSelected}
        />
        <IconButton onClick={() => setRefresh((prev) => !prev)} className="text-[#5f6368]">
          <RefreshOutlined />
        </IconButton>
        <IconButton onClick={deleteSelectedEmails} disabled={selectedEmails.length === 0} className="text-[#5f6368]">
          <DeleteOutline />
        </IconButton>
        {selectedEmails.length > 0 && (
          <Typography variant="body2" className="ml-2 text-gsubtext">
            {selectedEmails.length} selected
          </Typography>
        )}
        <Box className="ml-auto flex">
          <IconButton className="text-[#5f6368]">
            <MoreVertOutlined />
          </IconButton>
        </Box>
      </Box>

      <Box className="p-[4px_0_24px]">
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
      </Box>

      {emails.length === 0 && <NoMails message={EMPTY_TABS[type]} type={type} />}
    </Box>
  );
};

export default Emails;