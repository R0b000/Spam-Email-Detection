import { Typography } from '@mui/material';
import { MailOutlineOutlined, StarBorder, SendOutlined, DeleteSweepOutlined, DraftsOutlined, ReportGmailerrorred } from '@mui/icons-material';
import type { EmptyTab } from '../../config/constant';

interface NoMailsProps {
  message?: EmptyTab;
  type?: string;
}

/** Map the folder type to a Gmail-style empty-state icon. */
const emptyIcons: Record<string, React.ReactNode> = {
  inbox: <MailOutlineOutlined className="text-[60px] text-gsubtext" />,
  starred: <StarBorder className="text-[60px] text-gsubtext" />,
  sent: <SendOutlined className="text-[60px] text-gsubtext" />,
  draft: <DraftsOutlined className="text-[60px] text-gsubtext" />,
  bin: <DeleteSweepOutlined className="text-[60px] text-gsubtext" />,
  allmail: <MailOutlineOutlined className="text-[60px] text-gsubtext" />,
  spam: <ReportGmailerrorred className="text-[60px] text-gsubtext" />,
};

const NoMails = ({ message, type }: NoMailsProps) => {
  if (!message || !message.heading) {
    return (
      <div className="flex flex-col items-center justify-center w-full pt-[80px] text-center">
        <div className="w-[120px] h-[120px] rounded-[50%] bg-[#e8eaed] flex items-center justify-center mb-[24px]">
          {type ? emptyIcons[type] : <MailOutlineOutlined className="text-[60px] text-gsubtext" />}
        </div>
        <Typography className="m-0 text-[22px] font-normal text-gtext mb-[8px]">Nothing here</Typography>
        <Typography className="m-0 text-[14px] text-gsubtext">There are no messages to show.</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full pt-[80px] text-center">
      {type && (
        <div className="w-[120px] h-[120px] rounded-[50%] bg-[#e8eaed] flex items-center justify-center mb-[24px]">
          {emptyIcons[type]}
        </div>
      )}
      <Typography className="m-0 text-[22px] font-normal text-gtext mb-[8px]">{message.heading}</Typography>
      {message.subHeading && <Typography className="m-0 text-[14px] text-gsubtext max-w-[500px] leading-[1.5]">{message.subHeading}</Typography>}
    </div>
  );
};

export default NoMails;