import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { DeleteOutline, RefreshOutlined, MoreVertOutlined, Star, StarBorder } from '@mui/icons-material';
import Table from '../../components/Table/Table';
import { API_URLS } from '../../Manager/Service/api.urls';
import NoMails from '../../components/common/NoMails';
import { EMPTY_TABS } from '../../config/constant';
import httpClient from '../../Configuration/axios';
import type { Mail } from '../../Model/ResponseModel/EmailModel/EmailResponseModel';
import type { EmailOutletContext } from './EmailLayout';
import EmailPageLayout from './EmailPageLayout';
import { useAuth } from '../../context/AuthContext';

interface OutletContext extends EmailOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
  selectedEmails: string[];
  setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

const EmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [starredSet, setStarredSet] = useState<Set<string>>(new Set());

  const { type = '' } = useParams();
  const { sidebarWidth } = useOutletContext<OutletContext>();
  const { selectedEmails, setSelectedEmails } = useOutletContext<OutletContext>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchEmails();

    return () => {
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
      id: 'select',
      label: '',
      align: 'center' as const,
      render: (row: Mail) => (
        <Checkbox
          size="small"
          checked={selectedEmails.includes(row._id)}
          onChange={() => toggleSelect(row._id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      id: 'star',
      label: '',
      align: 'center' as const,
      render: (row: Mail) => (
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleStar(row); }}>
          {row.starred || starredSet.has(row._id) ? <Star style={{ color: '#f7cb4d', fontSize: 20 }} /> : <StarBorder style={{ fontSize: 20 }} />}
        </IconButton>
      ),
    },
    {
      id: 'sender',
      label: 'Sender',
      render: (row: Mail) => (
        <span className={`${row.isRead ? 'font-normal' : 'font-semibold'} text-gtext`}>{row.sender || row.receiverEmail || ''}</span>
      ),
    },
    {
      id: 'subject',
      label: 'Subject',
      render: (row: Mail) => (
        <div className="max-w-[45vw] truncate text-sm">
          <span className={`${row.isRead ? 'font-normal' : 'font-semibold'} text-gtext`}>{row.subject || '(No Subject)'}</span>
          {row.body && (
            <span className="text-gsubtext font-normal">
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
      align: 'right' as const,
      render: (row: Mail) => {
        const d = new Date(row.date);
        return (
          <span className="text-sm text-gsubtext">
            {d.getDate()} {d.toLocaleString('default', { month: 'short' })}
          </span>
        );
      },
    },
  ];

  return (
    <EmailPageLayout>
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
              <NoMails message={EMPTY_TABS[type]} type={type} />
            ) : (
              <Table
                columns={columns}
                rows={emails}
                keyExtractor={(row) => row._id}
                getRowSx={(row) => ({
                  backgroundColor: row.isRead ? '#ffffff' : '#eaf1fb',
                })}
                onRowClick={async (row) => {
                  if (!row.isRead) {
                    try {
                      await httpClient.put('/read', { id: row._id, value: true });
                    } catch (error) {
                      console.error('Error marking email as read:', error);
                    }
                  }
                  navigate('/emails/view', { state: { email: { ...row, isRead: true }, type } });
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
