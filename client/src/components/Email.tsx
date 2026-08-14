import { Box, Checkbox } from '@mui/material';
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useApi from '../Helper/useApi';
import { API_URLS } from '../Manager/Service/api.urls';
import { routes } from '../Router/routes';
import type { Mail } from '../types';

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
    <Box
      className="group flex items-center min-h-[40px] px-[0_10px] cursor-pointer bg-white border-b border-[#e8eaed] box-border hover:shadow-[inset_1px_0_0_#dadce0,_inset_-1px_0_0_#dadce0,_0_1px_2px_rgba(60,64,67,0.3),_0_1px_3px_1px_rgba(60,64,67,0.15)] hover:z-[2]"
      onClick={handleEmailClick}
    >
      <Box className="row-actions flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Checkbox
          size="small"
          checked={isSelected}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          className="p-1 mr-1 [&.Mui-checked]:opacity-100"
        />
        <div
          className="flex items-center justify-center cursor-pointer text-[#5f6368] [&_.MuiSvgIcon-root]:text-[20px]"
          onClick={toggleStarredEmail}
        >
          {starred ? <Star style={{ color: '#f7cb4d' }} /> : <StarBorder />}
        </div>
      </Box>

      <Box
        className="min-w-[180px] max-w-[230px] w-[22%] text-[14px] font-bold text-gtext whitespace-nowrap overflow-hidden text-ellipsis pr-[8px]"
        title={receiverEmail || ''}
      >
        {receiverEmail || ''}
      </Box>

      <Box className="flex-1 flex items-center whitespace-nowrap overflow-hidden text-[14px] text-gsubtext">
        {subject && <span className="font-bold text-gtext whitespace-nowrap">{subject}</span>}
        {subject && body ? <span>&nbsp;-&nbsp;</span> : null}
        {body && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{body}</span>}
      </Box>

      <Box className="text-[12px] text-gsubtext ml-auto pl-[12px] whitespace-nowrap">
        {day} {month}
      </Box>
    </Box>
  );
};

export default Email;