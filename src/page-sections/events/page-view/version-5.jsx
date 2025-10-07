import { useEffect, useState } from "react"; // MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS
import { H6 } from "@/components/typography";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table"; // CUSTOM PAGE SECTION COMPONENTS
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal/DeleteModal";
import { useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import HeadingArea from "../HeadingArea";
import toast from "react-hot-toast";
import { Button, Chip, Switch, Typography } from "@mui/material";
import { warning } from "@/theme/colors";
import Eye from "@/icons/Eye";
// import EyeOff from "@/icons/EyeOff";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { getEvents } from "@/store/apps/events";
import ApprovalModal from "@/components/approval-modal";
import { reviewEvents } from "@/store/apps/events";
import { limitWords } from "@/utils/wordLimiter";

const HeadTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  paddingBlock: 14,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  borderBottom: `1px solid ${theme.palette.grey[isDark(theme) ? 700 : 100]}`,
  "&:first-of-type": {
    paddingLeft: 24,
  },
  "&:last-of-type": {
    paddingRight: 24,
  },
}));
const BodyTableCell = styled(HeadTableCell)({
  fontSize: 10,
  fontWeight: 400,
  backgroundColor: "transparent",
});
const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  cursor: "pointer",
  ...(active && {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  }),
}));
const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "Id",
    width: "4%",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Title",
    width: "10%",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
    width: "32%",
  },
  {
    id: "location",
    numeric: true,
    disablePadding: false,
    label: "Location",
    width: "15%",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
    width: "10%",
  },

  {
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
    width: "10%",
  },
  {
    id: "reviewedBy",
    numeric: true,
    disablePadding: false,
    label: "Reviewed By",
    width: "10%",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
    width: "6%",
  },
];

