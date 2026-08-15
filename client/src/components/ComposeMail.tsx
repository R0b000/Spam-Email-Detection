import React, { useState } from 'react';
import { Dialog, Box, Typography, InputBase, TextField, Button } from '@mui/material';
import { Close, DeleteOutlined, AttachFile } from '@mui/icons-material';
import useApi from '../Helper/useApi';
import { API_URLS } from '../Manager/Service/api.urls';
import axios from 'axios';
import { API_URI } from '../Configuration/axios';
import { useAuth } from '../context/AuthContext';
import type { Attachment, SpamDetectionResponse } from '../Model/ResponseModel/EmailModel/EmailResponseModel';
import type { EmailContent, SendEmailRequest, SaveDraftRequest, SaveSpamRequest, SpamDetectionRequest } from '../Model/RequestModel/EmailModel/EmailRequestModel';

interface ComposeMailProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ComposeData {
  to: string;
  subject: string;
  body: string;
  attachment?: Attachment;
}

const ComposeMail = ({ openDialog, setOpenDialog }: ComposeMailProps) => {
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [data, setData] = useState<ComposeData>({ to: '', subject: '', body: '' });

  const sendMessageServices = useApi(API_URLS.savesendEmails);
  const saveDraftService = useApi(API_URLS.saveDraftEmails);
  const saveSpamServices = useApi(API_URLS.saveSpamEmails);

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

  const buildEmailContent = (): EmailContent => {
    const content: EmailContent = {};
    if (data.subject) content.subject = data.subject;
    if (data.body) content.body = data.body;
    if (attachment) content.attachment = attachment;
    return content;
  };

  const sendMail = async (formData: ComposeData) => {
    try {
      setSendingMessage(true);

      const spamDetectionResponse = await axios.post<SpamDetectionResponse>(`${API_URI}/detect`, {
        emailSubject: formData.subject,
        emailBody: formData.body,
      });

      handleResponse(spamDetectionResponse, formData, userEmail, userName);
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
    spamDetectionResponse: { data: SpamDetectionResponse },
    formData: ComposeData,
    userEmail: string | null,
    userName: string | null
  ) => {
    try {
      const output = spamDetectionResponse.data.result;
      const predictionIndex = output.indexOf('Prediction:');
      if (predictionIndex !== -1) {
        const prediction = output.substring(predictionIndex);
        const isSpam = prediction.includes('classified as SPAM');

        const payload: SendEmailRequest = {
          senderId: userEmail ?? '',
          receiverEmail: formData.to,
          content: buildEmailContent(),
          name: userName ?? '',
          date: new Date().toISOString(),
          starred: false,
          bin: false,
          type: isSpam ? 'spam' : 'sent',
        };

        if (isSpam) {
          const spamPayload: SaveSpamRequest = { ...payload, type: 'spam' };
          await saveSpamServices.call(spamPayload);
          alert(saveSpamServices.data?.message);
        } else {
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
      const payload: SaveDraftRequest = {
        senderId: userEmail ?? '',
        receiverEmail: data.to || null,
        content: Object.keys(buildEmailContent()).length > 0 ? buildEmailContent() : null,
        name: userName ?? '',
        date: new Date().toISOString(),
        starred: false,
        bin: false,
        type: 'draft',
      };

      saveDraftService.call(payload);

      if (saveDraftService.status === 200) {
        alert(saveDraftService.data?.message);
        setData({ to: '', subject: '', body: '' });
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
    setData({ to: '', subject: '', body: '' });
    setAttachment(null);
    setOpenDialog(false);
  };

  const renderAttachment = () => {
    if (attachment && attachment.name && attachment.type && attachment.content) {
      return (
        <div className="border border-[#ccc] rounded-[4px] p-1 max-w-full w-[91.3%] z-[1] text-sm leading-[1.2] max-h-[133.5px] overflow-y-auto mb-0 absolute bottom-[65px] left-0 right-0">
          <p className="mb-[3px]">Attached File: {attachment.name}</p>
          <p className="mb-[3px]">File Type: {attachment.type}</p>
          {attachment.type.startsWith('image') ? (
            <img src={`data:${attachment.type};base64,${attachment.content}`} alt={attachment.name} className="max-w-full max-h-[100px] mb-[3px]" />
          ) : (
            <a href={`data:${attachment.type};base64,${attachment.content}`} download={attachment.name} className="text-[#007bff] text-decoration-none cursor-pointer hover:underline">
              Download {attachment.name}
            </a>
          )}
          <div>
            <Button onClick={handleRemoveAttachment}>Remove Attachment</Button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog
      open={openDialog}
      PaperProps={{
        sx: {
          height: '90%',
          width: '60%',
          maxWidth: '600px',
          maxHeight: '600px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          backgroundColor: '#fff',
          padding: '20px',
          overflow: 'auto',
        },
      }}
    >
      <Box className="flex justify-between items-center p-[10px_15px] bg-[#f2f6fc] [&>p]:text-[14px] [&>p]:font-medium">
        <Typography>New Message</Typography>
        <Close fontSize="small" onClick={(e) => closeComposeMail(e)} />
      </Box>
      <Box className="flex flex-col p-[0_15px] [&>div]:text-[14px] [&>div]:border-b [&>div]:border-[#f5f5f5] [&>div]:mt-[10px]">
        <InputBase
          placeholder="Recipients"
          name="to"
          onChange={(e) => onValueChange(e, 'to')}
          className="text-[14px] p-[8px_12px] mb-[10px] border-none rounded-[4px] focus:border-[#80bdff] focus:ring-2 focus:ring-[rgba(0,123,255,0.25)]"
        />
        <InputBase
          placeholder="Subject"
          name="subject"
          onChange={(e) => onValueChange(e, 'subject')}
          className="text-[14px] p-[8px_12px] mb-[10px] border-none rounded-[4px] focus:border-[#80bdff] focus:ring-2 focus:ring-[rgba(0,123,255,0.25)]"
        />
      </Box>
      <TextField
        multiline
        rows={attachment ? 8 : 14}
        onChange={(e) => onValueChange(e, 'body')}
        className="mb-[10px]"
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      />

      {renderAttachment()}

      <Box className="absolute bottom-[10px] left-0 right-0 flex justify-between items-center p-[10px_15px]">
        <Box className="flex">
          {sendingMessage ? (
            <Typography variant="body2" color="textSecondary">
              Sending...
            </Typography>
          ) : (
            <Button
              onClick={(e) => sendMail(data)}
              className="bg-[#0b57d0] text-white font-medium text-none rounded-[18px] w-[100px] normal-case"
            >
              Send
            </Button>
          )}
        </Box>
        <Box className="flex">
          <AttachFile onClick={handleAttachFileClick} />
          <DeleteOutlined onClick={handleDelete} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default ComposeMail;
