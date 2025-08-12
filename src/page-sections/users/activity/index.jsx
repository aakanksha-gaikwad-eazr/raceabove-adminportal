import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Scrollbar from '@/components/scrollbar';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { H6, Span } from '@/components/typography';

export default function Activity({ allDataOfSingleUser }) {
  const activities = allDataOfSingleUser?.activities || [];
  const targets = allDataOfSingleUser?.targets || [];

  return (
    <Box py={3}>
      {/* Activities Card */}
      <Card>
        <FlexBetween flexWrap="wrap" p={3}>
          <H6 fontSize={16}>
            My Activities{' '}
            <Span fontSize={14} fontWeight={400} color="text.secondary">
              ({activities.length} activities)
            </Span>
          </H6>
        </FlexBetween>
        <Divider />
        <Box my={2}>
          <Scrollbar autoHide={false}>
            {activities.map((activity) => (
              <Typography key={activity.id}>{activity.name}</Typography>
            ))}
          </Scrollbar>
        </Box>
      </Card>

      {/* Targets Card */}
      {targets.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <FlexBetween flexWrap="wrap" p={3}>
            <H6 fontSize={16}>
              My Targets{' '}
              <Span fontSize={14} fontWeight={400} color="text.secondary">
                ({targets.length} targets)
              </Span>
            </H6>
          </FlexBetween>
          <Divider />
          <Box my={2} px={3}>
            {targets.map((target) => (
              <Box
                key={target.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <img
                  src={target.banner}
                  alt={target.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <Typography variant="body1" fontWeight="500">
                  {target.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      )}
    </Box>
  );
}
