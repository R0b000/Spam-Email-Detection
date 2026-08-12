import { useState, useEffect } from 'react';
import { Box, List, ListItem, styled, Button } from '@mui/material';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { useParams, NavLink } from 'react-router-dom';
import { routes } from '../routes/routes';
import ComposeMail from './ComposeMail';
import axios from 'axios'; 
import { API_URI } from '../services/api';
import { CreateOutlined, Add as AddIcon } from '@mui/icons-material'; 

const ComposeButton = styled(Button)({
    background: '#c2e7ff',
    color: '#001d35',
    padding: 16,
    borderRadius: 16,
    minWidth: 140,
    textTransform: 'none'
});

const Container = styled(Box)({
    padding: 8,
    '& > ul': {
        position:'sticky',
        padding: '10px 0 0 5px',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        '& > a': {
            textDecoration: 'none',
            color: 'inherit'
        }
    },
    '& > ul > a > li >svg': {
        marginRight: 20
    }
});

const SideBarContent = () => {
    const [emails, setEmails] = useState([]);
    const { type } = useParams();
    const [openDialog, setOpenDialog] = useState(false);

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
    }, [type]); 

    const onComposeClick = () => {
        setOpenDialog(true);
    };

    const renderNavLinks = () => {
        return SIDEBAR_DATA.map((data) => (
            <NavLink key={data.name} to={`${routes.emails.path}/${data.name}`}>
                <ListItem style={type === data.name.toLowerCase() ? { backgroundColor: '#d3e3fd', borderRadius: '0 16px 16px 0' } : {}}>
                    <data.icon fontSize="small" />
                    {data.title}
                </ListItem>
            </NavLink>
        ));
    };

    return (
        <Container>
            <ComposeButton onClick={onComposeClick}>
                <AddIcon />
                Compose
            </ComposeButton>
            <List>
                {renderNavLinks()}
            </List>
            <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </Container>
    );
};

export default SideBarContent;
