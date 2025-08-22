import Card from '@mui/material/Card'; 
import Box from '@mui/material/Box';
import MoreButton from '@/components/more-button';
import { H6, Paragraph } from '@/components/typography';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { Avatar, Chip } from '@mui/material';

export default function Summery({ singleOrganizer }) {
  console.log("singleOrganizer", singleOrganizer);

  return (
    <Card className="p-3">
      <FlexBetween>
        <H6 fontSize={16}>Organizer Summary</H6>
        <MoreButton size="small" />
      </FlexBetween>

      <Box mt={2}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box>
            <Chip
              label={singleOrganizer?.isActive ? "Active" : "Inactive"}
              color={singleOrganizer?.isActive ? "success" : "error"}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Box mb={1}>
          <Paragraph color="text.secondary" fontWeight={600}>Email:</Paragraph>
          <Paragraph>{singleOrganizer?.email}</Paragraph>
        </Box>

        <Box mb={1}>
          <Paragraph color="text.secondary" fontWeight={600}>Phone:</Paragraph>
          <Paragraph>{singleOrganizer?.phoneNumber}</Paragraph>
        </Box>

        <Box mb={1}>
          <Paragraph color="text.secondary" fontWeight={600}>Commission:</Paragraph>
          <Paragraph>{singleOrganizer?.commission} %</Paragraph>
        </Box>

        <Box mb={1}>
          <Paragraph color="text.secondary" fontWeight={600}>Approval Status:</Paragraph>
          <Paragraph>{singleOrganizer?.approvalStatus}</Paragraph>
        </Box>

        <Box mb={1}>
          <Paragraph color="text.secondary" fontWeight={600}>Reviewed By:</Paragraph>
          <Paragraph>{singleOrganizer?.reviewedBy || "N/A"}</Paragraph>
        </Box>

        <Box>
          <Paragraph color="text.secondary" fontWeight={600}>Review Reason:</Paragraph>
          <Paragraph>{singleOrganizer?.reviewReason || "N/A"}</Paragraph>
        </Box>
      </Box>
    </Card>
  );
}
