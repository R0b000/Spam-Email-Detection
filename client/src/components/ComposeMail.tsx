import React, { useState } from 'react';
import { Paper, Box, Typography, styled, InputBase, TextField, Button } from '@mui/material';
import { Close, DeleteOutlined, AttachFile } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toaster/Toaster';
import httpClient from '../Configuration/axios';
import { API_URLS } from '../Manager/Service/api.urls';
import { Attachment, Mail } from '../Model/ResponseModel/EmailModel/EmailResponseModel';

const dialogStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  right: '80px',
  height: '500px',
  width: '500px',
  maxWidth: '90vw',
  maxHeight: '80vh',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  borderRadius: '12px 12px 0 0',
  backgroundColor: '#f6f8fc',
  padding: '0px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1300,
  border: '1px solid #dadce0',
};

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  background: '#eaf1fb',
  borderBottom: '1px solid #dadce0',
  '& > p': {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1f1f1f',
  },
});

const RecipientsWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 24px 0',
  backgroundColor: '#f6f8fc',
});

const Footer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px 24px',
  alignItems: 'center',
  backgroundColor: '#f6f8fc',
  borderTop: '1px solid #e0e2e6',
});

const IconWrapper = styled(Box)({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  '& svg': {
    cursor: 'pointer',
    color: '#5f6368',
    borderRadius: '50%',
    padding: '6px',
    boxSizing: 'content-box',
    transition: 'all 0.15s ease-in-out',
    '&:hover': {
      backgroundColor: '#e8eaed',
      color: '#202124',
    },
  },
});

