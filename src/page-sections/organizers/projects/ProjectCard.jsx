import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import LinearProgress from "@mui/material/LinearProgress";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled, alpha, useTheme } from "@mui/material/styles";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import { FlexBetween, FlexRowAlign } from "@/components/flexbox"; // STYLED COMPONENTS

const IconWrapper = styled(FlexRowAlign)({
  width: 35,
  height: 30,
  borderRadius: "4px",
});

const StyledAvatarGroup = styled(AvatarGroup, {
  shouldForwardProp: (prop) => prop !== "type",
})(({ type }) => ({
  "& .MuiAvatar-root": {
    width: 30,
    height: 30,
  },
  "& .MuiAvatar-colorDefault": {
    color: type,
    fontWeight: 500,
    backgroundColor: alpha(type, 0.1),
  },
}));

const InfoRow = styled(FlexBetween)(({ theme }) => ({
  padding: "4px 0",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

// =======================================================================
export default function ProjectCard({ item }) {
  const theme = useTheme();
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

  const getChallengeTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "daily":
        return "primary";
      case "weekly":
        return "secondary";
      case "monthly":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <StyledCard>
      {/* Header Section with Badge and Status */}
      <FlexBetween mb={2}>
        <Box
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "grey.100",
          }}
        >
          <img
            src={item?.badge || "/default-badge.png"}
            alt="badge"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        <Stack direction="column" spacing={1} alignItems="flex-end">
          <Chip
            label={item?.approvalStatus || "Pending"}
            size="small"
            color={getStatusColor(item?.approvalStatus)}
            variant="outlined"
          />
          <Chip
            label={item?.challengeType || "N/A"}
            size="small"
            color={getChallengeTypeColor(item?.challengeType)}
          />
        </Stack>
      </FlexBetween>

      {/* Title and Start Date */}
      <Box>
        <H6 fontSize={16} mb={1} sx={{ 
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {item?.title || "Untitled Challenge"}
        </H6>
        <Paragraph color="text.secondary" fontSize={12}>
          Start Date: {item?.startDate || "N/A"}
        </Paragraph>
      </Box>

      {/* Banner Image */}
      <Box
        sx={{
          width: "100%",
          height: "120px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "grey.100",
        }}
      >
        <img
          src={item?.banner || "/default-banner.png"}
          alt="banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      {/* Challenge Details */}
      <Stack spacing={1}>
        <InfoRow>
          <Paragraph fontSize={12} color="text.secondary">
            Daily Target:
          </Paragraph>
          <Paragraph fontSize={12} fontWeight={600}>
            {item?.dailyTargetValue || "N/A"}
          </Paragraph>
        </InfoRow>

        <InfoRow>
          <Paragraph fontSize={12} color="text.secondary">
            Max Reward Coins:
          </Paragraph>
          <Paragraph fontSize={12} fontWeight={600} color="primary.main">
            {item?.maxRewardCoins || "0"}
          </Paragraph>
        </InfoRow>

        <InfoRow>
          <Paragraph fontSize={12} color="text.secondary">
            Min Active Days:
          </Paragraph>
          <Paragraph fontSize={12} fontWeight={600}>
            {item?.minActiveDays || "N/A"}
          </Paragraph>
        </InfoRow>

        <InfoRow>
          <Paragraph fontSize={12} color="text.secondary">
            Status:
          </Paragraph>
          <Switch
            checked={item?.isActive || false}
            size="small"
            color="primary"
            disabled // Make it read-only for display purposes
          />
        </InfoRow>
      </Stack>

      {/* Footer with additional info */}
      <FlexBetween mt="auto">
        <Paragraph fontSize={11} color="text.secondary">
          ID: {item?.id || "N/A"}
        </Paragraph>
        <Paragraph fontSize={11} color="text.secondary">
          {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
        </Paragraph>
      </FlexBetween>
    </StyledCard>
  );
}