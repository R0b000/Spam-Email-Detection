import React, { useState } from 'react';
import { Dialog, Box, Typography, styled, InputBase, TextField, Button } from '@mui/material';
import { Close, DeleteOutlined, AttachFile } from '@mui/icons-material';
import useApi from '../hooks/useApi';
import { API_URLS } from '../services/api.urls';
import axios from 'axios';
import { API_URI } from '../services/api'

const dialogStyle = {
    height: '90%',
    width: '60%',
    maxWidth: '600px',
    maxHeight: '600px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for depth
    borderRadius: '10px', // Add border-radius for rounded corners
    backgroundColor: '#fff', // Set a background color for the dialog
    padding: '20px', // Add some padding for content
    overflow: 'auto' // Allow overflow content to be scrollable
};

const Header = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    background: '#f2f6fc',
    '& > p': {
        fontSize: 14,
        fontWeight: 500
    }
});

const RecipientsWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    padding: '0 15px',
    '& > div': {
        fontSize: 14,
        borderBottom: '1px solid #f5f5f5',
        marginTop: '10px'
    }
});

const Footer = styled(Box)({
    position: 'absolute',
    bottom: '10px', // Adjust this value as needed
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    alignItems: 'center'
});

const IconWrapper = styled(Box)({
    display: 'flex',
});

const SendButton = styled(Button)({
    background: '#0b57d0',
    color: '#fff',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '18px',
    width: '100px'
});

const StyledInputBase = styled(InputBase)({
    fontSize: '14px',
    padding: '8px 12px',
    marginBottom: '10px',
    border: 'none',
    borderRadius: '4px',
    '&:focus': {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    }
});

const StyledTextField = styled(TextField)({
    marginBottom: '10px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
        },
    }
});

