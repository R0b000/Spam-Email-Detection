import React from 'react';
import { Box, Typography, IconButton, Avatar, Button, Tooltip, Divider } from '@mui/material';
import { 
  ArrowBack, 
  DeleteOutline, 
  ArchiveOutlined, 
  ReportOutlined, 
  MailOutlined, 
  AccessTimeOutlined, 
  FolderOutlined, 
  LabelOutlined, 
  MoreVertOutlined, 
  StarBorder, 
  Star,
  ReplyOutlined, 
  ForwardOutlined,
  PrintOutlined,
  OpenInNewOutlined,
  GetAppOutlined
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { emptyProfilePic } from '../../config/constant';
import type { Mail } from '../../Model/ResponseModel/EmailModel/EmailResponseModel';
import { API_URI } from '../../Configuration/axios';

interface ViewEmailState {
  email: Mail;
  type: string;
}

const EmailViewPage: React.FC = () => {
  const { state } = useLocation();
  const { email, type } = state as ViewEmailState;
  const [isStarred, setIsStarred] = React.useState(email.starred || false);

  const handleStarClick = () => {
    setIsStarred((prev) => !prev);
    // You could also add backend API call to toggle starred status here
  };

  const getAttachmentSrc = () => {
    if (!email.attachment) return '';
    if (email.attachment.path) {
      return `${API_URI}${email.attachment.path}`;
    }
    if (email.attachment.content) {
      return `data:${email.attachment.type};base64,${email.attachment.content}`;
    }
    return email.attachment.src || '';
  };

  const isImageAttachment = () => {
    if (!email.attachment || !email.attachment.type) return false;
    return email.attachment.type.startsWith('image/');
  };

  return (
    <Box
      className="transition-all flex flex-col"
      style={{
        width: '100%',
        padding: '12px 24px 24px 12px',
        boxSizing: 'border-box',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Box className="bg-white rounded-2xl border border-[#dadce0]/60 shadow-sm overflow-hidden flex flex-col h-full">
        
        {/* ── Toolbar Action Bar (Gmail Style) ── */}
        <Box className="flex items-center justify-between border-b border-[#dadce0]/50 bg-white px-5 py-2">
          <Box className="flex items-center gap-1.5">
            <Tooltip title="Back to list">
              <IconButton size="small" onClick={() => window.history.back()} className="text-[#5f6368] hover:bg-gray-100/80">
                <ArrowBack fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

            <Tooltip title="Archive">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <ArchiveOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Report spam">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <ReportOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

            <Tooltip title="Mark as unread">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <MailOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Snooze">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <AccessTimeOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

            <Tooltip title="Move to">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <FolderOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Labels">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <LabelOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="More">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <MoreVertOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className="flex items-center gap-1">
            <Tooltip title="Print email">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <PrintOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="In new window">
              <IconButton size="small" className="text-[#5f6368] hover:bg-gray-100/80">
                <OpenInNewOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Scrollable Email View ── */}
        <Box className="flex-1 overflow-y-auto px-8 py-6">
          
          {/* Email Subject Row */}
          <Box className="flex justify-between items-center mb-6 pl-14">
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#202124', fontSize: '22px' }} className="flex items-center gap-2.5">
              {email.subject || '(No Subject)'}
              <span className="text-[10px] font-bold text-[#1a73e8] bg-[#d3e3fd] px-2 py-0.5 rounded uppercase tracking-wider">
                {type}
              </span>
            </Typography>
          </Box>

          {/* Sender & Recipient Details Row */}
          <Box className="flex gap-4 mb-8">
            <Avatar
              src={emptyProfilePic}
              alt="profile"
              sx={{ width: 40, height: 40, bgcolor: '#ccc' }}
            />
            <Box className="flex-1 min-w-0">
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#202124', display: 'inline-block' }}>
                    {email.senderName || email.name || 'Unknown Sender'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5f6368', display: 'inline-block', ml: 1 }}>
                    &lt;{email.sender || email.receiverEmail || ''}&gt;
                  </Typography>
                  
                  {/* "to me" info */}
                  <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '12px', mt: 0.5 }}>
                    to {email.receiverEmail || 'me'}
                  </Typography>
                </Box>

                {/* Date and actions */}
                <Box className="flex items-center gap-2">
                  <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '12px' }}>
                    {email.date && (
                      <>
                        {new Date(email.date).getDate()}&nbsp;
                        {new Date(email.date).toLocaleString('default', { month: 'short' })}&nbsp;
                        {new Date(email.date).getFullYear()},&nbsp;
                        {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </>
                    )}
                  </Typography>

                  <Tooltip title={isStarred ? 'Unstar' : 'Star'}>
                    <IconButton size="small" onClick={handleStarClick} className="text-[#5f6368]">
                      {isStarred ? (
                        <Star style={{ color: '#f7cb4d', fontSize: 20 }} />
                      ) : (
                        <StarBorder style={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Reply">
                    <IconButton size="small" className="text-[#5f6368]">
                      <ReplyOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <IconButton size="small" className="text-[#5f6368]">
                    <MoreVertOutlined fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Email Body Content */}
              <Typography variant="body1" sx={{ color: '#202124', lineHeight: '1.6', whiteSpace: 'pre-line', fontSize: '14px', mt: 4, pr: 4 }}>
                {email.body}
              </Typography>

              {/* ── Attachments Box ── */}
              {email.attachment && (
                <Box className="mt-8 border border-[#dadce0] rounded-xl p-4 max-w-lg bg-[#f8f9fa]">
                  <Box className="flex items-center justify-between mb-3 border-b border-[#dadce0] pb-2">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#202124' }}>
                      Attachment: {email.attachment.name || 'Unnamed File'}
                    </Typography>
                    <Tooltip title="Download">
                      <IconButton size="small" component="a" href={getAttachmentSrc()} download={email.attachment.name || 'attachment'} className="text-[#1a73e8] hover:bg-blue-50">
                        <GetAppOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {isImageAttachment() ? (
                    <Box className="rounded-lg overflow-hidden border border-[#dadce0] bg-white flex justify-center p-2 max-h-[300px]">
                      <img
                        src={getAttachmentSrc()}
                        alt={email.attachment.name || 'attachment'}
                        className="max-w-full rounded max-h-[280px] object-contain"
                      />
                    </Box>
                  ) : (
                    <Box className="flex items-center gap-3 p-3 bg-white border border-[#dadce0] rounded-lg">
                      <Box className="bg-[#f1f3f4] p-2 rounded text-[#5f6368] font-bold text-xs uppercase">
                        {email.attachment.type?.split('/')[1] || 'FILE'}
                      </Box>
                      <Box className="flex-1 min-w-0">
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500, color: '#202124' }}>
                          {email.attachment.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5f6368' }}>
                          {email.attachment.type}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* ── Reply / Forward Quick Action Buttons ── */}
              <Box className="flex gap-3 mt-10 border-t border-[#f1f3f4] pt-6">
                <Button 
                  variant="outlined" 
                  startIcon={<ReplyOutlined />} 
                  sx={{ 
                    borderRadius: '20px', 
                    textTransform: 'none', 
                    color: '#5f6368', 
                    borderColor: '#dadce0', 
                    px: 3,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#f6f8fc',
                      borderColor: '#c3c6ca',
                      color: '#202124'
                    }
                  }}
                >
                  Reply
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ForwardOutlined />} 
                  sx={{ 
                    borderRadius: '20px', 
                    textTransform: 'none', 
                    color: '#5f6368', 
                    borderColor: '#dadce0', 
                    px: 3,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#f6f8fc',
                      borderColor: '#c3c6ca',
                      color: '#202124'
                    }
                  }}
                >
                  Forward
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailViewPage;
