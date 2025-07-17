// Updated Campaigns Component
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Divider } from '@mui/material';

import CampaignCard from './CampaignCard';
import EventSummaryCard from './EventSummaryCard'; // New summary component

export default function Campaigns({ singleOrganizer }) {
  const theme = useTheme();

  if (!singleOrganizer) {
    return (
      <Box py={3} mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          Events data not available
        </Typography>
      </Box>
    );
  }

  const eventParticipationData = singleOrganizer?.events || [];

  if (!eventParticipationData.length) {
    return (
      <Box mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          No Events data available
        </Typography>
      </Box>
    );
  }

  // Calculate summary statistics
  const totalEvents = eventParticipationData.length;
  const activeEvents = eventParticipationData.filter(event => event.isActive).length;
  const pendingApproval = eventParticipationData.filter(event => event.approvalStatus === 'pending').length;
  const totalParticipants = eventParticipationData.reduce((sum, event) => sum + (event.participationsCount || 0), 0);
  const totalRevenue = eventParticipationData.reduce((sum, event) => sum + parseFloat(event.price || 0), 0);

  return (
    <Box py={3}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <EventSummaryCard 
            title="Total Events" 
            value={totalEvents} 
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <EventSummaryCard 
            title="Active Events" 
            value={activeEvents} 
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <EventSummaryCard 
            title="Pending Approval" 
            value={pendingApproval} 
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <EventSummaryCard 
            title="Total Participants" 
            value={totalParticipants} 
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <EventSummaryCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            color={theme.palette.primary.main}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Event Cards */}
      <Grid container spacing={3}>
        {eventParticipationData.map(item => (
          <Grid key={item.id} size={{ md: 4, sm: 6, xs: 12 }}>
            <CampaignCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}