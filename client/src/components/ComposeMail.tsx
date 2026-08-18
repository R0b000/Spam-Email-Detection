import React, { useState } from 'react';
import { Paper, Box, Typography, styled, InputBase, TextField, Button, Autocomplete, Chip, Avatar } from '@mui/material';
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
  const [draftId, setDraftId] = useState<string | null>(null);
  const [userSuggestions, setUserSuggestions] = useState<{ name: string; email: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  React.useEffect(() => {
    if (composeParams) {
      setData({
        subject: composeParams.subject || '',
        body: composeParams.email || '',
      });
      setAttachment(composeParams.attachment || null);
      setDraftId(composeParams.id || null);

      const rec = composeParams.recipients 
        ? composeParams.recipients.split(',').map((e: string) => e.trim()).filter(Boolean)
        : [];
      setSelectedRecipients(rec);
    } else {
      setData({});
      setAttachment(null);
      setDraftId(null);
      setSelectedRecipients([]);
    }
  }, [composeParams, openDialog]);

  React.useEffect(() => {
    if (!inputValue.trim()) {
      setUserSuggestions([]);
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await httpClient.get(`/users?query=${inputValue}`);
        const resData = response.data as { data: { name: string; email: string }[] };
        setUserSuggestions(resData.data || []);
      } catch (err) {
        console.error('Error fetching user suggestions:', err);
      }
    };
    const timeoutId = setTimeout(fetchUsers, 200);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const sendMessageServices = API_URLS.savesendEmails;
  const saveDraftService = API_URLS.saveDraftEmails;
  const saveSpamServices = API_URLS.saveSpamEmails;

  const { user } = useAuth();
  const userEmail = user?.email ?? null;
  const userName = user?.name ?? null;

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    if (fieldName === 'subject') {
      setData({ ...data, subject: e.target.value });
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
        await handleResponseInBackground(spamDetectionResponse, data, selectedRecipients, userEmail, userName);
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
    recipients: string[],
    userEmail: string | null,
    userName: string | null
  ) => {
    try {
      const output = spamDetectionResponse.data.result;
      const predictionIndex = output.indexOf('Prediction:');
      if (predictionIndex !== -1) {
        const prediction = output.substring(predictionIndex);
        const isSpam = prediction.includes('classified as SPAM');

        const payload = {
          senderId: userEmail,
          receiverEmail: recipients,
          content: {
            subject: data.subject,
            body: data.body,
            attachment: attachment || null,
          },
          name: userName,
          date: new Date(),
          starred: false,
          bin: false,
          isSpam: isSpam,
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
        if (composeParams?.type === 'draft' && draftId) {
          try {
            await httpClient.delete(`/emails/${draftId}`);
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
      (selectedRecipients.length > 0) || 
      (data.subject && data.subject.trim().length > 0) || 
      (data.body && data.body.trim().length > 0) ||
      attachment !== null;

    // Close window immediately
    setOpenDialog(false);

    // Case 1: No id + no content → just close, no API call
    if (!hasContent && !draftId) {
      setData({});
      setAttachment(null);
      setSelectedRecipients([]);
      if (setComposeParams) {
        setComposeParams(null);
      }
      return;
    }

    // Case 4: Has id + no content → delete the draft
    if (!hasContent && draftId) {
      showProgressToast('Deleting draft...');
      (async () => {
        try {
          await httpClient.delete(`/emails/${draftId}`);
          showSuccessToast('Draft deleted.');
        } catch (error) {
          console.error('Error deleting draft:', error);
        } finally {
          if (setComposeParams) {
            setComposeParams(null);
          }
        }
      })();
      setData({});
      setAttachment(null);
      setSelectedRecipients([]);
      return;
    }

    // Build payload for save/update
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
      receiverEmail: selectedRecipients,
      content: Object.keys(messageContent).length > 0 ? messageContent : null,
      name: userName,
      date: new Date(),
      starred: false,
      bin: false,
      type: 'draft',
    };

    if (draftId) {
      // Case 3: Has id + has content → PUT update existing draft
      showProgressToast('Updating draft...');
      (async () => {
        try {
          await httpClient.put(`/emails/${draftId}`, payload);
          showSuccessToast('Draft updated.');
        } catch (error: any) {
          console.error('Error updating draft:', error);
          const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to update draft.';
          showErrorToast(errMsg);
        } finally {
          if (setComposeParams) {
            setComposeParams(null);
          }
        }
      })();
    } else {
      // Case 2: No id + has content → POST save new draft
      showProgressToast('Saving draft...');
      (async () => {
        try {
          await httpClient.post(saveDraftService.endpoint, payload);
          showSuccessToast('Draft saved.');
        } catch (error: any) {
          console.error('Error saving draft:', error);
          const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to save draft.';
          showErrorToast(errMsg);
        } finally {
          if (setComposeParams) {
            setComposeParams(null);
          }
        }
      })();
    }
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
        <Autocomplete
          multiple
          freeSolo
          options={userSuggestions}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.email)}
          value={selectedRecipients}
          onChange={(_, newValue) => {
            const emails = newValue.map((val) => (typeof val === 'string' ? val : val.email));
            setSelectedRecipients(emails);
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
                sx={{ margin: '2px 4px 2px 0' }}
              />
            ))
          }
          renderInput={(params) => {
            const { InputLabelProps, InputProps, ...rest } = params;
            return (
              <Box 
                ref={params.InputProps.ref} 
                className="flex items-center flex-wrap py-1 border-b border-[#dadce0] w-full min-h-[40px]"
              >
                {params.InputProps.startAdornment}
                <input
                  {...params.inputProps}
                  {...rest}
                  placeholder={selectedRecipients.length === 0 ? "Recipients" : ""}
                  className="flex-1 min-w-[120px] border-none outline-none text-sm text-gtext bg-transparent py-1.5"
                />
              </Box>
            );
          }}
          renderOption={(props, option) => (
            <li {...props} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
              <Avatar sx={{ width: 28, height: 28, fontSize: '11px', bgcolor: 'var(--color-brand-blue)' }}>
                {option.name ? option.name.charAt(0).toUpperCase() : option.email.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-gtext">{option.name || 'User'}</span>
                <span className="text-gsubtext text-xs">{option.email}</span>
              </div>
            </li>
          )}
          noOptionsText={inputValue.trim() ? "No users found" : "Type to search users..."}
          sx={{ width: '100%' }}
        />
        <StyledInputBase 
          placeholder="Subject" 
          name="subject" 
          value={data.subject || ''} 
          onChange={(e) => onValueChange(e, 'subject')} 
        />
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
