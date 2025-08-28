import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { H3, H6, Paragraph } from "@/components/typography";
import { FlexBetween, FlexBox, FlexRowAlign } from "@/components/flexbox";
import { Chip, Tooltip, Divider } from "@mui/material";
import { format } from 'date-fns';

export default function CampaignCard({ item }) {
  console.log("item", item);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getActiveStatusColor = (isActive) => {
    return isActive ? "success" : "error";
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      return format(new Date(`2000-01-01T${timeString}`), 'hh:mm a');
    } catch {
      return timeString;
    }
  };

  return (
    <Card className="p-3" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Status Chips */}
      <FlexBetween mb={2}  direction="row" spacing={1} style={{textTransform:"capitalize"}}>
          <Chip
            label={item?.approvalStatus || "pending"}
            color={getStatusColor(item?.approvalStatus)}
            size="small"
            variant="outlined"
          />
          <Chip
            label={item?.isActive ? "Active" : "Inactive"}
            color={getActiveStatusColor(item?.isActive)}
            size="small"
          />
    
      </FlexBetween>

      {/* Banner Image */}
      <Box
        sx={{
          width: "100%",
          height: "140px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "grey.100",
          mb: 2,
        }}
      >
        <img
          src={item?.banner}
          alt="Event banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      {/* Event Title */}
      <H6 fontSize={16} mb={1} sx={{ 
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontWeight: 600
      }}
       style={{textTransform:"capitalize"}}>
        {item?.title || "Untitled Event"}
      </H6>

      {/* Event Details */}
      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">Date:</Paragraph>
          <Paragraph fontSize={12} fontWeight={500}>
            {formatDate(item?.date)}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">Time:</Paragraph>
          <Paragraph fontSize={12} fontWeight={500}>
            {formatTime(item?.startTime)} - {formatTime(item?.endTime)}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">Price:</Paragraph>
          <Paragraph fontSize={12} fontWeight={500} color="primary.main">
            ₹{parseFloat(item?.price || 0).toLocaleString()}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">Participants:</Paragraph>
          <Chip
            label={item?.participationsCountFormatted || "0"}
            color="info"
            size="small"
            variant="outlined"
          />
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">Location:</Paragraph>
          <Tooltip title={item?.location?.address || "N/A"}>
            <Paragraph 
              fontSize={12} 
              fontWeight={500}
              sx={{ 
                maxWidth: '110px',
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
               style={{textTransform:"capitalize"}}
            >
              {item?.location?.address || "N/A"}
            </Paragraph>
          </Tooltip>
        </FlexBetween>

        <Divider sx={{ my: 1 }} />

        {/* Additional Info */}
        <FlexBetween>
          <Paragraph fontSize={11} color="text.secondary">Slots:</Paragraph>
          <Paragraph fontSize={11} fontWeight={500}>
            {item?.slots?.length || 0}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={11} color="text.secondary">Add-ons:</Paragraph>
          <Paragraph fontSize={11} fontWeight={500}>
            {item?.addOns?.length || 0}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={11} color="text.secondary">Coupons:</Paragraph>
          <Paragraph fontSize={11} fontWeight={500}>
            {item?.coupons?.length || 0}
          </Paragraph>
        </FlexBetween>
      </Stack>

      {/* Footer */}
      <FlexBetween mt={2} pt={1} sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Paragraph fontSize={10} color="text.secondary">
          Created: {formatDate(item?.createdAt)}
        </Paragraph>
        <Paragraph fontSize={10} color="text.secondary">
          Max Tickets: {item?.maxTicketsPerUser || 1}
        </Paragraph>
      </FlexBetween>
    </Card>
  );
}