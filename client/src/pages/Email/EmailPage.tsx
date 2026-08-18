import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { DeleteOutline, RefreshOutlined, MoreVertOutlined, Star, StarBorder } from '@mui/icons-material';
import Table from '../../components/Table/Table';
import { API_URLS } from '../../Manager/Service/api.urls';
import httpClient from '../../Configuration/axios';
import type { Mail } from '../../Model/ResponseModel/EmailModel/EmailResponseModel';
import type { EmailOutletContext } from './EmailLayout';
import EmailPageLayout from './EmailPageLayout';
import { useAuth } from '../../context/AuthContext';

interface OutletContext extends EmailOutletContext {
  openDrawer: boolean;
  selectedEmails: string[];
  setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  composeParams: any;
  setComposeParams: React.Dispatch<React.SetStateAction<any>>;
  unreadCount?: number;
  fetchUnreadCount?: () => Promise<void>;
}

const EmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [starredSet, setStarredSet] = useState<Set<string>>(new Set());

  const { type = '' } = useParams();
  const { selectedEmails, setSelectedEmails, setOpenDialog, setComposeParams, fetchUnreadCount } = useOutletContext<OutletContext>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEmails = async () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) {
        console.error('User email not found');
        return;
      }

      const response = await httpClient.get(`/emails/${type}?userEmail=${userEmail}`);
      const payload = response.data as { message: string; data: Mail[] };
      setEmails(payload.data ?? []);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  // Fetch on mount, on route change, and on manual refresh
  useEffect(() => {
    fetchEmails();

    // Poll every 5 seconds
    const intervalId = setInterval(() => {
      fetchEmails();
    }, 5000);

    return () => {
      clearInterval(intervalId);
      setSelectedEmails([]);
    };
  }, [type, refresh, user?.email, setSelectedEmails]);

  useEffect(() => {
    setSelectedEmails([]);
  }, [type, setSelectedEmails]);

  const toggleStar = async (email: Mail) => {
    try {
      await httpClient.put(API_URLS.toggleStarredMails.endpoint, { id: email._id, value: !email.starred });
      setStarredSet((prev) => {
        const next = new Set(prev);
        if (next.has(email._id)) {
          next.delete(email._id);
        } else {
          next.add(email._id);
        }
        return next;
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error toggling starred email:', error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedEmails(checked ? emails.map((e) => e._id) : []);
  };

  const deleteSelected = async () => {
    if (selectedEmails.length === 0) return;
    try {
      await httpClient.put(API_URLS.deleteSelectedEmails.endpoint, {
        messageIds: selectedEmails,
        type: 'bin',
        value: true,
      });
      setRefresh((prev) => !prev);
      setSelectedEmails([]);
    } catch (error) {
      console.error('Error updating emails:', error);
    }
  };

  const allSelected = emails.length > 0 && selectedEmails.length === emails.length;
  const someSelected = selectedEmails.length > 0 && !allSelected;

  const columns = [
    {
      id: 'select_star',
      label: '',
      gridSpan: 1,
      render: (row: Mail) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Checkbox
            size="small"
            checked={selectedEmails.includes(row._id)}
            onChange={() => toggleSelect(row._id)}
            onClick={(e) => e.stopPropagation()}
            sx={{ p: 0.5 }}
          />
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleStar(row); }} sx={{ p: 0.5 }}>
            {row.starred || starredSet.has(row._id) ? (
              <Star style={{ color: '#f7cb4d', fontSize: 20 }} />
            ) : (
              <StarBorder style={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>
      ),
    },
    {
      id: 'sender',
      label: 'Sender',
      gridSpan: 4,
      render: (row: Mail) => {
        if (type === 'draft' || row.type === 'draft') {
          return (
            <span className="text-[#d93025] font-semibold">
              Draft
            </span>
          );
        }
        if (type === 'inbox') {
          return (
            <span className={`${row.isRead ? 'font-normal' : 'font-semibold'} text-gtext truncate block w-full`}>
              {row.senderName || row.name || row.receiverEmail || ''}
            </span>
          );
        }
        if (type === 'sent') {
          return (
            <span className={`${row.isRead ? 'font-normal' : 'font-semibold'} text-gtext truncate block w-full`}>
              {row.receiverEmail ? `To - ${row.receiverEmail}` : ''}
            </span>
          );
        }
        // Fallback for other tabs (starred, bin, allmail, spam)
        const isOutbound = row.type === 'sent' || row.sender === user?.email;
        const displayValue = isOutbound
          ? (row.receiverEmail ? `To - ${row.receiverEmail}` : '')
          : (row.senderName || row.name || row.receiverEmail || '');
        return (
          <span className={`${row.isRead ? 'font-normal' : 'font-semibold'} text-gtext truncate block w-full`}>
            {displayValue}
          </span>
        );
      },
    },
    {
      id: 'subject',
      label: 'Subject',
      gridSpan: 11,
      render: (row: Mail) => (
        <div className="truncate text-sm flex items-center gap-1.5 w-full pr-4">
          <span className={`${row.isRead ? 'font-normal' : 'font-semibold'} text-gtext truncate`}>
            {row.subject || '(No Subject)'}
          </span>
          {row.body && (
            <span className="text-gsubtext font-normal truncate">
              {' — '}
              {row.body}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      gridSpan: 2,
      align: 'right' as const,
      render: (row: Mail) => {
        const d = new Date(row.date);
        return (
          <span className="text-sm text-gsubtext pr-4 block text-right w-full">
            {d.getDate()} {d.toLocaleString('default', { month: 'short' })}
          </span>
        );
      },
    },
  ];

  return (
    <EmailPageLayout>
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
          {/* Toolbar */}
          <Box className="flex items-center gap-[6px] border-b border-[#dadce0]/50 bg-white px-5 py-3">
            <Checkbox
              size="small"
              checked={allSelected}
              onChange={(e) => selectAll(e.target.checked)}
              indeterminate={someSelected}
              sx={{ p: 0.5 }}
            />
            <IconButton onClick={() => setRefresh((prev) => !prev)} className="text-[#5f6368] hover:bg-gray-100/80" size="small">
              <RefreshOutlined fontSize="small" />
            </IconButton>
            <IconButton
              onClick={deleteSelected}
              disabled={selectedEmails.length === 0}
              className="text-[#5f6368] hover:bg-gray-100/80 disabled:opacity-40"
              size="small"
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
            {selectedEmails.length > 0 && (
              <Typography variant="body2" className="ml-2 font-medium text-gtext">
                {selectedEmails.length} selected
              </Typography>
            )}
            <Box className="ml-auto flex">
              <IconButton className="text-[#5f6368] hover:bg-gray-100/80" size="small">
                <MoreVertOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box className="flex-1 overflow-y-auto">
            {emails.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                  borderBottom: '1px solid #f1f3f4',
                  fontSize: '0.875rem',
                  color: '#5f6368',
                  backgroundColor: '#ffffff',
                }}
              >
                Your {type} is empty.
              </Box>
            ) : (
              <Table
                columns={columns}
                rows={emails}
                keyExtractor={(row) => row._id}
                getRowSx={(row) => ({
                  backgroundColor: row.isRead ? '#ffffff' : '#eaf1fb',
                })}
                onRowClick={async (row) => {
                  if (row.type === 'draft' || type === 'draft') {
                    setComposeParams({
                      id: row._id,
                      recipients: row.receiverEmail || '',
                      subject: row.subject || '',
                      email: row.body || '',
                      attachment: row.attachment || null,
                      type: 'draft',
                    });
                    setOpenDialog(true);
                    return;
                  }
                  if (!row.isRead) {
                    try {
                      await httpClient.put('/read', { id: row._id, value: true });
                      if (fetchUnreadCount) fetchUnreadCount();
                    } catch (error) {
                      console.error('Error marking email as read:', error);
                    }
                  }
                  navigate(`/emails/${type}/view`, { state: { email: { ...row, isRead: true }, type } });
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </EmailPageLayout>
  );
};

export default EmailPage;