const StyledAttachmentContainer = styled('div')({
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '5px', // Reduce padding to make the container smaller
    marginBottom: 'none', // Remove this line or set it to 0
    position: 'absolute', // Change position to absolute
    bottom: '65px', // Adjust position to align with the bottom of the dialog
    maxWidth: '100%', // Adjust maximum width as needed
    width: '91.3%', // Add width to fill the entire dialog width
    zIndex: '1', // Ensure the container is above other elements
    fontSize: '14px', // Set font size to 14px
    lineHeight: '1.2', // Adjust line height for better spacing
    maxHeight: '133.5px', // Reduce maxHeight for a smaller box
    overflowY: 'auto', // Add overflowY for scrollable content if needed
    '& p': {
        marginBottom: '3px', // Reduce margin bottom for paragraphs
    },
    '& img': {
        maxWidth: '100%',
        maxHeight: '100px', // Reduce max height for images
        marginBottom: '3px', // Reduce margin bottom for images
    },
    '& a': {
        color: '#007bff',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    '& a:hover': {
        textDecoration: 'underline',
    },
});

const ComposeMail = ({ openDialog, setOpenDialog }) => {
    const [sendingMessage, setSendingMessage] = useState(false); // State to manage sending message status
    const [attachment, setAttachment] = useState(null);
    const [data, setData] = useState({});

    const sendMessageServices = useApi(API_URLS.savesendEmails);
    const saveDraftService = useApi(API_URLS.saveDraftEmails);
    const saveSpamServices = useApi(API_URLS.saveSpamEmails);

    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');

    const onValueChange = (e, fieldName) => {
        if (fieldName === 'to' || fieldName === 'subject') {
            setData({ ...data, [fieldName]: e.target.value });
        } else if (fieldName === 'attachment') {
        } else if (fieldName === 'body') {
            setData({ ...data, body: e.target.value });
        }
    };

    const sendMail = async (data) => {    
        try {
            setSendingMessage(true); // Set sending message status to true when sending starts
    
            // Make API call to detect spam with the subject and body separately
            const spamDetectionResponse = await axios.post(`${API_URI}/detect`, {
                emailSubject: data.subject,
                emailBody: data.body
            });
    
            // Call the function to handle remaining code after receiving response
            handleResponse(spamDetectionResponse, data, userEmail, userName);
    
        } catch (error) {
            console.error('Error sending message:', error.message);
            alert('Invalid Email. Please try again.');
            setSendingMessage(false); // Reset sending message status if sending fails
        } finally {
            // Close dialog after 1 second
            setTimeout(() => {
                setOpenDialog(false);
            }, 1000);
        }
    };
    
    const handleResponse = async (spamDetectionResponse, data, userEmail, userName) => {
        try {
            const output = spamDetectionResponse.data.result;
            const predictionIndex = output.indexOf("Prediction:");
            if (predictionIndex !== -1) {
                const prediction = output.substring(predictionIndex);
                const isSpam = prediction.includes("classified as SPAM");
    
                // Retrieve the receiver email from the component state
                const receiverEmail = data.to;
    
                // Define the payload
                const payload = {
                    senderId: userEmail,
                    receiverEmail: receiverEmail,
                    content: {
                        subject: data.subject,
                        body: data.body,
                        attachment: {
                            name: data.attachment?.name,
                            type: data.attachment?.type,
                            content: data.attachment?.content
                        }
                    },
                    name: userName,
                    date: new Date(),
                    starred: false,
                    bin: false,
                    type: isSpam ? 'spam' : 'sent', // Set the type based on spam detection result
                };
    
                // Perform additional actions based on the email type if needed
                if (isSpam) {
                    // Make API call to save spam email
                    const saveSpamResponse = await saveSpamServices.call(payload);
                    alert(saveSpamResponse.data.message);
                } else {
                    // Send email if not spam
                    const sendMessageResponse = await sendMessageServices.call(payload);
                    if (sendMessageResponse && sendMessageResponse.data) {
                        alert(sendMessageResponse.data.message);
                    } else {
                        console.error('Error sending message:', sendMessageResponse.error);
                        alert('Failed to send email. Please try again.');
                    }
                }
            } else {
                console.error('Error saving spam message:', saveSpamResponse.error);
                alert('Failed to send email. Please try again.');
            }
        } catch (error) {
            
        } finally {
            setSendingMessage(false); // Reset sending message status
        }
    };     
    
    const closeComposeMail = async (e) => {
        e.preventDefault();
        
        try {
            const messageContent = {};
    
            if (data.subject) {
                messageContent.subject = data.subject;
            }
    
            if (data.body) {
                messageContent.body = data.body;
            }
    
            if (attachment) {
                messageContent.attachment = {
                    name: attachment.name,
                    type: attachment.type,
                    content: attachment.content
                };
            }
    
            let receiverEmail = data.to || null;
    
            const payload = {
                senderId: userEmail,
                receiverEmail: receiverEmail,
                content: Object.keys(messageContent).length > 0 ? messageContent : null,
                name: userName,
                date: new Date(),
                starred: false,
                bin: false,
                type: 'draft',
            };
    
            saveDraftService.call(payload);
    
            if (saveDraftService.status === 200) {
                alert(saveDraftService.data.message);
                setData({});
                setAttachment(null);
            } else {
                
            }
        } catch (error) {
            console.error('Error sending message:', error.message);
            alert('Invalid Email. Please try again.');
        }
        setOpenDialog(false);
    };
                    
    const handleAttachFileClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAttachment({
                        name: file.name,
                        type: file.type,
                        content: e.target.result.split(',')[1]
                    });
                };
                reader.readAsDataURL(file);
            }
        });
        fileInput.click();
    };

    const handleRemoveAttachment = () => {
        setAttachment(null);
    };

    const handleDelete = () => {
        setData({});
        setAttachment(null);
        setOpenDialog(false);
    };

    const renderAttachment = () => {
        if (attachment && attachment.name && attachment.type && attachment.content) {
            return (
                <StyledAttachmentContainer>
                    <p>Attached File: {attachment.name}</p>
                    <p>File Type: {attachment.type}</p>
                    {attachment.type.startsWith('image') ? (
                        <img src={`data:${attachment.type};base64,${attachment.content}`} alt={attachment.name} />
                    ) : (
                        <a href={`data:${attachment.type};base64,${attachment.content}`} download={attachment.name}>
                            Download {attachment.name}
                        </a>
                    )}
                    <div>
                        <Button onClick={handleRemoveAttachment}>Remove Attachment</Button>
                    </div>
                </StyledAttachmentContainer>
            );
        }
        return null;
    };

    return (
        <Dialog open={openDialog} PaperProps={{ sx: dialogStyle }}>
            <Header>
                <Typography>New Message</Typography>
                <Close fontSize='small' onClick={(e) => closeComposeMail(e)} />
            </Header>
            <RecipientsWrapper>
                <StyledInputBase placeholder="Recipients" name="to" onChange={(e) => onValueChange(e, 'to')} />
                <StyledInputBase placeholder="Subject" name="subject" onChange={(e) => onValueChange(e, 'subject')} />
            </RecipientsWrapper>
            <StyledTextField
                multiline
                rows={attachment ? 8 : 14} // Decrease rows by 3 when attachment is true
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    }
                }}
                onChange={(e) => onValueChange(e, 'body')}
            />

            {renderAttachment()}

            <Footer>
            <IconWrapper>
                    {/* Show sending message when sending is in progress */}
                    {sendingMessage ? (
                        <Typography variant="body2" color="textSecondary">
                            Sending...
                        </Typography>
                    ) : (
                        <SendButton onClick={(e) => sendMail(data)}>Send</SendButton>
                    )}
                </IconWrapper>
                <IconWrapper>
                    <AttachFile onClick={handleAttachFileClick} />
                    <DeleteOutlined onClick={handleDelete} />
                </IconWrapper>
            </Footer>
        </Dialog>
    );
};

export default ComposeMail;
