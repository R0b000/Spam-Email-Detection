import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { useOutletContext, useLocation } from 'react-router-dom';
import { emptyProfilePic } from '../../config/constant';
import type { Mail } from '../../Model/ResponseModel/EmailModel/EmailResponseModel';
import type { EmailOutletContext } from './EmailLayout';

interface ViewEmailState {
  email: Mail;
  type: string;
}

const EmailViewPage: React.FC = () => {
  const { sidebarWidth } = useOutletContext<EmailOutletContext>();
  const { state } = useLocation();
  const { email, type } = state as ViewEmailState;

  console.log('Attachment:', email.attachment);

  return (
    <Box className="ml-[15px] w-full" style={{ width: `calc(100% - ${sidebarWidth}px)`, marginLeft: sidebarWidth }}>
      <Box className="p-[15px]">
        <ArrowBack fontSize="small" color="action" onClick={() => window.history.back()} />
        <Delete fontSize="small" color="action" className="ml-[40px]" />
      </Box>
      <Typography className="text-[22px] font-bold m-[10px_0_20px_75px] flex items-center">
        {email.subject}
        <span className="text-xs text-[#5E5E5E] bg-[#ddd] text-[#222] rounded-[4px] ml-[6px] px-[4px] py-[2px] self-center align-middle">
          {type}
        </span>
      </Typography>
      <Box className="flex">
        <img
          src={emptyProfilePic}
          alt="profile"
          className="rounded-[50%] w-[40px] h-[40px] m-[5px_10px_0_10px] bg-[#ccc]"
        />
        <Box className="mr-[50px] w-full">
          <Box>
            <Typography>
              {email.to && email.to.split('@')[0]}
              {email.to && (
                <Box component="span">
                  &nbsp;&#60;{email.to}&#62;
                </Box>
              )}
            </Typography>
            <Typography className="absolute m-[0_50px_100px_auto] text-[14px] text-[#5E5E5E]">
              {email.date && (
                <>
                  {new Date(email.date).getDate()}&nbsp;
                  {new Date(email.date).toLocaleString('default', { month: 'long' })}&nbsp;
                  {new Date(email.date).getFullYear()}
                </>
              )}
            </Typography>
          </Box>
          <Typography className="mt-[20px] text-justify text-[16px]">
            {email.body}
          </Typography>
          {email.attachment && (
            <img
              src={email.attachment.src}
              alt={email.attachment.alt}
              className="max-w-full max-h-[200px] mt-[20px]"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmailViewPage;
