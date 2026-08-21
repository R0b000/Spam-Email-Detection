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
  GetAppOutlined,
  PictureAsPdfOutlined,
  InsertDriveFileOutlined
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { emptyProfilePic } from '../../config/constant';
import type { Mail } from '../../Model/ResponseModel/EmailModel/EmailResponseModel';
import { API_URI } from '../../Configuration/axios';
import { useAuth } from '../../context/AuthContext';

interface ViewEmailState {
  email: Mail;
  type: string;
}

const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Sent-side types: user is the sender
const SENT_TYPES = ['sent', 'draft'];

const EmailViewPage: React.FC = () => {
  const { state } = useLocation();
  const { email, type } = state as ViewEmailState;
  const [isStarred, setIsStarred] = React.useState(email.starred || false);
  const { user } = useAuth();

  const handleStarClick = () => {
    setIsStarred((prev) => !prev);
    // You could also add backend API call to toggle starred status here
  };

  const getAttachmentSrc = () => {
    if (!email.attachment) return '';
    if (email.attachment.path) {
      // In dev, vite runs on a different port to the server, so we need the absolute URL.
      // In production (Docker/Render), both are on the same origin so relative path works.
      const base = import.meta.env.DEV ? API_URI : '';
      return `${base}${email.attachment.path}`;
    }
    if (email.attachment.content) {
      return `data:${email.attachment.type};base64,${email.attachment.content}`;
    }
    return email.attachment.src || '';
  };

  const getDownloadSrc = () => {
    if (!email.attachment) return '';
    if (email.attachment.path) {
      const base = import.meta.env.DEV ? API_URI : '';
      const file = encodeURIComponent(email.attachment.path);
      const name = encodeURIComponent(email.attachment.name || email.attachment.path);
      return `${base}/api/download?file=${file}&name=${name}`;
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

  const isPdfAttachment = () => {
    if (!email.attachment) return false;
    const type = (email.attachment.type || '').toLowerCase();
    const name = (email.attachment.name || '').toLowerCase();
    return type === 'application/pdf' || type === 'application/x-pdf' || type.endsWith('pdf') || name.endsWith('.pdf');
  };

  return (
    <Box
      className="transition-all flex flex-col"
      sx={{
        width: '100%',
        padding: { xs: '8px', sm: '12px 24px 24px 12px' },
        boxSizing: 'border-box',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Box 
        className="bg-white border border-[#dadce0]/60 shadow-sm overflow-hidden flex flex-col h-full"
        sx={{ borderRadius: { xs: '8px', sm: '16px' } }}
      >
        
        {/* ── Toolbar Action Bar (Gmail Style) ── */}
        <Box className="flex items-center justify-between border-b border-[#dadce0]/50 bg-white px-3 sm:px-5 py-2 overflow-x-auto" sx={{ '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <Box className="flex items-center gap-1.5 shrink-0">
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
 
          <Box className="flex items-center gap-1 shrink-0 ml-4">
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
        <Box className="flex-1 overflow-y-auto" sx={{ px: { xs: 2, sm: 8 }, py: { xs: 3, sm: 6 } }}>
          
          {/* Email Subject Row */}
          <Box mb={6} sx={{ pl: { xs: 0, sm: 8, md: 14 } }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#202124', fontSize: { xs: '18px', sm: '22px' } }} className="flex items-center gap-2.5 flex-wrap">
              {email.subject || '(No Subject)'}
              <span className="text-[10px] font-bold text-[#1a73e8] bg-[#d3e3fd] px-2 py-0.5 rounded uppercase tracking-wider">
                {type}
              </span>
            </Typography>
          </Box>
 
          {/* Sender & Recipient Details Row */}
          <Box className="flex gap-3 sm:gap-4 mb-8">
            <Avatar
              src={emptyProfilePic}
              alt="profile"
              sx={{ width: 40, height: 40, bgcolor: '#ccc' }}
            />
            <Box className="flex-1 min-w-0">
              <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <Box className="min-w-0 flex-1">
                  <div className="flex items-baseline flex-wrap gap-x-1.5">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#202124' }}>
                      {email.senderDisplay || 'Unknown Sender'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '12px' }} className="truncate">
                      &lt;{email.senderEmailDisplay || ''}&gt;
                    </Typography>
                  </div>
                  <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '12px', mt: 0.5 }}>
                    to {email.receiverDisplay || ''}
                  </Typography>
                </Box>
 
                {/* Date and actions */}
                <Box className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '11px' }}>
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
              <Typography variant="body1" sx={{ color: '#202124', lineHeight: '1.6', whiteSpace: 'pre-line', fontSize: '14px', mt: 4, pr: { xs: 0, sm: 4 } }}>
                {email.body}
              </Typography>

              {/* ── Attachments Box ── */}
              {email.attachment && (
                <Box sx={{ mt: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3c4043', mb: 1.5 }}>
                    Attachments
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2 
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '240px', 
                        border: '1px solid #dadce0', 
                        borderRadius: '8px', 
                        overflow: 'hidden', 
                        backgroundColor: '#f8f9fa',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'default',
                        '&:hover': {
                          boxShadow: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
                          '& .attachment-actions': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      {/* Upper half: Thumbnail/Preview */}
                      <Box 
                        sx={{ 
                          height: '120px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          backgroundColor: '#e8eaed',
                          position: 'relative',
                          borderBottom: '1px solid #dadce0',
                          overflow: 'hidden'
                        }}
                      >
                        {isImageAttachment() ? (
                          <img
                            src={getAttachmentSrc()}
                            alt={email.attachment.name || 'attachment'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : isPdfAttachment() ? (
                          <PictureAsPdfOutlined sx={{ fontSize: 48, color: '#ea4335' }} />
                        ) : (
                          <InsertDriveFileOutlined sx={{ fontSize: 48, color: '#1a73e8' }} />
                        )}
                        
                        {/* Hover Overlay with Actions */}
                        <Box 
                          className="attachment-actions"
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            backgroundColor: 'rgba(0,0,0,0.4)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: 1.5,
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <Tooltip title="View in new tab">
                            <IconButton 
                              size="small" 
                              component="a" 
                              href={getAttachmentSrc()} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              sx={{ 
                                color: 'white', 
                                backgroundColor: 'rgba(255,255,255,0.2)', 
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } 
                              }}
                            >
                              <OpenInNewOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton 
                              size="small" 
                              component="a" 
                              href={getDownloadSrc()}
                              sx={{ 
                                color: 'white', 
                                backgroundColor: 'rgba(255,255,255,0.2)', 
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } 
                              }}
                            >
                              <GetAppOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Lower half: Details */}
                      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500, color: '#3c4043' }}>
                          {email.attachment.name || 'Unnamed File'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5f6368', mt: 0.5 }}>
                          {email.attachment.size ? formatFileSize(email.attachment.size) : (email.attachment.type || 'Unknown Type')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
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
