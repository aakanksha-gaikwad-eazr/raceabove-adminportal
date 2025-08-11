import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { alpha } from "@mui/material/styles"; // MUI ICON COMPONENT

import MoreHoriz from "@mui/icons-material/MoreHoriz"; // CUSTOM COMPONENTS

import { H3, H6, Paragraph } from "@/components/typography";
import { FlexBetween, FlexBox, FlexRowAlign } from "@/components/flexbox"; // CUSTOM UTILS METHOD

import { currency } from "@/utils/currency"; // ====================================================================
import { Chip, Icon } from "@mui/material";

// ====================================================================
export default function CampaignCard({ item, color, Icon }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "terminated":
        return "error";
      default:
        return "default";
    }
  };
  console.log("items", item);
  return (
    <Card className="p-3">
      <FlexBetween>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <div
            style={{
              width: "100%",
              maxHeight: "140px",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <img
              src={item?.slot?.event?.banner}
              alt="banner"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </Stack>
      </FlexBetween>

      <FlexBetween flexDirection="column" gap={1} my={2}>
        <H6 fontSize={20}> {item?.slot?.event?.title}</H6>

        <FlexBox alignItems="center" gap={1}>
          <Paragraph fontWeight={600} color="primary.500">
            {item?.slot?.event?.location?.address}
          </Paragraph>

          {item?.participationStatus && (
            <Chip
              label={
                item?.participationStatus.charAt(0).toUpperCase() +
                item?.participationStatus.slice(1)
              }
              color={getStatusColor(item?.participationStatus)}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </FlexBox>
      </FlexBetween>
    </Card>
  );
}
