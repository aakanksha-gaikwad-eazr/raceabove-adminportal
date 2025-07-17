import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Pagination,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Description from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { FlexBetween } from "@/components/flexbox";
import { Paragraph, Small } from "@/components/typography";
import SearchArea from "../SearchArea";
import HeadingAreaCoupon from "../HeadingAreaTnc";
import MoreCouponButtontwo from "@/components/more-coupon-button-two";
import { paginate } from "@/utils/paginate";

export default function PrivacyPolicyGrid1PageView() {
  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.coupons);

  const [userPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  const filteredCoupons = coupons.filter((item) =>
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const totalPages = Math.ceil(
      filteredCoupons.length / userPerPage
    );
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredCoupons.length, page, userPerPage]);

  const handleToggleActive =async(event, couponId, currentStatus) => {
    console.log("clicked");
        event.stopPropagation();
        try {
          const updateData = {
            isActive: !currentStatus,
          };
          // await dispatch(updateCoupons({ id: couponId, data: updateData }));
          toast.success(
            `Coupon ${!currentStatus ? "activated" : "deactivated"} successfully`
          );
          dispatch(getCoupons());
        } catch (error) {
          toast.error("Failed to update coupon status");
          console.error("Error updating coupon:", error);
        }
  };

  const handleToggleVisible = async(event,couponId, currentStatus) => {
        console.log("clicked");

 event.stopPropagation();
    try {
      const updateData = {
        isVisible: !currentStatus,
      };
      // await dispatch(updateCoupons({ id: couponId, data: updateData }));
      toast.success(
        `Coupon visibility ${!currentStatus ? "enabled" : "disabled"} successfully`
      );
      dispatch(getCoupons());
    } catch (error) {
      toast.error("Failed to update coupon visibility");
      console.error("Error updating coupon:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Box className="pt-2 pb-4">
      <HeadingAreaCoupon />
      <Card sx={{ px: 3, py: 2 }}>
        <SearchArea
          value={search}
          sx={{ width: "100%", maxWidth: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
          gridRoute="/coupons-grid"
          listRoute="/coupons-list-2"
        />

        <Grid container spacing={3}>
          {filteredCoupons.length > 0 ? (
            paginate(page, userPerPage, filteredCoupons).map(
              (item, index) => (
                <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "0.3s",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      backgroundColor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      opacity: item.isActive ? 1 : 0.7,
                      "&:hover": {
                        boxShadow: 6,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <FlexBetween
                      sx={{ justifyContent: "space-between" }}
                      mb={2}
                    >
                      {/* Status Chips */}
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={item.approvalStatus}
                          color={
                            item.approvalStatus === "approved" 
                              ? "success" 
                              : item.approvalStatus === "pending"
                              ? "warning"
                              : "error"
                          }
                          variant="outlined"
                        />
                      </Stack>
                      <MoreCouponButtontwo couponId={item?.id} />
                    </FlexBetween>

                    <Stack spacing={2} flex={1}>
                      {/* Coupon Header */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Avatar sx={{ bgcolor: "grey.200" }}>
                          <LocalOfferIcon color="primary" />
                        </Avatar>
                        <Box>
                          <Paragraph
                            fontWeight={700}
                            fontSize={16}
                            noWrap
                          >
                            {item.code}
                          </Paragraph>
                          <Small color="text.secondary">
                            {item.discountType === "percentage" 
                              ? `${item.discountValue}% off` 
                              : `₹${item.discountValue} off`}
                          </Small>
                        </Box>
                      </Stack>

                      {/* Description */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Description
                          sx={{
                            color: "text.secondary",
                            fontSize: 18,
                          }}
                        />
                        <Small color="text.secondary">
                          {item.description || "No description"}
                        </Small>
                      </Stack>

                      {/* Expiry */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <EventAvailableIcon
                          sx={{
                            color: "text.secondary",
                            fontSize: 18,
                          }}
                        />
                        <Small color="text.secondary">
                          Expires: {formatDate(item.endTimeStamp)}
                        </Small>
                      </Stack>

                      {/* Usage Info */}
                      <Stack spacing={0.5}>
                        <Small color="text.secondary">
                          Usage: {item.usageCount} / {item.usageLimit || "Unlimited"}
                        </Small>
                        {item.minimumPurchase > 0 && (
                          <Small color="text.secondary">
                            Min. purchase: ₹{item.minimumPurchase}
                          </Small>
                        )}
                      </Stack>

                      {/* Toggle Switches */}
                      <Stack spacing={1} mt={1}>
                        <FlexBetween>
                          <Small color="text.secondary">Active</Small>
                          <Switch
                            size="small"
                            checked={item.isActive}
                            onChange={(e) =>
                            handleToggleActive(e,item.id,item.isActive)}
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                          />
                        </FlexBetween>
                        
                        <FlexBetween>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Small color="text.secondary">Visible</Small>
                            {item.isVisible ? (
                              <VisibilityIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            ) : (
                              <VisibilityOffIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            )}
                          </Stack>
                          <Switch
                            size="small"
                            checked={item.isVisible}
                            onChange={(e) => handleToggleVisible(e,item.id, item.isVisible)}
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                            
                          />
                        </FlexBetween>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              )
            )
          ) : (
            <Grid item xs={12}>
              <Paragraph
                fontSize={16}
                fontWeight={500}
                textAlign="center"
                color="text.secondary"
                sx={{ width: "100%", my: 3 }}
              >
                No Coupons have been added yet!
              </Paragraph>
            </Grid>
          )}

          <Grid item xs={12}>
            <Stack alignItems="center" py={2}>
              <Pagination
                shape="rounded"
                count={Math.ceil(
                  filteredCoupons.length / userPerPage
                )}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}