import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
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

const EmailSearchPage: React.FC = () => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [starredSet, setStarredSet] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

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

      if (!query.trim()) {
        setEmails([]);
        return;
      }

      const response = await httpClient.get(`/search-emails?userEmail=${userEmail}&query=${query}`);
      const payload = response.data as { data: Mail[] };
      setEmails(payload.data ?? []);
    } catch (error) {
      console.error('Error searching emails:', error);
    }
  };

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
  }, [query, refresh, user?.email, setSelectedEmails]);

  useEffect(() => {
    setSelectedEmails([]);
  }, [query, setSelectedEmails]);

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

  const isEmailRead = (row: Mail) => {
    return row.senderEmail === user?.email ? row.SRead : row.RRead;
  };

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
      gridSpan: 3,
      render: (row: Mail) => (
        <span className="text-sm font-semibold text-gtext truncate block max-w-full">
          {row.senderName || row.name || 'Unknown'}
        </span>
      ),
    },
    {
      id: 'content',
      label: 'Subject & Body',
      gridSpan: 6,
      render: (row: Mail) => (
        <span className="text-sm text-gtext truncate block max-w-full">
          <strong className="font-semibold">{row.subject || '(No Subject)'}</strong>
          {row.body && <span className="text-gsubtext font-normal"> — {row.body}</span>}
        </span>
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
          {/* Toolbar */}
          <Box className="flex items-center gap-[6px] border-b border-[#dadce0]/50 bg-white" sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 1, sm: 1.5 } }}>
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
                No search results found matching "{query}".
              </Box>
            ) : (
              <Table
                columns={columns}
                rows={emails}
                keyExtractor={(row) => row._id}
                getRowSx={(row) => ({
                  backgroundColor: isEmailRead(row) ? '#ffffff' : '#eaf1fb',
                })}
                onRowClick={async (row) => {
                  if (row.type === 'draft') {
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
                  if (!isEmailRead(row)) {
                    try {
                      await httpClient.put('/read', { id: row._id, value: true, userEmail: user?.email });
                      if (fetchUnreadCount) fetchUnreadCount();
                    } catch (error) {
                      console.error('Error marking email as read:', error);
                    }
                  }
                  const isSender = row.senderEmail === user?.email;
                  const updatedRow = {
                    ...row,
                    SRead: isSender ? true : row.SRead,
                    RRead: !isSender ? true : row.RRead
                  };
                  navigate(`/emails/${row.type || 'inbox'}/view`, { state: { email: updatedRow, type: row.type || 'inbox' } });
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </EmailPageLayout>
  );
};

export default EmailSearchPage;
