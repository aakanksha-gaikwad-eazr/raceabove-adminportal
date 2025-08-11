import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles'; // CUSTOM ICON COMPONENT
import Typography from '@mui/material/Typography'; // CUSTOM ICON COMPONENT

import CampaignCard from './CampaignCard'; // CUSTOM ICON COMPONENTS

import Reddit from '@/icons/social/Reddit';
import Twitch from '@/icons/social/Twitch';
import Twitter from '@/icons/social/Twitter';
import Youtube from '@/icons/social/Youtube';
import PinterestCircle from '@/icons/social/PinterestCircle';

export default function Campaigns({allDataOfSingleUser}) {
  const theme = useTheme(); // CUSTOM DUMMY DATA

  if (!allDataOfSingleUser) {
    return (
      <Box py={3} mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          User data not available
        </Typography>
      </Box>
    );
  }

  const CAMPAIGN_LIST = [{
    id: 1,
    icon: Twitch,
    amount: 5000,
    impression: -40.5,
    progressValue: 40,
    title: 'Twitch Post',
    color: theme.palette.primary.main
  }, {
    id: 2,
    amount: 2350,
    impression: 26.5,
    progressValue: 40,
    icon: PinterestCircle,
    title: 'Pinterest Posts',
    color: theme.palette.success.main
  }, {
    id: 3,
    icon: Twitter,
    amount: 1356,
    impression: 26.5,
    progressValue: 40,
    title: 'Twitter Followers',
    color: theme.palette.primary.main
  }, {
    id: 4,
    icon: Reddit,
    amount: 4000,
    impression: -40.5,
    progressValue: 40,
    title: 'Reddit Awards',
    color: theme.palette.error.main
  }, {
    id: 5,
    icon: Youtube,
    amount: 968,
    impression: -40.5,
    progressValue: 40,
    title: 'Youtube Subscribers',
    color: theme.palette.grey[500]
  }, {
    id: 6,
    icon: Twitch,
    amount: 3650,
    impression: -40.5,
    progressValue: 40,
    title: 'Twitch Post',
    color: theme.palette.primary[700]
  }, {
    id: 7,
    icon: Twitter,
    amount: 680,
    impression: 26.5,
    progressValue: 40,
    title: 'Twitter Followers',
    color: theme.palette.primary[500]
  }, {
    id: 8,
    icon: Reddit,
    amount: 1340,
    impression: -40.5,
    progressValue: 40,
    title: 'Reddit Awards',
    color: theme.palette.success.main
  }, {
    id: 9,
    amount: 4120,
    impression: 26.5,
    progressValue: 40,
    icon: PinterestCircle,
    title: 'Pinterest Posts',
    color: theme.palette.error.main
  }];

  const eventParticipationData = allDataOfSingleUser?.eventParticipations || []

  if (!eventParticipationData.length) {
    return (
      <Box mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          No Events Participation data available
        </Typography>
      </Box>
    );
  }

  return <Box py={3}>
      <Grid container spacing={3}>
        {eventParticipationData.map(item => <Grid key={item.id} size={{
        md: 4,
        sm: 6,
        xs: 12
      }}>
            <CampaignCard item={item} Icon={PinterestCircle} color={theme.palette.success.main} />
          </Grid>)}
      </Grid>
    </Box>;
}