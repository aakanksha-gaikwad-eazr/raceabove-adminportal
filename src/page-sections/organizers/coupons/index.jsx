import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

import CouponsCard from "./CouponsCard";
import CouponsSummaryCard from "./CouponsSummaryCard";

export default function Coupons({ singleOrganizer }) {
  const theme = useTheme();

  if (!singleOrganizer) {
    return (
      <Box
        py={3}
        mt={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="h6" color="text.secondary">
          Coupons data not available
        </Typography>
      </Box>
    );
  }

  const couponsData = singleOrganizer?.coupons || [];

  if (!couponsData.length) {
    return (
      <Box
        mt={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="h6" color="text.secondary">
          No Coupons data available
        </Typography>
      </Box>
    );
  }

  // ✅ Calculate summary statistics for coupons
  const totalCoupons = couponsData.length;
  const activeCoupons = couponsData.filter((c) => c.isActive).length;
  const pendingApproval = couponsData.filter(
    (c) => c.approvalStatus === "pending"
  ).length;
  const approvedCoupons = couponsData.filter(
    (c) => c.approvalStatus === "approved"
  ).length;
  const totalUsage = couponsData.reduce(
    (sum, c) => sum + (c.usageCount || 0),
    0
  );

  return (
    <Box py={3}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <CouponsSummaryCard
            title="Total Coupons"
            value={totalCoupons}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <CouponsSummaryCard
            title="Active Coupons"
            value={activeCoupons}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <CouponsSummaryCard
            title="Approved Coupons"
            value={approvedCoupons}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <CouponsSummaryCard
            title="Pending Approval"
            value={pendingApproval}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ md: 2.4, sm: 6, xs: 12 }}>
          <CouponsSummaryCard
            title="Total Usage"
            value={totalUsage}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Coupon Cards */}
      <Grid container spacing={3}>
        {couponsData.map((item) => (
          <Grid key={item.id} size={{ md: 4, sm: 6, xs: 12 }}>
            <CouponsCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
