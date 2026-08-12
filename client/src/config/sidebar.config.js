import {DeleteOutlined, InsertDriveFileOutlined, MailOutlined, Photo, ReportGmailerrorred, SendOutlined, StarOutline} from '@mui/icons-material';


export const SIDEBAR_DATA = [
    {
        name: 'inbox',
        title: 'Inbox',
        icon: Photo
    },
    {
        name: 'starred',
        title: 'Starred',
        icon: StarOutline
    },
    {
        name: 'sent',
        title: 'Sent',
        icon: SendOutlined
    },
    {
        name: 'draft',
        title: 'Draft',
        icon: InsertDriveFileOutlined
    },
    {
        name: 'bin',
        title: 'Bin',
        icon: DeleteOutlined
    },
    {
        name: 'allmail',
        title: 'All Mail',
        icon: MailOutlined
    },

    {
        name: 'spam',
        title: 'Spam',
        icon: ReportGmailerrorred
    }
];