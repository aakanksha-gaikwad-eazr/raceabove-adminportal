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
import MoreTicketTypeButtontwo from "@/components/more-tickettype-button-two";

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
      return item.name
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

  return (
    <div className="pt-2 pb-4">
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <HeadingAreaCoupon value={ticketypeFilter.role} />

        <SearchArea
          value={ticketypeFilter.search}
          onChange={(e) => handleChangeFilter("search", e.target.value)}
        />

        <Grid container spacing={3}>
          {Array.isArray(filteredTicketType) &&
          filteredTicketType.length > 0 ? (
            paginate(page, tickettypePerPage, filteredTicketType).map(
              (item, index) => (
                <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "0.3s",
                      boxShadow: 1,
                      backgroundColor: "background.paper",
                      ":hover": {
                        boxShadow: 4,
                        borderColor: "primary.light",
                      },
                      width: "300px",
                      height: "190px",
                    }}
                  >
                    <FlexBetween
                      sx={{ justifyContent: "flex-end" }}
                      mx={-1}
                      mt={-1}
                    >
                      <MoreTicketTypeButtontwo ticketTypeId={item?.id} />
                    </FlexBetween>

                    <Stack spacing={1} mt={1}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>
                          <LocalOfferIcon color="secondary" />
                        </Avatar>
                        <Box>
                          <Paragraph fontWeight={600} fontSize={16}>
                            {item?.name}
                          </Paragraph>
                          {/* <Small color="grey.600">Code</Small> */}
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Description fontSize="small" color="action" />
                        <Small
                          color="text.secondary"
                          sx={{
                            maxWidth: "100%",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxHeight: "3em",
                            lineHeight: "1.5em",
                          }}
                        >
                          {item?.description?.length > 50
                            ? item.description.slice(0, 50) + "..."
                            : item?.description || "No description"}
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
