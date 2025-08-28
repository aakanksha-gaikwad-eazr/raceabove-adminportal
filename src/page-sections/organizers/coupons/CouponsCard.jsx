import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Chip, Divider } from "@mui/material";
import { format } from "date-fns";
import { H6, Paragraph } from "@/components/typography";
import { FlexBetween } from "@/components/flexbox";

export default function CouponsCard({ item }) {
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
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      className="p-3"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header with Approval Status only */}
      <FlexBetween style={{justifyContent:"end"}} mb={2} sx={{ textTransform: "capitalize" }}>
        <Chip
          label={item?.approvalStatus || "pending"}
          color={getStatusColor(item?.approvalStatus)}
          size="small"
          variant="outlined"
        />
      </FlexBetween>

      {/* Coupon Title */}
      <H6
        fontSize={16}
        mb={0.5}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {item?.title || "Untitled Coupon"}
      </H6>

      {/* Coupon Description */}
      <Paragraph
        fontSize={13}
        color="text.secondary"
        mb={1}
        sx={{ textTransform: "capitalize" }}
      >
        {item?.description || "No description"}
      </Paragraph>

      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">
            Code:
          </Paragraph>
          <Chip
            label={item?.code || "N/A"}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">
            Discount:
          </Paragraph>
          <Paragraph fontSize={12} fontWeight={500} color="primary.main">
            {item?.discountType === "flat"
              ? `₹${item?.discountValue}`
              : `${item?.discountValue}%`}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">
            Min Purchase:
          </Paragraph>
          <Paragraph fontSize={12} fontWeight={500}>
            ₹{parseFloat(item?.minimumPurchase || 0).toLocaleString()}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">
            Validity:
          </Paragraph>
          <Paragraph fontSize={12} fontWeight={500}>
            {formatDate(item?.startTimeStamp)} -{" "}
            {formatDate(item?.endTimeStamp)}
          </Paragraph>
        </FlexBetween>

        <Divider sx={{ my: 1 }} />

        <FlexBetween>
          <Paragraph fontSize={11} color="text.secondary">
            Usage:
          </Paragraph>
          <Paragraph fontSize={11} fontWeight={500}>
            {item?.usageCount || 0} / {item?.usageLimit}
          </Paragraph>
        </FlexBetween>

        <FlexBetween>
          <Paragraph fontSize={11} color="text.secondary">
            Per User Limit:
          </Paragraph>
          <Paragraph fontSize={11} fontWeight={500}>
            {item?.usageLimitPerUser || 1}
          </Paragraph>
        </FlexBetween>
      </Stack>

      {/* Footer with Active State Chip + Meta Info */}
      <FlexBetween
        mt={2}
        pt={1}
        sx={{ borderTop: 1, borderColor: "divider" }}
      >
         <Paragraph fontSize={11} color="text.secondary">
            Status:
          </Paragraph>
        <Chip
          label={item?.isActive ? "Active" : "Inactive"}
          color={getActiveStatusColor(item?.isActive)}
          size="small"
        />
      </FlexBetween>

      <FlexBetween mt={1}>
        <Paragraph fontSize={10} color="text.secondary">
          Created: {formatDate(item?.createdAt)}
        </Paragraph>
        <Paragraph fontSize={10} color="text.secondary">
          By: {item?.createdBy || "N/A"}
        </Paragraph>
      </FlexBetween>
    </Card>
  );
}
