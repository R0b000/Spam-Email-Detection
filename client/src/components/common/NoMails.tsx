import { Box, Typography, styled, Divider } from '@mui/material';
import type { EmptyTab } from '../../constants/constant';

const Component = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  marginTop: 50,
  opacity: 0.8,
});

const StyledDivider = styled(Divider)({
  width: '100%',
  marginTop: 10,
});

interface NoMailsProps {
  message?: EmptyTab;
}

const NoMails = ({ message }: NoMailsProps) => {
  if (!message || !message.heading || !message.subHeading) {
    return null; // Render nothing if message is undefined or missing required properties
  }

  return (
    <Component>
      <Typography>{message.heading}</Typography>
      <Typography>{message.subHeading}</Typography>
      <StyledDivider />
    </Component>
  );
};

export default NoMails;