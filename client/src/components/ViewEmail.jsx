import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useOutletContext, useLocation } from 'react-router-dom';
import { emptyProfilePic } from '../constants/constant';
import { ArrowBack, Delete } from '@mui/icons-material';

const IconWrapper = styled(Box)({
    padding: 15
});

const Subject = styled(Typography)({
    fontSize: 22,
    margin: '10px 0 20px 75px',
    display: 'flex',
    fontWeight: 'bold'
});

const Indicator = styled(Box)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-left: 6px;
    padding: 2px 4px;
    align-self: center;
`;

const Image = styled('img')({
    borderRadius: '50%',
    width: 40,
    height: 40,
    margin: '5px 10px 0 10px',
    backgroundColor: '#cccccc'
});

const Container = styled(Box)({
    marginLeft: 15,
    width: '100%',
    '& > div': {
        display: 'flex',
        '& > p > span': {
            fontSize: 12,
            color: '#5E5E5E'
        }
    }
});

const Date = styled(Typography)({
    position: 'absolute',
    margin: '0 50px 100px auto', // Added margin-bottom
    fontSize: 14, // Increased font size
    color: '#5E5E5E'
});

const BodyContent = styled(Typography)({
    marginTop: 20,
    textAlign: 'justify', // Justify text
    fontSize: 16 // Increased font size
});

const Attachment = styled('img')({
    maxWidth: '100%',
    maxHeight: '200px',
    marginTop: '20px',
});

const ViewEmail = () => {
    const { openDrawer } = useOutletContext();
    const { state } = useLocation();
    const { email, type } = state;

    // Log and inspect the email.attachment object
    console.log('Attachment:', email.attachment);

    return (
        <Box style={{ width: openDrawer ? 'calc(100% - 200px)' : '100%', marginLeft: openDrawer ? '200px' : '0' }}>
            <IconWrapper>
                <ArrowBack fontSize='small' color="action" onClick={() => window.history.back() } />
                <Delete fontSize='small' color="action" style={{ marginLeft: 40 }} />
            </IconWrapper>
            <Subject>{email.subject} <Indicator component="span">{type}</Indicator></Subject>
            <Box style={{ display: 'flex' }}>
                <Image src={emptyProfilePic} alt="profile" />
                <Container style={{ marginRight: openDrawer ? '50px' : '50px' }}>
                    <Box>
                        <Typography>    
                            {email.to && email.to.split('@')[0]} 
                            {email.to && <Box component="span">&nbsp;&#60;{email.to}&#62;</Box>}
                        </Typography>
                        <Date>
                            {email.date && (
                                <>
                                    {(new window.Date(email.date)).getDate()}&nbsp;
                                    {(new window.Date(email.date)).toLocaleString('default', { month: 'long' })}&nbsp;
                                    {(new window.Date(email.date)).getFullYear()} 
                                </>
                            )}
                        </Date>
                    </Box>
                    <BodyContent>{email.body}</BodyContent> {/* Adjusted content */}
                    {email.attachment && (
                        <Attachment src={email.attachment.src} alt={email.attachment.alt} />
                    )}
                </Container>
            </Box>
        </Box>
    )
}

export default ViewEmail;
