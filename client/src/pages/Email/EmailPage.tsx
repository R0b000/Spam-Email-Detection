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
}

const EmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [starredSet, setStarredSet] = useState<Set<string>>(new Set());

  const { type = '' } = useParams();
  const { sidebarWidth } = useOutletContext<OutletContext>();
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
  }, [type, refresh, user?.email]);

  useEffect(() => {
    setSelectedEmails([]);
  }, [type]);

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
        <span className="font-semibold text-gtext">{row.sender || row.receiverEmail || ''}</span>
      ),
    },
    {
      id: 'subject',
      label: 'Subject',
      render: (row: Mail) => (
        <span>
          <span className="font-semibold text-gtext">{row.subject}</span>
          {row.subject && row.body && <span className="text-gsubtext"> - </span>}
          {row.body && <span className="text-gsubtext">{row.body}</span>}
        </span>
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
      <Box className="transition-all" style={{ width: `calc(100% - ${sidebarWidth}px)`, marginLeft: sidebarWidth }}>
        <Box className="sticky top-[64px] z-[10] flex items-center gap-[4px] border-b border-[#dadce0] bg-white px-4 py-2">
          <Checkbox
            size="small"
            checked={allSelected}
            onChange={(e) => selectAll(e.target.checked)}
            indeterminate={someSelected}
          />
          <IconButton onClick={() => setRefresh((prev) => !prev)} className="text-[#5f6368]">
            <RefreshOutlined />
          </IconButton>
          <IconButton onClick={deleteSelected} disabled={selectedEmails.length === 0} className="text-[#5f6368]">
            <DeleteOutline />
          </IconButton>
          {selectedEmails.length > 0 && (
            <Typography variant="body2" className="ml-2 text-gsubtext">
              {selectedEmails.length} selected
            </Typography>
          )}
          <Box className="ml-auto flex">
            <IconButton className="text-[#5f6368]">
              <MoreVertOutlined />
            </IconButton>
          </Box>
        </Box>

        <Box className="p-[4px_0_24px]">
          {emails.length === 0 ? (
            <NoMails message={EMPTY_TABS[type]} type={type} />
          ) : (
            <Table
              columns={columns}
              rows={emails}
              keyExtractor={(row) => row._id}
              onRowClick={(row) => navigate('/emails/view', { state: { email: row, type } })}
            />
          )}
        </Box>
      </Box>
    </EmailPageLayout>
  );
};

export default EmailPage;
