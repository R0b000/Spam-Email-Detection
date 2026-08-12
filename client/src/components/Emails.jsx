import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import { Box, List, Checkbox, IconButton } from '@mui/material';
import Email from './Email';
import useApi from '../hooks/useApi';
import { API_URLS } from '../services/api.urls';
import { DeleteOutline } from '@mui/icons-material';
import NoMails from './common/NoMails';
import { EMPTY_TABS } from '../constants/constant';
import { API_URI } from '../services/api';

const Emails = () => {
    const [emails, setEmails] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const [starredEmail, setStarredEmail] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const deleteEmailsService = useApi(API_URLS.deleteSelectedEmails);

    const { type } = useParams();
    const { openDrawer } = useOutletContext();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const userEmail = sessionStorage.getItem('userEmail');
                if (!userEmail) {
                    console.error('User email not found');
                    return;
                }

                const response = await axios.get(`${API_URI}/emails/${type}?userEmail=${userEmail}`);
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error);
            }
        };

        fetchEmails();

        return () => {
            setSelectedEmails([]);
        };
    }, [type, refresh]);

    useEffect(() => {
        setSelectedEmails([]);
    }, [type]);

    const selectAllEmails = (e) => {
        if (e.target.checked) {
            const emailIds = emails.map(email => email._id);
            setSelectedEmails(emailIds);
        } else {
            setSelectedEmails([]);
        }
    };
    
    const deleteSelectedEmails = async (type) => {
        try {
            // Check if all emails are selected
            const allEmailsSelected = selectedEmails.length === emails.length;
    
            // Define the type to be updated
            const updatedType = 'bin'; // Modify this according to your requirement
    
            // Determine if the emails are currently in the bin
            const bin = type === 'bin';
    
            console.log('Type:', type);
    
            if (!allEmailsSelected || !bin) {
                console.log('Sending delete request...');
                // If not all emails are selected or the type is not bin, send a delete request
                const response = await deleteEmailsService.call({ messageIds: selectedEmails, type: updatedType, value: true });
                setRefresh(prevRefresh => !prevRefresh);
            } else {
                console.log('Condition not met.');
                // Handle other cases if needed
            }
            setStarredEmail(prevState => !prevState);
        } catch (error) {
            console.error('Error updating emails:', error);
            // Handle error
        }
    };               
    
    return (
        <Box style={{ width: openDrawer ? 'calc(100% - 200px)' : '100%', marginLeft: openDrawer ? '200px' : '0' }}>
            <Box style={{ position: 'sticky', top: '65px', zIndex: 1, backgroundColor: '#fff', padding: '10px 0', borderBottom: '1px solid #e0e0e0'}}>
                <Checkbox
                    size="small"
                    checked={selectedEmails.length === emails.length}
                    onChange={(e) => selectAllEmails(e)}
                />
                <IconButton onClick={deleteSelectedEmails}>
                    <DeleteOutline />
                </IconButton>
            </Box>
            <List style={{ marginTop: '10px' }}>
                {emails?.map?.(email => (
                    <Email
                        key={email._id}
                        email={email}
                        selectedEmails={selectedEmails}
                        setSelectedEmails={setSelectedEmails}
                        setStarredEmail={setStarredEmail}
                    />
                ))}
            </List>
            {emails.length === 0 && <NoMails message={EMPTY_TABS[type]} />}
        </Box>
    );        
};

export default Emails;
