import { useEffect, useState } from "react"; // MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination"; // CUSTOM COMPONENTS
import { FlexBetween } from "@/components/flexbox";
import { Paragraph, Small } from "@/components/typography"; // CUSTOM PAGE SECTION COMPONENTS
import HeadingArea from "../HeadingArea"; // CUSTOM ICON COMPONENTS
import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useDispatch, useSelector } from "react-redux";
import { getCoupons } from "../../../store/apps/coupons";
import { Description } from "@mui/icons-material";
import ExpiryIcon from "@/icons/Expiryicon";
import MoreCouponButtontwo from "@/components/more-coupon-button-two";
import SearchArea from "../SearchArea";
import { getTicketType } from "@/store/apps/tickettype";
import MoreTicketTypeButtontwo from "@/components/more-tickettype-button-two";
import { Chip, Switch } from "@mui/material";
import toast from "react-hot-toast";

export default function TicketTypeGrid1PageView() {
  const dispatch = useDispatch();
  const { tickettypes } = useSelector((state) => state.tickettype);
  console.log("tickettypes", tickettypes);
  const [tickettypePerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [ticketypeFilter, setTickettypeFilter] = useState({
    search: "",
  });

  const handleChangeFilter = (key, value) => {
    setTickettypeFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    dispatch(getTicketType());
  }, []);

  const filteredTicketType = tickettypes.filter((item) => {
    if (ticketypeFilter.search) {
      return item.title
        ?.toLowerCase()
        .includes(ticketypeFilter.search.toLowerCase());
    } else return true;
  });

  useEffect(() => {
    const totalPages = Math.ceil(filteredTicketType.length / tickettypePerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredTicketType.length, page, tickettypePerPage]);

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };

    const handleToggleActive =async(event, tickeTypeId, currentStatus) => {
      console.log("clicked");
          event.stopPropagation();
          try {
            const updateData = {
              isActive: !currentStatus,
            };
            toast.success(
              `Ticket Type ${!currentStatus ? "activated" : "deactivated"} successfully`
            );
            dispatch(getTicketType());
          } catch (error) {
            toast.error("Failed to update Ticket Type status");
            console.error("Error updating Ticket Type:", error);
          }
    };

  return (
    <div className="pt-2 pb-4">
      <HeadingArea value={ticketypeFilter.role} />
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        {/* <SearchArea
          value={ticketypeFilter.search}
          onChange={(e) => handleChangeFilter("search", e.target.value)}
        /> */}
        <SearchArea
          value={ticketypeFilter.search}
          onChange={(e) => handleChangeFilter("search", e.target.value)}
          gridRoute="/ticket-type-grid"
          listRoute="/ticket-type-list-2"
        />

        <Grid container spacing={3}>
          {Array.isArray(filteredTicketType) &&
          filteredTicketType.length > 0 ? (
            paginate(page, tickettypePerPage, filteredTicketType).map(
              (item, index) => (
                <Grid item lg={4} md={4} sm={6} xs={12} key={index}>
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
                      height: 210, // Fixed height
                      width: 310, // Full width within grid
                      // aspectRatio: "1/1", // Makes it square (can adjust ratio as needed)
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
                      <MoreTicketTypeButtontwo ticketTypeId={item?.id} />
                    </FlexBetween>

                    <Stack spacing={1} mt={1} sx={{ flexGrow: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Avatar sx={{ flexShrink: 0 }}>
                          <LocalOfferIcon color="secondary" />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Paragraph
                            fontWeight={600}
                            fontSize={16}
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.2,
                              mb: 1,
                            }}
                          >
                            {item?.title}
                          </Paragraph>
                          <Small
                            color="grey.600"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.3,
                            }}
                          >
                            {item?.description}
                          </Small>
                        </Box>
                      </Stack>
                      <Stack spacing={1} mt={3} pt={2}>
                        <FlexBetween>
                          <Small color="text.secondary">Status</Small>
                          <Switch
                            size="small"
                            checked={item.isActive}
                            onChange={(e) =>
                              handleToggleActive(e, item.id, item.isActive)
                            }
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

          {/* <Grid item xs={12}>
            <Stack alignItems="right" py={2}>
              <Pagination
                shape="rounded"
                count={Math.ceil(filteredTicketType.length / tickettypePerPage)}
                onChange={(_, newPage) => setPage(newPage)}
              />
            </Stack>
          </Grid> */}
        </Grid>
      </Card>
    </div>
  );
}
