import { ListItem, Checkbox, Box, Typography, styled } from '@mui/material';
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { API_URLS } from '../services/api.urls';
import { routes } from '../routes/routes';
import type { Mail } from '../types';

const Wrapper = styled(ListItem)({
  position: 'relative',
  padding: '0 0 0 10px',
  background: '#f2f6fc',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.01s',
  border: 'none',
  borderRadius: 'none',
  boxShadow: '0 2px 4px rgba(0.1, 0.1, 0.1, 0.1)',
  '&:hover': {
    backgroundColor: '#e3e8f5',
    transform: 'scale(1.01)',
  },
  '& > div': {
    display: 'flex',
    width: '100%',
  },
  '& > div > p': {
    fontSize: '11px',
  },
});

const BoxContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
});

const ItemWrapper = styled(Box)({
  flex: '1',
  minWidth: '25%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'justify',
});

const ContentWrapper = styled(Box)({
  flex: '2',
  minWidth: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'justify',
});

const DateWrapper = styled(Box)({
  flex: '1',
  minWidth: '25%',
  marginLeft: '60px',
  fontSize: '12px',
  color: '#5F6368',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const Label = styled(Typography)({
  fontWeight: 'bold',
});

interface EmailProps {
  email: Mail;
  starred?: boolean;
  setStarredEmail: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEmails: string[];
  setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

const Email = ({ email, starred, setStarredEmail, selectedEmails, setSelectedEmails }: EmailProps) => {
  const { _id, receiverEmail, subject, body, date } = email;

  const toggleStarredEmailService = useApi(API_URLS.toggleStarredMails);
  const navigate = useNavigate();

  const toggleStarredEmail = async () => {
    try {
      const response = await toggleStarredEmailService.call({ id: _id, value: !starred });
      setStarredEmail((prev) => !prev);
      console.log('Starred status updated successfully', response);
      window.location.reload(); // Reload the page upon successful toggle
    } catch (error) {
      console.error('Error toggling starred email:', error);
    }
  };

  const handleEmailClick = () => {
    navigate(routes.view.path, { state: { email } });
  };

  const handleChange = () => {
    if (selectedEmails.includes(_id)) {
      setSelectedEmails((prev) => prev.filter((id) => id !== _id));
    } else {
      setSelectedEmails((prev) => [...prev, _id]);
    }
  };

  const formattedDate = new Date(date);
  const dayOfMonth = formattedDate.getDate();
  const monthName = formattedDate.toLocaleString('default', { month: 'long' });

  return (
    <Wrapper>
      <Checkbox size="small" checked={selectedEmails.includes(_id)} onChange={handleChange} />
      {starred ? (
        <Star fontSize="small" style={{ marginRight: 10 }} onClick={toggleStarredEmail} />
      ) : (
        <StarBorder fontSize="small" style={{ marginRight: 10 }} onClick={toggleStarredEmail} />
      )}
      <BoxContainer onClick={handleEmailClick}>
        <ItemWrapper>
          <div>
            <Label>{receiverEmail ? receiverEmail : ''}</Label>
          </div>
        </ItemWrapper>

        <ContentWrapper>
          <div>
            {subject && <Label>{subject}</Label>}
            {subject && body ? '- ' : null}
            {body}
          </div>
        </ContentWrapper>

        <DateWrapper>
          <div>
            <Label>
              {dayOfMonth}&nbsp;{monthName}
            </Label>
          </div>
        </DateWrapper>
      </BoxContainer>
    </Wrapper>
  );
};

export default Email;