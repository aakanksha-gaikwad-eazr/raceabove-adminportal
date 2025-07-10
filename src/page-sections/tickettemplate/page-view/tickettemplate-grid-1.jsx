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
import HeadingAreaCoupon from "../HeadingAreaCoupon"; // CUSTOM ICON COMPONENTS
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
import { Chip, Switch, Divider } from "@mui/material";
import toast from "react-hot-toast";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import MoreTicketTemplateButtontwo from "@/components/more-tickettemplate-button-two";

export default function TicketTemplateGrid1PageView() {
  const dispatch = useDispatch();
  const { tickettypes } = useSelector((state) => state.tickettype);
  const {allTicketTemplate} = useSelector((state) => state.tickettemplate);
  console.log("allTicketTemplate", allTicketTemplate);
  console.log("tickettypes", tickettypes);
  const [ticketemplatePerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [ticketemplateFilter, setTickettemplateFilter] = useState({
    search: "",
  });

  const handleChangeFilter = (key, value) => {
    setTickettemplateFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    dispatch(getTicketTemplate());
  }, []);

  const filteredTicketTemplate = allTicketTemplate.filter((item) => {
    if (ticketemplateFilter.search) {
      return item.description
        ?.toLowerCase()
        .includes(ticketemplateFilter.search.toLowerCase());
    } else return true;
  });

  useEffect(() => {
    const totalPages = Math.ceil(filteredTicketTemplate.length / ticketemplatePerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredTicketTemplate.length, page, ticketemplatePerPage]);

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };

    const handleToggleActive =async(event, tickeTemplateId, currentStatus) => {
      console.log("clicked");
          event.stopPropagation();
          try {
            const updateData = {
              isActive: !currentStatus,
            };
            toast.success(
              `Ticket Template ${!currentStatus ? "activated" : "deactivated"} successfully`
            );
            dispatch(getTicketTemplate());
          } catch (error) {
            toast.error("Failed to update Ticket Template status");
            console.error("Error updating Ticket Template:", error);
          }
    };

  return (
    <div className="pt-2 pb-4">
      <HeadingAreaCoupon value={ticketemplateFilter.role} />
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <SearchArea
          value={ticketemplateFilter.search}
          onChange={(e) => handleChangeFilter("search", e.target.value)}
          gridRoute="/ticket-template-grid"
          listRoute="/ticket-template-list-2"
        />

        <Grid container spacing={3}>
          {Array.isArray(filteredTicketTemplate) &&
          filteredTicketTemplate.length > 0 ? (
            paginate(page, ticketemplatePerPage, filteredTicketTemplate).map(
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
                      height: 320, // Increased height to accommodate new fields
                      width: 310,
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
                      <MoreTicketTemplateButtontwo ticketTemplateId={item?.id} />
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
                          <Small
                            color="grey.600"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
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

                      {/* Additional Fields Section */}
                      <Divider sx={{ my: 1 }} />
                      
                      <Stack spacing={1}>
                        {/* Price and Quantity Row */}
                        <FlexBetween>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AttachMoneyIcon sx={{ fontSize: 16, color: "success.main" }} />
                            <Small color="text.secondary">Price:</Small>
                          </Stack>
                          <Small fontWeight={600} color="success.main">
                            ${parseFloat(item.price || 0).toFixed(2)}
                          </Small>
                        </FlexBetween>

                        <FlexBetween>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PeopleIcon sx={{ fontSize: 16, color: "info.main" }} />
                            <Small color="text.secondary">Quantity:</Small>
                          </Stack>
                          <Small fontWeight={600} color="info.main">
                            {item.quantity || 0}
                          </Small>
                        </FlexBetween>

                        {/* Age Range Row */}
                        <FlexBetween>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ChildCareIcon sx={{ fontSize: 16, color: "warning.main" }} />
                            <Small color="text.secondary">Age Range:</Small>
                          </Stack>
                          <Small fontWeight={600} color="warning.main">
                            {item.minAge || 0} - {item.maxAge || 0} years
                          </Small>
                        </FlexBetween>

                        {/* Created By Info */}
                        <FlexBetween>
                          <Small color="text.secondary">Created by:</Small>
                          <Small fontWeight={500} color="text.primary">
                            {item.createdBy || "Unknown"}
                          </Small>
                        </FlexBetween>
                      </Stack>

                      <Stack spacing={1} mt={2} pt={2}>
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
                No Ticket Templates have been added yet!
              </Paragraph>
            </Grid>
          )}

        </Grid>
      </Card>
    </div>
  );
}