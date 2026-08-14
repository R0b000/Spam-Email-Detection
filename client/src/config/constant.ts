/** Profile-image placeholder used in ViewEmail. */
export const emptyProfilePic =
  'https://ssl.gstatic.com/ui/v1/icons/mail/profile_mask2.png';

/** Headings + subheadings shown when a folder is empty. */
export interface EmptyTab {
  heading: string;
  subHeading: string;
}

export const EMPTY_TABS: Record<string, EmptyTab> = {
  inbox: {
    heading: 'Your inbox is empty',
    subHeading: "Mails that don't appear in other tabs will be shown here.",
  },
  drafts: {
    heading: "You don't have any saved drafts.",
    subHeading: "Saving a draft allows you to keep a message you aren't ready to send yet.",
  },
  starred: {
    heading: 'No starred messages',
    subHeading:
      "Stars let you give messages a special status to make them easier to find. To star a message, click on the star outline beside any message or conversation.",
  },
  sent: {
    heading: 'No sent messages!',
    subHeading: 'Send one now!',
  },
  bin: {
    heading: 'No conversations in Bin.',
    subHeading: '',
  },
  spam: {
    heading: 'No conversations in Spam.',
    subHeading: '',
  },
};