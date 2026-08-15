import {
  DeleteOutlined,
  DraftsOutlined,
  InboxOutlined,
  MailOutlined,
  ReportGmailerrorred,
  SendOutlined,
  StarBorder,
  SvgIconComponent,
} from '@mui/icons-material';

export interface SidebarItem {
  name: string;
  title: string;
  icon: SvgIconComponent;
}

export const SIDEBAR_DATA: SidebarItem[] = [
  {
    name: 'inbox',
    title: 'Inbox',
    icon: InboxOutlined,
  },
  {
    name: 'starred',
    title: 'Starred',
    icon: StarBorder,
  },
  {
    name: 'sent',
    title: 'Sent',
    icon: SendOutlined,
  },
  {
    name: 'draft',
    title: 'Draft',
    icon: DraftsOutlined,
  },
  {
    name: 'bin',
    title: 'Bin',
    icon: DeleteOutlined,
  },
  {
    name: 'allmail',
    title: 'All Mail',
    icon: MailOutlined,
  },
  {
    name: 'spam',
    title: 'Spam',
    icon: ReportGmailerrorred,
  },
];