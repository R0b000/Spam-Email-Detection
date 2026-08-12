import { ListItem, Checkbox, Box, Typography, styled } from "@mui/material";
import { StarBorder, Star, HorizontalRuleOutlined } from '@mui/icons-material';
import useApi from '../hooks/useApi';
import { API_URLS } from "../services/api.urls";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes"; // Assuming you have a routes object

const Wrapper = styled(ListItem)({
    position: 'relative', // Add relative positioning
    padding: '0 0 0 10px',
    background: '#f2f6fc', // Change background color to a light grey
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.01s', // Add transition for smoother effect
    border: 'none', // Add border
    borderRadius: 'none', // Add border radius for rounded corners
    boxShadow: '0 2px 4px rgba(0.1, 0.1, 0.1, 0.1)', // Add a subtle box shadow
    '&:hover': {
        backgroundColor: '#e3e8f5', // Change background color on hover
        transform: 'scale(1.01)', // Scale up on hover
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
    textAlign: 'justify', // Add textAlign property
});

const ContentWrapper = styled(Box)({
    flex: '2',
    minWidth: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'justify', // Add textAlign property
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

const Email = ({ email, starred, setStarredEmail, selectedEmails, setSelectedEmails }) => {
    const { _id, receiverEmail, subject, body, date } = email;

    const toggleStarredEmailService = useApi(API_URLS.toggleStarredMails);
    const navigate = useNavigate();

    const toggleStarredEmail = async () => {
      try {
          const response = await toggleStarredEmailService.call({ id: _id, value: !starred });
          setStarredEmail(prevState => !prevState);
          console.log('Starred status updated successfully');
          window.location.reload(); // Reload the page upon successful toggle
      } catch (error) {
          console.error('Error toggling starred email:', error);
      }
    };
  
    const handleEmailClick = () => {
        // Navigate to the view page with email details
        navigate(routes.view.path, { state: { email } });
    };

    const handleChange = () => {
        if (selectedEmails.includes(_id)) {
            setSelectedEmails(prevState => prevState.filter(id => id !== _id));
        } else {
            setSelectedEmails(prevState => [...prevState, _id]);
        }
    };

    const formattedDate = new Date(date);
    const dayOfMonth = formattedDate.getDate();
    const monthName = formattedDate.toLocaleString('default', { month: 'long' });

    return (
        <Wrapper>
            <Checkbox
                size="small"
                checked={selectedEmails.includes(_id)}
                onChange={handleChange}
            />
            {
                starred ?
                    <Star fontSize="small" style={{ marginRight: 10 }} onClick={toggleStarredEmail} />
                    :
                    <StarBorder fontSize="small" style={{ marginRight: 10 }} onClick={toggleStarredEmail} />
            }
            <BoxContainer onClick={handleEmailClick}>
                {/* Email */}
                <ItemWrapper>
                    <div>
                        <Label>{receiverEmail ? receiverEmail : ''}</Label>
                    </div>
                </ItemWrapper>

                {/* Content */}
                <ContentWrapper>
                    <div>
                        {subject && <Label>{subject}</Label>}
                        {(subject && body) && '- '}
                        {body}
                    </div>
                </ContentWrapper>

                {/* Date */}
                <DateWrapper>
                    <div>
                        <Label>{dayOfMonth}&nbsp;{monthName}</Label>
                    </div>
                </DateWrapper>
            </BoxContainer>
        </Wrapper>
    );
};

export default Email;