const SendButton = styled(Button)({
  background: '#1a73e8',
  color: '#fff',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '20px',
  padding: '6px 24px',
  '&:hover': {
    background: '#1557b0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
});

const StyledInputBase = styled(InputBase)({
  fontSize: '14px',
  padding: '10px 0',
  borderBottom: '1px solid #dadce0',
  width: '100%',
  '& input': {
    color: '#202124',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    padding: '0',
    fontSize: '14px',
    color: '#202124',
    lineHeight: '1.6',
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
  border: '1px solid #dadce0',
  borderRadius: '8px',
  padding: '12px',
  marginTop: '12px',
  backgroundColor: '#fff',
  fontSize: '13px',
  lineHeight: '1.4',
  '& p': {
    margin: '0 0 6px',
    color: '#202124',
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '120px',
    borderRadius: '4px',
    marginBottom: '8px',
    display: 'block',
  },
  '& a': {
    color: '#1a73e8',
    textDecoration: 'none',
    fontWeight: 500,
  },
  '& a:hover': {
    textDecoration: 'underline',
  },
});

interface ComposeMailProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  composeParams?: {
    id?: string;
    recipients?: string;
    subject?: string;
    email?: string;
    attachment?: Attachment | null;
    type?: string;
  } | null;
  setComposeParams?: React.Dispatch<React.SetStateAction<any>>;
}

const ComposeMail = ({ openDialog, setOpenDialog, composeParams, setComposeParams }: ComposeMailProps) => {
  const { showProgressToast, showSuccessToast, showErrorToast } = useToast();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [data, setData] = useState<any>({});

  React.useEffect(() => {
    if (composeParams) {
      setData({
        to: composeParams.recipients || '',
        subject: composeParams.subject || '',
        body: composeParams.email || '',
      });
      setAttachment(composeParams.attachment || null);
    } else {
      setData({});
      setAttachment(null);
    }
  }, [composeParams, openDialog]);

  const sendMessageServices = API_URLS.savesendEmails;
  const saveDraftService = API_URLS.saveDraftEmails;
  const saveSpamServices = API_URLS.saveSpamEmails;

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
    // Close Compose window immediately
    setOpenDialog(false);
    if (setComposeParams) {
      setComposeParams(null);
    }
    showProgressToast('Sending...');

    // Run sending process in background
    (async () => {
      try {
        const spamDetectionResponse = await httpClient.post('/detect', {
          emailSubject: data.subject,
          emailBody: data.body,
        });
        await handleResponseInBackground(spamDetectionResponse, data, userEmail, userName);
      } catch (error: any) {
        console.error('Error sending message in background:', error);
        const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to send email. Please try again.';
        showErrorToast(errMsg);
      }
    })();
  };

  const handleResponseInBackground = async (
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
            attachment: data.attachment || null,
          },
          name: userName,
          date: new Date(),
          starred: false,
          bin: false,
          type: isSpam ? 'spam' : 'sent',
        };

        if (isSpam) {
          await httpClient.post(saveSpamServices.endpoint, payload);
          showSuccessToast('Spam email saved.');
        } else {
          const res = await httpClient.post(sendMessageServices.endpoint, payload);
          showSuccessToast(res.data?.message || 'Email sent.');
        }

        // Clean up the draft document if we sent it
        if (composeParams?.type === 'draft' && composeParams.id) {
          try {
            await httpClient.delete(`/emails/${composeParams.id}`);
          } catch (deleteError) {
            console.error('Error cleaning up draft after sending:', deleteError);
          }
        }
      } else {
        console.error('No prediction found in Python output:', output);
        showErrorToast('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error handling spam detection response in background:', error);
      throw error;
    }
  };

  const closeComposeMail = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const hasContent = 
      (data.to && data.to.trim().length > 0) || 
      (data.subject && data.subject.trim().length > 0) || 
      (data.body && data.body.trim().length > 0) ||
      attachment !== null;

    // Close window immediately
    setOpenDialog(false);

    if (!hasContent) {
      if (composeParams?.type === 'draft' && composeParams.id) {
        (async () => {
          try {
            await httpClient.delete(`/emails/${composeParams.id}`);
            showSuccessToast('Draft deleted.');
          } catch (error) {
            console.error('Error deleting empty draft:', error);
          }
        })();
      }
      setData({});
      setAttachment(null);
      if (setComposeParams) {
        setComposeParams(null);
      }
      return;
    }

    showProgressToast('Saving draft...');

    // Run saving draft process in background
    (async () => {
      try {
        const messageContent: Record<string, unknown> = {};
        if (data.subject) messageContent.subject = data.subject;
        if (data.body) messageContent.body = data.body;
        if (attachment) {
          messageContent.attachment = {
            name: attachment.name,
            type: attachment.type,
            content: attachment.content,
          };
        }

        const payload = {
          senderId: userEmail,
          receiverEmail: data.to || null,
          content: Object.keys(messageContent).length > 0 ? messageContent : null,
          name: userName,
          date: new Date(),
          starred: false,
          bin: false,
          type: 'draft',
        };

        if (composeParams?.type === 'draft' && composeParams.id) {
          // Update the existing draft
          await httpClient.put(`/emails/${composeParams.id}`, payload);
          showSuccessToast('Draft updated.');
        } else {
          // Create a new draft
          await httpClient.post(saveDraftService.endpoint, payload);
          showSuccessToast('Draft saved.');
        }
      } catch (error: any) {
        console.error('Error saving draft in background:', error);
        const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to save draft.';
        showErrorToast(errMsg);
      } finally {
        if (setComposeParams) {
          setComposeParams(null);
        }
      }
    })();
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

  if (!openDialog) return null;

  console.log(composeParams);

  return (
    <Paper sx={dialogStyle} elevation={4}>
      <Header>
        <Typography>New Message</Typography>
        <Close fontSize="small" onClick={(e) => closeComposeMail(e)} style={{ cursor: 'pointer', color: '#5f6368' }} />
      </Header>
      <RecipientsWrapper>
        <StyledInputBase placeholder="Recipients" name="to" value={data.to || ''} onChange={(e) => onValueChange(e, 'to')} />
        <StyledInputBase placeholder="Subject" name="subject" value={data.subject || ''} onChange={(e) => onValueChange(e, 'subject')} />
      </RecipientsWrapper>
      <Box sx={{ flex: 1, overflowY: 'auto', p: '16px 24px', display: 'flex', flexDirection: 'column' }}>
        <StyledTextField
          multiline
          fullWidth
          placeholder="Compose email..."
          minRows={8}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          value={data.body || ''}
          onChange={(e) => onValueChange(e, 'body')}
        />
        {renderAttachment()}
      </Box>
      <Footer>
        <Box>
          {sendingMessage ? (
            <Typography variant="body2" color="textSecondary">
              Sending...
            </Typography>
          ) : (
            <SendButton onClick={(e) => sendMail(data)}>Send</SendButton>
          )}
        </Box>
        <IconWrapper>
          <AttachFile onClick={handleAttachFileClick} />
          <DeleteOutlined onClick={handleDelete} />
        </IconWrapper>
      </Footer>
    </Paper>
  );
};

export default ComposeMail;
