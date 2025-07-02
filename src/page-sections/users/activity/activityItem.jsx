import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function ActivityItem({ activity }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{activity.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {activity.description}
        </Typography>
        {activity.media?.length > 0 && (
          <Avatar
            src={activity.media[0]}
            alt="activity"
            variant="rounded"
            sx={{ width: 56, height: 56, mt: 1 }}
          />
        )}
      </TimelineContent>
    </TimelineItem>
  );
}
