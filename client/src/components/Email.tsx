import { Box, Checkbox, styled } from '@mui/material';
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useApi from '../Helper/useApi';
import { API_URLS } from '../Manager/Service/api.urls';
import { routes } from '../Router/routes';
import type { Mail } from '../types';

const Wrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
  padding: '0 10px',
  cursor: 'pointer',
  background: '#ffffff',
  borderBottom: '1px solid #e8eaed',
  boxSizing: 'border-box',
  '&:hover': {
    boxShadow: 'inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
    zIndex: 2,
  },
  '&:hover .row-actions': {
    opacity: 1,
  },
  '& .row-actions': {
    opacity: 0,
    transition: 'opacity 0.2s',
  },
});

const ActionCheckbox = styled(Checkbox)({
  padding: 4,
  marginRight: 4,
  '&.Mui-checked': {
    opacity: 1,
  },
});

const ActionStar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  color: '#5f6368',
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
  },
});

const Sender = styled(Box)({
  minWidth: '180px',
  maxWidth: '230px',
  width: '22%',
  fontSize: '14px',
  fontWeight: 700,
  color: '#202124',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingRight: '8px',
});

const Content = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '14px',
  color: '#5f6368',
});

const SubjectText = styled('span')({
  fontWeight: 700,
  color: '#202124',
  whiteSpace: 'nowrap',
});

const BodyPreview = styled('span')({
  color: '#5f6368',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const DateText = styled(Box)({
  fontSize: '12px',
  color: '#5f6368',
  marginLeft: 'auto',
  paddingLeft: '12px',
  whiteSpace: 'nowrap',
});

interface EmailProps {
  email: Mail;
  starred?: boolean;
  selectedEmails: string[];
  setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>;
  refreshList?: () => void;
}

const Email = ({ email, starred, selectedEmails, setSelectedEmails, refreshList }: EmailProps) => {
  const { _id, receiverEmail, subject, body, date } = email;
  const toggleStarredEmailService = useApi(API_URLS.toggleStarredMails);
  const navigate = useNavigate();
  const isSelected = selectedEmails.includes(_id);

  const toggleStarredEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleStarredEmailService.call({ id: _id, value: !starred });
      refreshList?.();
    } catch (error) {
      console.error('Error toggling starred email:', error);
    }
  };

  const handleEmailClick = () => {
    navigate(routes.view.path, { state: { email } });
  };

  const handleChange = () => {
    if (isSelected) {
      setSelectedEmails((prev) => prev.filter((id) => id !== _id));
    } else {
      setSelectedEmails((prev) => [...prev, _id]);
    }
  };

  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString('default', { month: 'short' });

  return (
    <Wrapper onClick={handleEmailClick}>
      <Box className="row-actions" style={{ display: 'flex', alignItems: 'center' }}>
        <ActionCheckbox size="small" checked={isSelected} onChange={handleChange} onClick={(e) => e.stopPropagation()} />
        <ActionStar onClick={toggleStarredEmail} style={{ cursor: 'pointer' }}>
          {starred ? <Star style={{ color: '#f7cb4d' }} /> : <StarBorder />}
        </ActionStar>
      </Box>

      <Sender title={receiverEmail || ''}>{receiverEmail || ''}</Sender>

      <Content>
        {subject && <SubjectText>{subject}</SubjectText>}
        {subject && body ? <span>&nbsp;-&nbsp;</span> : null}
        {body && <BodyPreview>{body}</BodyPreview>}
      </Content>

      <DateText>
        {day} {month}
      </DateText>
    </Wrapper>
  );
};

export default Email;