export default function EventsVersionFivePageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedEvents, setSelectedEvents] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [eventToReview, setEventToReview] = useState(null);

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "name",
    defaultRowsPerPage: 10,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allEvents } = useSelector((state) => state.events);
  console.log("allEvents", allEvents);

  const EventsArray = Array.isArray(allEvents) ? allEvents : [];

  const filteredEvents = stableSort(
    EventsArray,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.title?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEvents) {
      const updatedEvents = EventsArray.find(
        (event) => event.id === selectedEvents.id
      );
      if (updatedEvents) setSelectedEvents(updatedEvents);
    } else {
      setSelectedEvents(EventsArray[0]);
    }
  }, [EventsArray]);

  const handleReviewClick = (event) => {
    console.log("eventID", event)
    setEventToReview(event);
    // setApprovalModalOpen(true);
    navigate(`/events/details/${event?.id}`)
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setEventToReview(null);
  };
  const handleNavigationEventDetailsPage = (eventId) => {
    navigate(`/events/details/${eventId}`);
  };

  const handleRowClick = (event, eventId) => {
    // Check if the click originated from a button, icon button, or chip
    const clickedElement = event.target;
    const isInteractiveElement =
      clickedElement.closest("button") ||
      clickedElement.closest('[role="button"]') ||
      clickedElement.closest(".MuiChip-root") ||
      clickedElement.closest(".MuiIconButton-root") ||
      clickedElement.closest(".MuiButton-root");

    if (isInteractiveElement) {
      return;
    }
    navigate(`/events/details/${eventId}`);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    // Format: "Sep 10, 2025 • 8:00 PM"
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return date
      .toLocaleString("en-US", options)
      .replace(",", ",")
      .replace(" at", " •");
  };
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const startOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const endOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    if (start.toDateString() === end.toDateString()) {
      // Same day: "Sep 10 • 8:00 PM - 11:30 PM"
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • ${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    } else {
      // Different days: "Sep 10, 8:00 PM - Sep 12, 9:30 AM"
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    }
  };

  const formatLocation = (city, state, country) => {
    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (country) parts.push(country);

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const handleApprovalSubmit = async (formData) => {
    if (eventToReview) {
      try {
        const reviewData = {
          id: eventToReview.id,
          data: {
            approvalStatus: String(formData.approvalStatus)
              .toLowerCase()
              .trim(),
            reviewReason: String(formData.reviewReason).trim(),
          },
        };

        // Additional validation to ensure values are correct
        if (
          !["approved", "rejected"].includes(reviewData?.data?.approvalStatus)
        ) {
          toast.error("Invalid approval status");
          return;
        }
        if (!reviewData?.data?.reviewReason) {
          toast.error("Review reason is required");
          return;
        }
        const result = await dispatch(reviewEvents(reviewData));
        console.log("result", result);
        if (result?.payload?.status === 200) {
          dispatch(getEvents());

          // Show success toast based on approval status
          switch (reviewData?.data?.approvalStatus) {
            case "approved":
              toast.success("Event are approved successfully!");
              break;
            case "rejected":
              toast.success("Event are rejected successfully!");
              break;
            default:
              toast.success("Event are reviewed successfully!");
          }
          // Reset state
          setApprovalModalOpen(false);
          setEventToReview(null);
        } else {
          // Handle API error response
          const errorMessage =
            result.payload?.message ||
            result.error?.message ||
            "Failed to review Event";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error reviewing Event:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to review Event. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const isReviewed = (approvalStatus) => {
    return approvalStatus === "approved" || approvalStatus === "rejected";
  };

  return (
    <div className="pt-2 pb-4">
      <HeadingArea />

      <Grid container>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: "2px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* SEARCH BOX AREA */}
            <Box px={3}>
              <SearchArea
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                // gridRoute="/events/event-grid"
                listRoute="/events/event-list"
              />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table>
                  {/* TABLE HEADER */}
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <HeadTableCell
                          key={headCell.id}
                          align="center"
                          padding={headCell.disablePadding ? "none" : "normal"}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                          width={headCell.width}
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            onClick={(e) => handleRequestSort(e, headCell.id)}
                            direction={orderBy === headCell.id ? order : "asc"}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        </HeadTableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {/* TABLE BODY AND DATA */}
                  <TableBody>
                    {filteredEvents
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((events, ind) => (
                        <BodyTableRow
                          key={events.id}
                          // active={selectedEvents?.id === events.id ? 1 : 0}
                          // onClick={() => setSelectedEvents(events)}
                          // onClick={()=>handleNavigationEventDetailsPage(events?.id)}
                          onClick={(e) => {
                            setSelectedEvents(events);
                            handleRowClick(e, events.id);
                          }}
                        >
                          {" "}
                          <BodyTableCell align="let">
                            <Typography variant="caption">
                              {page * rowsPerPage + ind + 1}
                            </Typography>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              {/* <Avatar
                                src={events.mobileCoverImage}
                                sx={{
                                  borderRadius: "20%",
                                  backgroundColor: "grey.100",
                                }}
                              /> */}
                              <H6
                                fontSize={10}
                                color="text.primary"
                                style={{ textTransform: "capitalize" }}
                              >
                                {limitWords(events.title, 10)}
                              </H6>
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <H6 fontSize={10} color="text.primary">
                              {formatDateRange(
                                events.startDateTime,
                                events.endDateTime
                              )}
                            </H6>
                          </BodyTableCell>
                          <BodyTableCell align="center" fontSize={10}>
                            {formatLocation(
                              events.city,
                              events.state,
                              events.country
                            )}
                            {/* <Chip
                              label={
                                events.discountType
                                  ? events.discountType
                                      .charAt(0)
                                      .toUpperCase() +
                                    events.discountType.slice(1)
                                  : "N/A"
                              }
                              color={
                                events.discountType === "percentage"
                                  ? "primary"
                                  : "primary"
                              }
                              variant="outlined"
                              size="small"
                            /> */}
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            ₹ {Math.floor(events?.startFromTicketPrice)}
                          </BodyTableCell>
                          <BodyTableCell alignItems="center">
                            {/* {addoncatgory.approvalStatus ?? "N/A"} */}
                            <Chip
                              label={
                                events.approvalStatus
                                  ? events.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    events.approvalStatus.slice(1)
                                  : "N/A"
                              }
                              color={
                                events.approvalStatus === "approved"
                                  ? "success"
                                  : events.approvalStatus === "pending"
                                    ? "warning"
                                    : events.approvalStatus === "rejected"
                                      ? "error"
                                      : "default"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                          <BodyTableCell>{events?.reviewedBy}</BodyTableCell>
                          <BodyTableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewClick(events);
                              }}
                            >
                              {isReviewed(events.approvalStatus)
                                ? "Re-review"
                                : "Review"}
                            </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredEvents.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredEvents.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
      {/* APPROVAL MODAL */}
      <ApprovalModal
        open={approvalModalOpen}
        handleClose={handleApprovalCancel}
        title="Review Event"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: eventToReview?.approvalStatus || "",
          reviewReason: eventToReview?.reviewReason || "",
        }}
      />
    </div>
  );
}
