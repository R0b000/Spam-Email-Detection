import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
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
    <Box
      className="transition-all"
      style={{
        width: `calc(100% - ${sidebarWidth}px)`,
        marginLeft: sidebarWidth,
        padding: '12px 24px 24px 12px',
        boxSizing: 'border-box',
        height: '100%',
      }}
    >
      <Box className="bg-white rounded-2xl border border-[#dadce0]/60 shadow-sm overflow-hidden flex flex-col h-full">
        {/* Action bar */}
        <Box className="flex items-center gap-[12px] border-b border-[#dadce0]/50 bg-white px-5 py-3">
          <IconButton size="small" onClick={() => window.history.back()} className="text-[#5f6368] hover:bg-gray-100/80">
            <ArrowBack fontSize="small" />
          </IconButton>
          <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable Email Details */}
        <Box className="flex-1 overflow-y-auto p-6">
          <Typography variant="h5" className="font-semibold text-gtext mb-6 flex items-center gap-2">
            {email.subject || '(No Subject)'}
            <span className="text-xs font-semibold text-gtext bg-gray-100 rounded px-2 py-0.5 align-middle uppercase">
              {type}
            </span>
          </Typography>

          <Box className="flex gap-4">
            <Avatar
              src={emptyProfilePic}
              alt="profile"
              sx={{ width: 40, height: 40, bgcolor: '#ccc' }}
            />
            <Box className="flex-1">
              <Box className="flex justify-between items-start mb-4">
                <Box>
                  <Typography className="font-semibold text-gtext">
                    {email.to && email.to.split('@')[0]}
                  </Typography>
                  {email.to && (
                    <Typography variant="body2" className="text-gsubtext">
                      &lt;{email.to}&gt;
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" className="text-gsubtext">
                  {email.date && (
                    <>
                      {new Date(email.date).getDate()}&nbsp;
                      {new Date(email.date).toLocaleString('default', { month: 'short' })}&nbsp;
                      {new Date(email.date).getFullYear()}
                    </>
                  )}
                </Typography>
              </Box>

              <Typography className="text-gtext leading-relaxed whitespace-pre-line text-sm mt-4">
                {email.body}
              </Typography>

              {email.attachment && (
                <Box className="mt-6 border border-[#dadce0]/60 rounded-lg p-3 max-w-md bg-gray-50">
                  <Typography variant="caption" className="text-gsubtext block mb-2 font-medium">
                    Attached File
                  </Typography>
                  <img
                    src={email.attachment.src}
                    alt={email.attachment.alt || 'attachment'}
                    className="max-w-full rounded border border-[#dadce0]/40 max-h-[250px] object-contain"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailViewPage;
