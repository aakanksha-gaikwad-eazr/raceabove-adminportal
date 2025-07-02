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
import { useDispatch, useSelector } from "react-redux";
import { Description } from "@mui/icons-material";
import SearchArea from "../SearchArea";
import { getTicketTemplate } from "@/store/apps/tickettemplate";
import MoreTicketTemplateButtontwo from "@/components/more-tickettemplate-button-two";

export default function TicketTemplateGrid1PageView() {
  const dispatch = useDispatch();
  const { ticketTemplate } = useSelector((state) => state.tickettemplate);
  console.log("ticketTemplate", ticketTemplate);

  const [ticketTemplatePerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [tickeTemplateFilter, setTicketTemplateFilter] = useState({
    search: "",
  });

  const handleChangeFilter = (key, value) => {
    setTicketTemplateFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    dispatch(getTicketTemplate());
  }, []);

  const filteredTicketTemplate = ticketTemplate.filter((item) => {
    if (tickeTemplateFilter.search) {
      return item.name
        ?.toLowerCase()
        .includes(tickeTemplateFilter.search.toLowerCase());
    } else return true;
  });

  useEffect(() => {
    const totalPages = Math.ceil(
      filteredTicketTemplate.length / ticketTemplatePerPage
    );
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredTicketTemplate.length, page, ticketTemplatePerPage]);

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
        <HeadingAreaCoupon value={tickeTemplateFilter.role} />

        <SearchArea
          value={tickeTemplateFilter.search}
          onChange={(e) => handleChangeFilter("search", e.target.value)}
        />

        <Grid container spacing={3}>
          {Array.isArray(filteredTicketTemplate) &&
          filteredTicketTemplate.length > 0 ? (
            paginate(page, ticketTemplatePerPage, filteredTicketTemplate).map(
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
                      height: "300px",
                    }}
                  >
                    <FlexBetween
                      sx={{ justifyContent: "flex-end" }}
                      mx={-1}
                      mt={-1}
                    >
                      <MoreTicketTemplateButtontwo
                        ticketTemplateId={item?.id}
                      />
                    </FlexBetween>
                    <Stack spacing={1} mt={1}>

                      <Small color="text.secondary">
                        <strong>Description:</strong>{" "}
                        {item?.description || "No description"}
                      </Small>

                      <Small color="text.secondary">
                        <strong>Quantity:</strong> {item?.quantity}
                      </Small>

                      <Small color="text.secondary">
                        <strong>Age Range:</strong> {item?.minAge} -{" "}
                        {item?.maxAge} yrs
                      </Small>

                          <Stack direction="row" alignItems="center" spacing={2}>
                        <Box>
                          <Small color="text.secondary"> <strong>Price:</strong>- ₹{item?.price}</Small>
                        </Box>
                      </Stack>

                      <Small color="text.secondary">
                        <strong>Ticket Type:</strong>{" "}
                        {item?.ticketType?.name || "-"}
                      </Small>

                      <Small color="text.secondary">
                        <strong>Type Desc:</strong>{" "}
                        {item?.ticketType?.description || "-"}
                      </Small>
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
