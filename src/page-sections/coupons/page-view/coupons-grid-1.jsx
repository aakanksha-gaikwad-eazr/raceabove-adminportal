import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Pagination,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Description from "@mui/icons-material/Description";
import { useDispatch, useSelector } from "react-redux";

import { FlexBetween } from "@/components/flexbox";
import { Paragraph, Small } from "@/components/typography";
import SearchArea from "../SearchArea";
import HeadingAreaCoupon from "../HeadingAreaCoupon";
import MoreCouponButtontwo from "@/components/more-coupon-button-two";
import { paginate } from "@/utils/paginate";
import { getCoupons } from "../../../store/apps/coupons";

export default function CouponsGrid1PageView() {
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

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <HeadingAreaCoupon />

        <SearchArea
          value={search}
          sx={{ width: "100%", maxWidth: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
          gridRoute="/dashboard/sports-grid"
          listRoute="/dashboard/user-list"
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
                      "&:hover": {
                        boxShadow: 6,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <FlexBetween
                      sx={{ justifyContent: "flex-end" }}
                      mb={2}
                    >
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
                          <Small color="text.secondary">Code</Small>
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
                          Expires: {item.endDate || "N/A"}
                        </Small>
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
                onChange={(_, newPage) => setPage(newPage)}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
