import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar'; // CUSTOM COMPONENTS

import ListItem from './ListItem';
import ItemLayout from '../ItemLayout';
import { Paragraph, Small } from '@/components/typography'; // CUSTOM ICON COMPONENT

import Chat from '@/icons/Chat';
export default function ChatItem({activity}) {
  function formatAddedAt(isoDate) {
  const date = new Date(isoDate);
  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `Added at ${time}`;
}

  return <ItemLayout Icon={<Chat sx={{
    fontSize: 16
  }} />}>
      <Paragraph fontWeight={600} mb={0.5}>
        {activity?.name ?? "N/A"}
      </Paragraph>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Small color="text.secondary">{formatAddedAt(activity.createdAt)}</Small>   
        <Avatar src={activity?.media} sx={{
        width: 17,
        height: 17
      }} />
      </Stack>

      <ListItem activity={activity} title={activity?.description ?? "N/A"} status="In Progress" />
      {/* <ListItem activity={activity} title="Project Delivery" status="Complete" /> */}
    </ItemLayout>;
}