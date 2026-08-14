import { Box, Typography, styled } from '@mui/material';
import { MailOutlineOutlined, StarBorder, SendOutlined, DeleteSweepOutlined, DraftsOutlined, ReportGmailerrorred } from '@mui/icons-material';
import type { EmptyTab } from '../../config/constant';

const Component = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 80,
  width: '100%',
  textAlign: 'center',
});

const IconCircle = styled(Box)({
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: '#e8eaed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,
});

const Heading = styled(Typography)({
  fontSize: 22,
  fontWeight: 400,
  color: '#202124',
  marginBottom: 8,
});

const SubHeading = styled(Typography)({
  fontSize: 14,
  color: '#5f6368',
  maxWidth: 500,
  lineHeight: 1.5,
});

/** Map the folder type to a Gmail-style empty-state icon. */
const emptyIcons: Record<string, React.ReactNode> = {
  inbox: <MailOutlineOutlined style={{ fontSize: 60, color: '#5f6368' }} />,
  starred: <StarBorder style={{ fontSize: 60, color: '#5f6368' }} />,
  sent: <SendOutlined style={{ fontSize: 60, color: '#5f6368' }} />,
  draft: <DraftsOutlined style={{ fontSize: 60, color: '#5f6368' }} />,
  bin: <DeleteSweepOutlined style={{ fontSize: 60, color: '#5f6368' }} />,
  allmail: <MailOutlineOutlined style={{ fontSize: 60, color: '#5f6368' }} />,
  spam: <ReportGmailerrorred style={{ fontSize: 60, color: '#5f6368' }} />,
};

interface NoMailsProps {
  message?: EmptyTab;
  type?: string;
}

const NoMails = ({ message, type }: NoMailsProps) => {
  if (!message || !message.heading) {
    return (
      <Component>
        <IconCircle>
          {type ? emptyIcons[type] : <MailOutlineOutlined style={{ fontSize: 60, color: '#5f6368' }} />}
        </IconCircle>
        <Heading>Nothing here</Heading>
        <SubHeading>There are no messages to show.</SubHeading>
      </Component>
    );
  }

  return (
    <Component>
      {type && (
        <IconCircle>
          {emptyIcons[type]}
        </IconCircle>
      )}
      <Heading>{message.heading}</Heading>
      {message.subHeading && <SubHeading>{message.subHeading}</SubHeading>}
    </Component>
  );
};

export default NoMails;