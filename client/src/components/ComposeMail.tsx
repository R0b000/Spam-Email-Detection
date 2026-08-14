import React, { useState } from 'react';
import { Dialog, Box, Typography, styled, InputBase, TextField, Button } from '@mui/material';
import { Close, DeleteOutlined, AttachFile } from '@mui/icons-material';
import useApi from '../hooks/useApi';
import { API_URLS } from '../services/api.urls';
import axios from 'axios';
import { API_URI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Attachment } from '../types';

const dialogStyle: React.CSSProperties = {
  height: '90%',
  width: '60%',
  maxWidth: '600px',
  maxHeight: '600px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  backgroundColor: '#fff',
  padding: '20px',
  overflow: 'auto',
};

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 15px',
  background: '#f2f6fc',
  '& > p': {
    fontSize: 14,
    fontWeight: 500,
  },
});

const RecipientsWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 15px',
  '& > div': {
    fontSize: 14,
    borderBottom: '1px solid #f5f5f5',
    marginTop: '10px',
  },
});

const Footer = styled(Box)({
  position: 'absolute',
  bottom: '10px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 15px',
  alignItems: 'center',
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
  width: '100px',
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
  },
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
  },
});

const StyledAttachmentContainer = styled('div')({
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '5px',
  marginBottom: 'none',
  position: 'absolute',
  bottom: '65px',
  maxWidth: '100%',
  width: '91.3%',
  zIndex: '1',
  fontSize: '14px',
  lineHeight: '1.2',
  maxHeight: '133.5px',
  overflowY: 'auto',
  '& p': {
    marginBottom: '3px',
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '100px',
    marginBottom: '3px',
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

interface ComposeMailProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ComposeMail = ({ openDialog, setOpenDialog }: ComposeMailProps) => {
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [data, setData] = useState<any>({});

  const sendMessageServices = useApi(API_URLS.savesendEmails);
  const saveDraftService = useApi(API_URLS.saveDraftEmails);
  const saveSpamServices = useApi(API_URLS.saveSpamEmails);

  // Use the authenticated user from the shared AuthContext instead of sessionStorage.
  const { user } = useAuth();
  const userEmail = user?.email ?? null;
  const userName = user?.name ?? null;

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    if (fieldName === 'to' || fieldName === 'subject') {
      setData({ ...data, [fieldName]: e.target.value });
    } else if (fieldName === 'body') {
      setData({ ...data, body: e.target.value });
    }
  };

  const sendMail = async (data: any) => {
    try {
      setSendingMessage(true);

      // Make API call to detect spam with the subject and body separately
      const spamDetectionResponse = await axios.post(`${API_URI}/detect`, {
        emailSubject: data.subject,
        emailBody: data.body,
      });

      // Call the function to handle remaining code after receiving response
      handleResponse(spamDetectionResponse, data, userEmail, userName);
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      alert('Invalid Email. Please try again.');
      setSendingMessage(false);
    } finally {
      setTimeout(() => {
        setOpenDialog(false);
      }, 1000);
    }
  };

  const handleResponse = async (
    spamDetectionResponse: any,
    data: any,
    userEmail: string | null,
    userName: string | null
  ) => {
    try {
      const output = spamDetectionResponse.data.result;
      const predictionIndex = output.indexOf('Prediction:');
      if (predictionIndex !== -1) {
        const prediction = output.substring(predictionIndex);
        const isSpam = prediction.includes('classified as SPAM');

        const receiverEmail = data.to;

        const payload = {
          senderId: userEmail,
          receiverEmail: receiverEmail,
          content: {
            subject: data.subject,
            body: data.body,
            attachment: {
              name: data.attachment?.name,
              type: data.attachment?.type,
              content: data.attachment?.content,
            },
          },
          name: userName,
          date: new Date(),
          starred: false,
          bin: false,
          type: isSpam ? 'spam' : 'sent',
        };

        if (isSpam) {
          // Make API call to save spam email
          await saveSpamServices.call(payload);
          alert(saveSpamServices.data?.message);
        } else {
          // Send email if not spam
          await sendMessageServices.call(payload);
          if (sendMessageServices.data) {
            alert(sendMessageServices.data.message);
          } else {
            console.error('Error sending message:', sendMessageServices.error);
            alert('Failed to send email. Please try again.');
          }
        }
      } else {
        console.error('No prediction found in Python output:', output);
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error handling spam detection response:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const closeComposeMail = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const messageContent: Record<string, unknown> = {};

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
          content: attachment.content,
        };
      }

      const receiverEmail = data.to || null;

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
        alert((saveDraftService.data as any)?.message);
        setData({});
        setAttachment(null);
      }
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      alert('Invalid Email. Please try again.');
    }
    setOpenDialog(false);
  };

  const handleAttachFileClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachment({
            name: file.name,
            type: file.type,
            content: (e.target?.result as string).split(',')[1],
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
        <Close fontSize="small" onClick={(e) => closeComposeMail(e)} />
      </Header>
      <RecipientsWrapper>
        <StyledInputBase placeholder="Recipients" name="to" onChange={(e) => onValueChange(e, 'to')} />
        <StyledInputBase placeholder="Subject" name="subject" onChange={(e) => onValueChange(e, 'subject')} />
      </RecipientsWrapper>
      <StyledTextField
        multiline
        rows={attachment ? 8 : 14}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        onChange={(e) => onValueChange(e, 'body')}
      />

      {renderAttachment()}

      <Footer>
        <IconWrapper>
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