import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { styled, alpha, useTheme } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import { FlexBetween, FlexRowAlign } from "@/components/flexbox";

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
      <FlexBetween style={{textTransform:"capitalize"}}>
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
      </FlexBetween>

      {/* Title */}
      <Box>
        <H6
          fontSize={16}
          mb={1}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          style={{textTransform:"capitalize"}}
        >
          {item?.title || "Untitled Challenge"}
        </H6>

        {/* Start & End Dates side by side */}
        <FlexBetween>
          <FlexRowAlign gap={0.5}>
            <CalendarMonthIcon fontSize="small" color="action" />
            <Paragraph color="text.secondary" fontSize={12}>
              {item?.startDate || "N/A"}
            </Paragraph>
          </FlexRowAlign>
          <FlexRowAlign gap={0.5}>
            <CalendarMonthIcon fontSize="small" color="action" />
            <Paragraph color="text.secondary" fontSize={12}>
              {item?.endDate || "N/A"}
            </Paragraph>
          </FlexRowAlign>
        </FlexBetween>
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
            Status:
          </Paragraph>
          <Chip
            label={item?.isActive ? "Active" : "Inactive"}
            size="small"
            color={item?.isActive ? "success" : "default"}
          />
        </InfoRow>

        {/* <InfoRow>
          <Paragraph fontSize={12} color="text.secondary">
            Organizer:
          </Paragraph>
          <FlexRowAlign gap={1}>
            {item?.organizer?.companyLogo && (
              <Avatar
                src={item.organizer.companyLogo}
                alt="logo"
                sx={{ width: 20, height: 20 }}
              />
            )}
            <Paragraph fontSize={12} fontWeight={600}>
              {item?.organizer?.name || "N/A"}
            </Paragraph>
          </FlexRowAlign>
        </InfoRow> */}

        <InfoRow>
          <Paragraph fontSize={12} color="text.secondary">
            Participants:
          </Paragraph>
          <FlexRowAlign gap={0.5}>
            <PeopleAltIcon fontSize="small" color="action" />
            <Paragraph fontSize={12} fontWeight={600}>
              {item?.participationsCountFormatted || "0"}
            </Paragraph>
          </FlexRowAlign>
        </InfoRow>
      </Stack>

      {/* Footer */}
      {/* <FlexBetween mt="auto">
        <Paragraph fontSize={11} color="text.secondary">
          {item?.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A"}
        </Paragraph>
      </FlexBetween> */}
    </StyledCard>
  );
}
