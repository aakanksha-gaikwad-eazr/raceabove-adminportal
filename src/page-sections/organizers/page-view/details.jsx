import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import styled from "@mui/material/styles/styled";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventIcon from "@mui/icons-material/Event";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import HelpIcon from "@mui/icons-material/Help";
import PolicyIcon from "@mui/icons-material/Policy";
import SecurityIcon from "@mui/icons-material/Security";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LabelIcon from "@mui/icons-material/Label";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Tabs,
  Tab,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Announcement as AnnouncementIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Group as GroupIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { formatDate } from "@/utils/dateFormatter";
import { getSingleOrganizers } from "@/store/apps/organisers";
import ReactQuill from "react-quill";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`organizer-tabpanel-${index}`}
      aria-labelledby={`organizer-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const StyledAvatar = styled(Avatar)({
  width: 80,
  height: 80,
});

const Div = styled("div")({
  padding: "1.5rem",
});

const SectionHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1rem",
});

const InfoCard = styled(Card)({
  marginBottom: "1rem",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
});

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 500,
  ...(status === "pending" && {
    backgroundColor: "#fff3cd",
    color: "#856404",
  }),
  ...(status === "approved" && {
    backgroundColor: "#d4edda",
    color: "#155724",
  }),
  ...(status === "rejected" && {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  }),
}));

export default function OrganizerDetailsPageView() {
  const dispatch = useDispatch();
  const [organizerData, setOrganizerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Add this with your other state declarations at the top of the component
const [currentChallengesPage, setCurrentChallengesPage] = useState(1);
const challengesPerPage = 5;

// Calculate paginated challenges
const challengesStartIndex = (currentChallengesPage - 1) * challengesPerPage;
const paginatedChallenges = 
  organizerData?.challenges?.slice(challengesStartIndex, challengesStartIndex + challengesPerPage) || [];

  // State management for pagination and accordion
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedEvent, setExpandedEvent] = useState(false);
  const eventsPerPage = 5; // Adjust as needed

  // Calculate paginated events
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents =
    organizerData?.events?.slice(startIndex, startIndex + eventsPerPage) || [];

    // Add with other state declarations
const [currentProductsPage, setCurrentProductsPage] = useState(1);
const [currentCouponsPage, setCurrentCouponsPage] = useState(1);
const productsPerPage = 5;
const couponsPerPage = 5;

// Calculate paginated products
const productsStartIndex = (currentProductsPage - 1) * productsPerPage;
const paginatedProducts = 
  organizerData?.products?.slice(productsStartIndex, productsStartIndex + productsPerPage) || [];

// Calculate paginated coupons
const couponsStartIndex = (currentCouponsPage - 1) * couponsPerPage;
const paginatedCoupons = 
  organizerData?.coupons?.slice(couponsStartIndex, couponsStartIndex + couponsPerPage) || [];

  // Add with other state declarations
const [currentTicketTemplatesPage, setCurrentTicketTemplatesPage] = useState(1);
const [currentTicketTypesPage, setCurrentTicketTypesPage] = useState(1);
const [currentFAQPage, setCurrentFAQPage] = useState(1);
const [currentTnCPage, setCurrentTnCPage] = useState(1);
const [currentPrivacyPage, setCurrentPrivacyPage] = useState(1);

const ticketTemplatesPerPage = 5;
const ticketTypesPerPage = 6; // Grid of 6 items
const faqPerPage = 5;
const tncPerPage = 3;
const privacyPerPage = 3;

// Calculate paginated data
const ticketTemplatesStartIndex = (currentTicketTemplatesPage - 1) * ticketTemplatesPerPage;
const paginatedTicketTemplates = organizerData?.ticketTemplates?.slice(
  ticketTemplatesStartIndex, 
  ticketTemplatesStartIndex + ticketTemplatesPerPage
) || [];

const ticketTypesStartIndex = (currentTicketTypesPage - 1) * ticketTypesPerPage;
const paginatedTicketTypes = organizerData?.ticketTypes?.slice(
  ticketTypesStartIndex, 
  ticketTypesStartIndex + ticketTypesPerPage
) || [];

const faqStartIndex = (currentFAQPage - 1) * faqPerPage;
const paginatedFAQ = organizerData?.frequentlyAskedQuestions?.slice(
  faqStartIndex, 
  faqStartIndex + faqPerPage
) || [];

const tncStartIndex = (currentTnCPage - 1) * tncPerPage;
const paginatedTnC = organizerData?.termsAndConditions?.slice(
  tncStartIndex, 
  tncStartIndex + tncPerPage
) || [];

const privacyStartIndex = (currentPrivacyPage - 1) * privacyPerPage;
const paginatedPrivacy = organizerData?.privacyPolicies?.slice(
  privacyStartIndex, 
  privacyStartIndex + privacyPerPage
) || [];

  const navigate = useNavigate();
  const { id } = useParams();

  const formatEventDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isSameDay = start.toDateString() === end.toDateString();
    const isToday = start.toDateString() === today.toDateString();
    const isTomorrow = start.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    if (isSameDay) {
      return start.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year:
          start.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }

    return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  };

  const formatEventTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startTime = start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const endTime = end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${startTime} - ${endTime}`;
  };

  const formatFullDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ${diffHours % 24}h`;
    }
    return `${diffHours}h ${diffMinutes}m`;
  };

  // Event handlers
  const handleViewEvent = (eventId) => {
    // Navigate to event details
    console.log("View event:", eventId);
  };

  const handleEditEvent = (eventId) => {
    // Navigate to edit event
    console.log("Edit event:", eventId);
  };

  const handleCreateEvent = () => {
    // Navigate to create event
    console.log("Create new event");
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getSingleOrganizers(id))
        .then((response) => {
          if (response?.payload) {
            setOrganizerData(response?.payload);
            console.log("Organizer data loaded:", response.payload);
          }
        })
        .catch((error) => {
          console.error("Error fetching organizer:", error);
          toast.error("Failed to fetch organizer details");
        })
        .finally(() => setLoading(false));
    } else {
      toast.error("No organizer ID provided");
      navigate("/organizers");
    }
  }, [dispatch, id, navigate]);

  const handleViewEventDetails = (eventId) => {
    navigate(`/events/details/${eventId}`);
  };
  const handleViewChallengeDetails = (challengeId) => {
    navigate(`/challenges/details/${challengeId}`);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!organizerData) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert severity="warning">No organizer data found</Alert>
      </div>
    );
  }

  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString()}`;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid size={{ md: 8, xs: 12 }}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                aria-label="organizer details tabs"
                variant="scrollable"
                scrollButtons="auto"
                style={{ padding: "10px 20px" }}
              >
                <Tab label="Overview" />
                <Tab label="Events" />
                <Tab label="Challenges" />
                <Tab label="Products & Coupons" />
                <Tab label="Templates & Policies" />
              </Tabs>
            </Box>

            {/* TAB 1: OVERVIEW */}
            <TabPanel value={activeTab} index={0}>
              <Div>
                {/* Basic Info */}
                <FlexBetween mb={3}>
                  <FlexBox alignItems="center" gap={2}>
                    <StyledAvatar
                      alt="Organizer Logo"
                      src={organizerData?.companyLogo}
                    />
                    <Box>
                      <H6 fontSize={20} style={{ textTransform: "capitalize" }}>
                        {organizerData?.name}
                      </H6>
                      <Paragraph
                        color="text.secondary"
                        style={{ textTransform: "capitalize" }}
                      >
                        {organizerData?.companyName}
                      </Paragraph>
                    </Box>
                  </FlexBox>
                  <StatusChip
                    style={{ textTransform: "capitalize" }}
                    label={organizerData?.approvalStatus || "Pending"}
                    status={organizerData?.approvalStatus}
                    size="small"
                  />
                </FlexBetween>

                {/* Contact Information */}
                <Grid container spacing={3} mb={3}>
                  <Grid size={6}>
                    <FlexBox alignItems="center" gap={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">
                          Email
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {organizerData?.email}
                        </Paragraph>
                      </Box>
                    </FlexBox>
                  </Grid>
                  <Grid size={6}>
                    <FlexBox alignItems="center" gap={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">
                          Phone
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {organizerData?.phoneNumber}
                        </Paragraph>
                      </Box>
                    </FlexBox>
                  </Grid>
                </Grid>

                {/* Commission Info */}
                <Grid container spacing={2} mb={3}>
                  <Grid size={6}>
                    <FlexBox alignItems="center" gap={1}>
                      <MonetizationOnIcon fontSize="small" color="action" />
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">
                          Commission
                        </Paragraph>
                        <Paragraph
                          fontWeight={500}
                          fontSize={18}
                          color="primary.main"
                        >
                          {organizerData?.commission}%
                        </Paragraph>
                      </Box>
                    </FlexBox>
                  </Grid>
                  {/* <Grid size={4}>
                    <Box>
                      <Paragraph fontSize={12} color="text.secondary">
                        Status
                      </Paragraph>
                      <Chip
                        label={organizerData?.isActive ? "Active" : "Inactive"}
                        color={organizerData?.isActive ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                  </Grid> */}
                  <Grid size={6}>
                    <FlexBox alignItems="center" gap={1}>
                      <GridCheckCircleIcon fontSize="small" color="action" />
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">
                          Review Status
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {organizerData?.reviewReason || "No review"}
                        </Paragraph>
                      </Box>
                    </FlexBox>
                  </Grid>
                </Grid>

                {/* Statistics */}
                <Grid container spacing={2} mb={3}>
                  <Grid size={3}>
                    <Box
                      textAlign="center"
                      p={2}
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Paragraph
                        fontSize={24}
                        fontWeight={600}
                        color="primary.main"
                      >
                        {organizerData?.events?.length || 0}
                      </Paragraph>
                      <Paragraph fontSize={12} color="text.secondary">
                        Events
                      </Paragraph>
                    </Box>
                  </Grid>
                  <Grid size={3}>
                    <Box
                      textAlign="center"
                      p={2}
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Paragraph
                        fontSize={24}
                        fontWeight={600}
                        color="success.main"
                      >
                        {organizerData?.challenges?.length || 0}
                      </Paragraph>
                      <Paragraph fontSize={12} color="text.secondary">
                        Challenges
                      </Paragraph>
                    </Box>
                  </Grid>
                  <Grid size={3}>
                    <Box
                      textAlign="center"
                      p={2}
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Paragraph
                        fontSize={24}
                        fontWeight={600}
                        color="warning.main"
                      >
                        {organizerData?.products?.length || 0}
                      </Paragraph>
                      <Paragraph fontSize={12} color="text.secondary">
                        Products
                      </Paragraph>
                    </Box>
                  </Grid>
                  <Grid size={3}>
                    <Box
                      textAlign="center"
                      p={2}
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Paragraph
                        fontSize={24}
                        fontWeight={600}
                        color="info.main"
                      >
                        {organizerData?.coupons?.length || 0}
                      </Paragraph>
                      <Paragraph fontSize={12} color="text.secondary">
                        Coupons
                      </Paragraph>
                    </Box>
                  </Grid>
                </Grid>

                {/* Metadata */}
                <Card variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={500}
                      gutterBottom
                    >
                      Account Information
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                      <Grid size={6}>
                        <Stack spacing={2}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Created By
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ textTransform: "capitalize" }}
                            >
                              {organizerData?.createdBy || "Unknown"}
                              {organizerData?.createdByRole && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {" "}
                                  • {organizerData?.createdByRole}
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Created On
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(organizerData?.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid size={6}>
                        <Stack spacing={2}>
                          {organizerData?.updatedBy && (
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Updated By
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ textTransform: "capitalize" }}
                              >
                                {organizerData?.updatedBy}
                                {organizerData?.updatedByRole && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {" "}
                                    • {organizerData?.updatedByRole}
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                          )}
                          {organizerData?.updatedAt && (
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Updated On
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(organizerData?.updatedAt)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Div>
            </TabPanel>

            {/* TAB 2: EVENTS */}
            <TabPanel value={activeTab} index={1}>
              <Div>
                <SectionHeader>
                  <EventIcon color="action" />
                  <H6 fontSize={16}>
                    Events ({organizerData?.events?.length || 0})
                  </H6>
                </SectionHeader>

                {organizerData?.events?.length > 0 ? (
                  <>
                    {/* Events Accordion */}
                    <Box>
                      {paginatedEvents.map((event, index) => (
                        <Accordion
                          key={event.id}
                          expanded={expandedEvent === event.id}
                          onChange={(e, isExpanded) =>
                            setExpandedEvent(isExpanded ? event.id : false)
                          }
                          sx={{
                            mb: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "12px !important",
                            "&:before": { display: "none" },
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            "&.Mui-expanded": {
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              borderRadius: "12px",
                              "&.Mui-expanded": {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                              },
                              "& .MuiAccordionSummary-content": {
                                margin: "12px 0",
                              },
                            }}
                          >
                            <FlexBetween width="100%">
                              <Box flex={1}>
                                <FlexBox alignItems="center" gap={1} mb={1}>
                                  <Typography
                                    fontWeight={600}
                                    fontSize={16}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {event.title}
                                  </Typography>
                                  <StatusChip
                                    style={{ textTransform: "capitalize" }}
                                    label={event.approvalStatus}
                                    status={event.approvalStatus}
                                    size="small"
                                  />
                                  <Chip
                                    label={
                                      event.isActive ? "Active" : "Inactive"
                                    }
                                    color={event.isActive ? "success" : "error"}
                                    size="small"
                                  />
                                  {/* {event.category && (
                                    <Chip
                                      label={event.category.name}
                                      variant="outlined"
                                      size="small"
                                      icon={
                                        <CategoryIcon sx={{ fontSize: 16 }} />
                                      }
                                    />
                                  )} */}
                                </FlexBox>

                                <FlexBox alignItems="center" gap={2}>
                                  <FlexBox alignItems="center" gap={0.5}>
                                    <CalendarTodayIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                      }}
                                    />
                                    <Typography
                                      fontSize={12}
                                      color="text.secondary"
                                    >
                                      {formatEventDate(
                                        event.startDateTime,
                                        event.endDateTime
                                      )}
                                    </Typography>
                                  </FlexBox>
                                  <FlexBox alignItems="center" gap={0.5}>
                                    <AccessTimeIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                      }}
                                    />
                                    <Typography
                                      fontSize={12}
                                      color="text.secondary"
                                    >
                                      {formatEventTime(
                                        event.startDateTime,
                                        event.endDateTime
                                      )}
                                    </Typography>
                                  </FlexBox>
                                  <FlexBox alignItems="center" gap={0.5}>
                                    <PeopleIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                      }}
                                    />
                                    <Typography
                                      fontSize={12}
                                      color="text.secondary"
                                    >
                                      {event.participationsCount || 0}{" "}
                                      participants
                                    </Typography>
                                  </FlexBox>
                                </FlexBox>
                              </Box>

                              <Box textAlign="right">
                                <Typography
                                  fontSize={16}
                                  fontWeight={600}
                                  color="primary.main"
                                >
                                  {event.slots?.[0]?.eventTickets?.[0]?.price >
                                  0
                                    ? `₹${event.slots[0].eventTickets[0].price}`
                                    : "Free"}
                                </Typography>
                              </Box>
                            </FlexBetween>
                            <Box
                              textAlign="right"
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleViewEventDetails(event.id);
                                }}
                                size="small"
                                color="primary"
                                sx={{
                                  ml: 1,
                                  "&:hover": {
                                    backgroundColor: "primary.light",
                                    color: "white",
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </AccordionSummary>

                          <AccordionDetails sx={{ pt: 0 }}>
                            <Divider sx={{ mb: 2 }} />

                            {/* Quick Stats Overview */}
                            <Grid container spacing={2} mb={3}>
                              <Grid size={2}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 1.5, textAlign: "center" }}
                                >
                                  <EventSeatIcon
                                    color="primary"
                                    sx={{ fontSize: 18 }}
                                  />
                                  <Typography variant="h6" fontSize={14}>
                                    {event.slots?.length || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontSize={11}
                                  >
                                    Slots
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid size={2}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 1.5, textAlign: "center" }}
                                >
                                  <LocalOfferIcon
                                    color="primary"
                                    sx={{ fontSize: 18 }}
                                  />
                                  <Typography variant="h6" fontSize={14}>
                                    {event.coupons?.length || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontSize={11}
                                  >
                                    Coupons
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid size={2}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 1.5, textAlign: "center" }}
                                >
                                  <ShoppingCartIcon
                                    color="primary"
                                    sx={{ fontSize: 18 }}
                                  />
                                  <Typography variant="h6" fontSize={14}>
                                    {event.addOns?.length || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontSize={11}
                                  >
                                    Add-ons
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid size={2}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 1.5, textAlign: "center" }}
                                >
                                  <DescriptionIcon
                                    color="primary"
                                    sx={{ fontSize: 18 }}
                                  />
                                  <Typography variant="h6" fontSize={14}>
                                    {event.forms?.length || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontSize={11}
                                  >
                                    Forms
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid size={2}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 1.5, textAlign: "center" }}
                                >
                                  <AnnouncementIcon
                                    color="primary"
                                    sx={{ fontSize: 18 }}
                                  />
                                  <Typography variant="h6" fontSize={14}>
                                    {event.announcements?.length || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontSize={11}
                                  >
                                    Notices
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid size={2}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 1.5, textAlign: "center" }}
                                >
                                  <GroupIcon
                                    color="primary"
                                    sx={{ fontSize: 18 }}
                                  />
                                  <Typography variant="h6" fontSize={14}>
                                    {event.participations?.length || 0}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontSize={11}
                                  >
                                    Bookings
                                  </Typography>
                                </Card>
                              </Grid>
                            </Grid>

                            {/* Basic Info Section */}
                            <Grid container spacing={3} mb={3}>
                              <Grid size={6}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 2, height: "100%" }}
                                >
                                  <FlexBox alignItems="center" gap={1} mb={1}>
                                    <CalendarTodayIcon
                                      color="primary"
                                      sx={{ fontSize: 20 }}
                                    />
                                    <Typography fontWeight={600} fontSize={14}>
                                      Date & Time
                                    </Typography>
                                  </FlexBox>
                                  <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                    mb={0.5}
                                  >
                                    Start:{" "}
                                    {formatFullDateTime(event.startDateTime)}
                                  </Typography>
                                  <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                  >
                                    End: {formatFullDateTime(event.endDateTime)}
                                  </Typography>
                                  <Typography
                                    fontSize={12}
                                    color="primary.main"
                                    mt={1}
                                  >
                                    Duration:{" "}
                                    {calculateDuration(
                                      event.startDateTime,
                                      event.endDateTime
                                    )}
                                  </Typography>
                                </Card>
                              </Grid>

                              <Grid size={6}>
                                <Card
                                  variant="outlined"
                                  sx={{ p: 2, height: "100%" }}
                                >
                                  <FlexBox alignItems="center" gap={1} mb={1}>
                                    <LocationOnIcon
                                      color="primary"
                                      sx={{ fontSize: 20 }}
                                    />
                                    <Typography fontWeight={600} fontSize={14}>
                                      Location
                                    </Typography>
                                  </FlexBox>
                                  <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                  >
                                    {[
                                      event.location?.address?.trim(),
                                      event.location?.city?.trim(),
                                      event.location?.state?.trim(),
                                    ]
                                      .filter(Boolean)
                                      .join(", ") || "Location not specified"}
                                  </Typography>
                                </Card>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>

                    {/* Bottom Pagination */}
                    <Box mt={3} display="flex" justifyContent="center">
                      <Pagination
                        count={Math.ceil(
                          (organizerData?.events?.length || 0) / eventsPerPage
                        )}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                        size="medium"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  </>
                ) : (
                  <Card sx={{ p: 4, textAlign: "center", mt: 2 }}>
                    <EventIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Paragraph fontSize={16} color="text.secondary" mb={1}>
                      No events created yet
                    </Paragraph>
                    <Paragraph fontSize={14} color="text.secondary">
                      Create your first event to get started
                    </Paragraph>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => handleCreateEvent()}
                    >
                      Create Event
                    </Button>
                  </Card>
                )}
              </Div>
            </TabPanel>

            {/* TAB 3: CHALLENGES */}
         {/* TAB 3: CHALLENGES */}
<TabPanel value={activeTab} index={2}>
  <Div>
    <SectionHeader>
      <EmojiEventsIcon color="action" />
      <H6 fontSize={16}>
        Challenges ({organizerData?.challenges?.length || 0})
      </H6>
    </SectionHeader>

    {organizerData?.challenges?.length > 0 ? (
      <>
        {paginatedChallenges.map((challenge) => (
          <InfoCard key={challenge.id}>
            <Box p={2}>
              <FlexBetween mb={2}>
                <Box flex={1}>
                  <FlexBox alignItems="center" gap={1} mb={1}>
                    <Paragraph
                      fontWeight={600}
                      fontSize={16}
                      style={{ textTransform: "capitalize" }}
                    >
                      {challenge.title}
                    </Paragraph>
                    <StatusChip
                      style={{ textTransform: "capitalize" }}
                      label={challenge.approvalStatus}
                      status={challenge.approvalStatus}
                      size="small"
                    />
                     <Box
                              textAlign="right"
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleViewChallengeDetails(challenge.id);
                                }}
                                size="small"
                                color="primary"
                                sx={{
                                  ml: 1,
                                  "&:hover": {
                                    backgroundColor: "primary.light",
                                    color: "white",
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Box>
                  </FlexBox>
                  <div style={{ marginBottom: "8px" }}>
                    {challenge.banner && (
                      <img
                        src={challenge.banner}
                        alt="Challenge Banner"
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </div>
                </Box>
              </FlexBetween>

              <Paragraph
                fontSize={13}
                color="text.secondary"
                mb={2}
                style={{ textTransform: "capitalize" }}
                dangerouslySetInnerHTML={{
                  __html: challenge?.description || "",
                }}
              />
              
              <Grid container spacing={2} mb={2}>
                <Grid size={3}>
                  <Paragraph fontSize={12} color="text.secondary">
                    Type
                  </Paragraph>
                  <Paragraph
                    fontSize={13}
                    fontWeight={500}
                    style={{ textTransform: "capitalize" }}
                  >
                    {challenge.challengeType}
                  </Paragraph>
                </Grid>
                <Grid size={3}>
                  <Paragraph fontSize={12} color="text.secondary">
                    Duration
                  </Paragraph>
                  <Paragraph fontSize={13} fontWeight={500}>
                    {new Date(challenge.startDate).toLocaleDateString(
                      "en-GB"
                    )}{" "}
                    to{" "}
                    {new Date(challenge.endDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </Paragraph>
                </Grid>
                <Grid size={3}>
                  <Paragraph fontSize={12} color="text.secondary">
                    Target
                  </Paragraph>
                  <Paragraph fontSize={13} fontWeight={500}>
                    {challenge.targetValue} {challenge.targetUnit}
                  </Paragraph>
                </Grid>
                <Grid size={3}>
                  <Paragraph fontSize={12} color="text.secondary">
                    Max Reward
                  </Paragraph>
                  <Paragraph
                    fontSize={13}
                    fontWeight={500}
                    color="primary.main"
                  >
                    {challenge.maxRewardCoins} coins
                  </Paragraph>
                </Grid>
              </Grid>

              <FlexBox alignItems="center" gap={1}>
                <Chip
                  label={challenge.isActive ? "Active" : "Inactive"}
                  color={challenge.isActive ? "success" : "error"}
                  size="small"
                />
                <Paragraph fontSize={12} color="text.secondary">
                  Participants: {challenge.participationsCount || 0}
                </Paragraph>
              </FlexBox>
            </Box>
          </InfoCard>
        ))}

        {/* Pagination Controls */}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(
              (organizerData?.challenges?.length || 0) / challengesPerPage
            )}
            page={currentChallengesPage}
            onChange={(e, page) => setCurrentChallengesPage(page)}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </Box>
      </>
    ) : (
      <Paragraph fontSize={14} color="text.secondary">
        No challenges created yet.
      </Paragraph>
    )}
  </Div>
</TabPanel>

            {/* TAB 4: PRODUCTS & COUPONS */}
           {/* TAB 4: PRODUCTS & COUPONS */}
<TabPanel value={activeTab} index={3}>
  <Grid container spacing={3}>
    {/* PRODUCTS SECTION */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <ShoppingCartIcon color="action" />
          <H6 fontSize={16}>
            Products ({organizerData?.products?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.products?.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {paginatedProducts.map((product) => (
                <Grid size={12} key={product.id}>
                  <InfoCard>
                    <Box p={2}>
                      <FlexBox gap={2}>
                        {product.image && (
                          <img
                            src={product?.image}
                            alt={product.name}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <Box flex={1}>
                          <FlexBetween mb={1}>
                            <Paragraph
                              fontWeight={600}
                              fontSize={16}
                              style={{ textTransform: "capitalize" }}
                            >
                              {product.name}
                            </Paragraph>
                            <Box textAlign="right">
                              <Paragraph
                                fontWeight={600}
                                color="primary.main"
                                fontSize={16}
                              >
                                ₹{product.price}
                              </Paragraph>
                              <StatusChip
                                style={{
                                  textTransform: "capitalize",
                                }}
                                label={product.approvalStatus}
                                status={product.approvalStatus}
                                size="small"
                              />
                            </Box>
                          </FlexBetween>

                          <Paragraph
                            fontSize={13}
                            color="text.secondary"
                            mb={1}
                            style={{ textTransform: "capitalize" }}
                          >
                            {product.description}
                          </Paragraph>

                          <FlexBetween>
                            <Chip
                              style={{ textTransform: "capitalize" }}
                              label={product.category?.name}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={
                                product.isActive
                                  ? "Active"
                                  : "Inactive"
                              }
                              color={
                                product.isActive ? "success" : "error"
                              }
                              size="small"
                            />
                          </FlexBetween>
                        </Box>
                      </FlexBox>
                    </Box>
                  </InfoCard>
                </Grid>
              ))}
            </Grid>

            {/* Products Pagination */}
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.products?.length || 0) / productsPerPage
                )}
                page={currentProductsPage}
                onChange={(e, page) => setCurrentProductsPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No products created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>

    {/* COUPONS SECTION */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <LocalOfferIcon color="action" />
          <H6 fontSize={16}>
            Coupons ({organizerData?.coupons?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.coupons?.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {paginatedCoupons.map((coupon) => (
                <Grid size={12} key={coupon.id}>
                  <InfoCard>
                    <Box p={2}>
                      <FlexBetween mb={2}>
                        <Box>
                          <Paragraph
                            fontWeight={600}
                            color="primary.main"
                            fontSize={16}
                          >
                            {coupon.code}
                          </Paragraph>
                          <Paragraph
                            fontSize={13}
                            color="text.secondary"
                            mt={0.5}
                            style={{ textTransform: "capitalize" }}
                          >
                            {coupon.description}
                          </Paragraph>
                        </Box>
                        <Box textAlign="right">
                          <Chip
                            label={`${coupon.discountValue}% OFF`}
                            color="secondary"
                            size="small"
                            style={{ textTransform: "capitalize" }}
                          />
                          <Box mt={1}>
                            <StatusChip
                              label={coupon.approvalStatus}
                              status={coupon.approvalStatus}
                              size="small"
                              style={{ textTransform: "capitalize" }}
                            />
                          </Box>
                        </Box>
                      </FlexBetween>

                      <Grid container spacing={2}>
                        <Grid size={4}>
                          <Paragraph
                            fontSize={12}
                            color="text.secondary"
                          >
                            Usage
                          </Paragraph>
                          <Paragraph fontSize={13} fontWeight={500}>
                            {coupon.usageCount}/{coupon.usageLimit}
                          </Paragraph>
                        </Grid>
                        <Grid size={4}>
                          <Paragraph
                            fontSize={12}
                            color="text.secondary"
                          >
                            Min Purchase
                          </Paragraph>
                          <Paragraph fontSize={13} fontWeight={500}>
                            ₹{coupon.minimumPurchase}
                          </Paragraph>
                        </Grid>
                        <Grid size={4}>
                          <Paragraph
                            fontSize={12}
                            color="text.secondary"
                          >
                            Valid Until
                          </Paragraph>
                          <Paragraph fontSize={13} fontWeight={500}>
                            {new Date(
                              coupon.endTimeStamp
                            ).toLocaleDateString()}
                          </Paragraph>
                        </Grid>
                      </Grid>
                    </Box>
                  </InfoCard>
                </Grid>
              ))}
            </Grid>

            {/* Coupons Pagination */}
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.coupons?.length || 0) / couponsPerPage
                )}
                page={currentCouponsPage}
                onChange={(e, page) => setCurrentCouponsPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No coupons created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>

    {/* PRODUCT CATEGORIES - keeping as is since it's usually a smaller list */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <CategoryIcon color="action" />
          <H6 fontSize={16}>
            Product Categories (
            {organizerData?.productCategories?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.productCategories?.length > 0 ? (
          <Grid container spacing={2}>
            {organizerData.productCategories.map((category) => (
              <Grid size={6} key={category.id}>
                <Box
                  p={2}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                  }}
                >
                  <FlexBetween>
                    <Box style={{ height: "130px" }}>
                      <Paragraph
                        fontWeight={500}
                        style={{ textTransform: "capitalize" }}
                      >
                        {category.name}
                      </Paragraph>
                      <Paragraph
                        fontSize={12}
                        color="text.secondary"
                        style={{ textTransform: "capitalize" }}
                      >
                        {category.description}
                      </Paragraph>
                    </Box>
                    <StatusChip
                      style={{ textTransform: "capitalize" }}
                      label={category.approvalStatus}
                      status={category.approvalStatus}
                      size="small"
                    />
                  </FlexBetween>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No product categories created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>
  </Grid>
</TabPanel>

            {/* TAB 5: TEMPLATES & POLICIES */}
           {/* TAB 5: TEMPLATES & POLICIES */}
<TabPanel value={activeTab} index={4}>
  <Grid container spacing={3}>
    {/* TICKET TEMPLATES */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <ConfirmationNumberIcon color="action" />
          <H6 fontSize={16}>
            Ticket Templates (
            {organizerData?.ticketTemplates?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.ticketTemplates?.length > 0 ? (
          <>
            {paginatedTicketTemplates.map((template) => (
              <InfoCard key={template.id} sx={{ mb: 2 }}>
                <Box p={2}>
                  <FlexBetween mb={1}>
                    <Box>
                      <Paragraph
                        fontWeight={600}
                        fontSize={15}
                        style={{ textTransform: "capitalize" }}
                      >
                        {template.ticketType?.title}
                      </Paragraph>
                      <Paragraph
                        fontSize={13}
                        color="text.secondary"
                        style={{ textTransform: "capitalize" }}
                      >
                        {template.description}
                      </Paragraph>
                    </Box>
                    <Box textAlign="right">
                      <StatusChip
                        style={{ textTransform: "capitalize" }}
                        label={template.approvalStatus}
                        status={template.approvalStatus}
                        size="small"
                      />
                    </Box>
                  </FlexBetween>

                  <Grid container spacing={2}>
                    <Grid size={3}>
                      <Paragraph fontSize={12} color="text.secondary">
                        Age Range
                      </Paragraph>
                      <Paragraph fontSize={13} fontWeight={500}>
                        {template.minAge} - {template.maxAge} years
                      </Paragraph>
                    </Grid>
                    {/* <Grid size={3}>
                      <Paragraph fontSize={12} color="text.secondary">
                        Quantity
                      </Paragraph>
                      <Paragraph fontSize={13} fontWeight={500}>
                        {template.quantity}
                      </Paragraph>
                    </Grid> */}
                    <Grid size={3}>
                      <Paragraph fontSize={12} color="text.secondary">
                        Status
                      </Paragraph>
                      <Chip
                        label={
                          template.isActive ? "Active" : "Inactive"
                        }
                        color={
                          template.isActive ? "success" : "error"
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid size={3}>
                      <Paragraph fontSize={12} color="text.secondary">
                        Reviewed By
                      </Paragraph>
                      <Paragraph fontSize={13} fontWeight={500}>
                        {template.reviewedBy || "Not reviewed"}
                      </Paragraph>
                    </Grid>
                  </Grid>
                </Box>
              </InfoCard>
            ))}

            {/* Ticket Templates Pagination */}
            <Box mt={3} mb={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.ticketTemplates?.length || 0) / ticketTemplatesPerPage
                )}
                page={currentTicketTemplatesPage}
                onChange={(e, page) => setCurrentTicketTemplatesPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No ticket templates created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>

    {/* TICKET TYPES */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <LabelIcon color="action" />
          <H6 fontSize={16}>
            Ticket Types ({organizerData?.ticketTypes?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.ticketTypes?.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {paginatedTicketTypes.map((ticketType) => (
                <Grid size={6} key={ticketType.id}>
                  <InfoCard>
                    <Box p={2}>
                      <FlexBetween mb={1}>
                        <Box>
                          <Paragraph fontWeight={500}>
                            {ticketType.title}
                          </Paragraph>
                          <Paragraph
                            fontSize={12}
                            color="text.secondary"
                          >
                            {ticketType.description}
                          </Paragraph>
                        </Box>
                        <Box textAlign="right">
                          <StatusChip
                            label={ticketType.approvalStatus}
                            status={ticketType.approvalStatus}
                            size="small"
                          />
                          <Box mt={0.5}>
                            <Chip
                              label={
                                ticketType.isActive
                                  ? "Active"
                                  : "Inactive"
                              }
                              color={
                                ticketType.isActive
                                  ? "success"
                                  : "error"
                              }
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </FlexBetween>
                      <Paragraph fontSize={11} color="text.secondary">
                        Created: {formatDate(ticketType.createdAt)}
                      </Paragraph>
                    </Box>
                  </InfoCard>
                </Grid>
              ))}
            </Grid>

            {/* Ticket Types Pagination */}
            <Box mt={3} mb={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.ticketTypes?.length || 0) / ticketTypesPerPage
                )}
                page={currentTicketTypesPage}
                onChange={(e, page) => setCurrentTicketTypesPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No ticket types created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>

    {/* FAQ SECTION */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <HelpIcon color="action" />
          <H6 fontSize={16}>
            Frequently Asked Questions (
            {organizerData?.frequentlyAskedQuestions?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.frequentlyAskedQuestions?.length > 0 ? (
          <>
            {paginatedFAQ.map((faq) => (
              <Accordion key={faq.id} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                  }}
                >
                  <Paragraph fontWeight={500}>
                    {faq.question}
                  </Paragraph>
                  <StatusChip
                    label={faq.approvalStatus}
                    status={faq.approvalStatus}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Paragraph color="text.secondary" mb={2}>
                    {faq.answer}
                  </Paragraph>
                  <Box>
                    <Chip
                      label={faq.isActive ? "Active" : "Inactive"}
                      color={faq.isActive ? "success" : "error"}
                      size="small"
                    />
                    {faq.reviewReason && (
                      <Paragraph
                        fontSize={11}
                        color="text.secondary"
                        mt={1}
                      >
                        Review: {faq.reviewReason}
                      </Paragraph>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* FAQ Pagination */}
            <Box mt={3} mb={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.frequentlyAskedQuestions?.length || 0) / faqPerPage
                )}
                page={currentFAQPage}
                onChange={(e, page) => setCurrentFAQPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={13} color="text.secondary">
            No FAQs created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>

    {/* TERMS AND CONDITIONS */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <PolicyIcon color="action" />
          <H6 fontSize={16}>
            Terms & Conditions (
            {organizerData?.termsAndConditions?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.termsAndConditions?.length > 0 ? (
          <>
            {paginatedTnC.map((terms, index) => (
              <InfoCard key={terms.id} sx={{ mb: 2 }}>
                <Box p={2}>
                  <FlexBetween mb={2}>
                    <Paragraph fontWeight={600} fontSize={15}>
                      Terms & Conditions #{((currentTnCPage - 1) * tncPerPage) + index + 1}
                    </Paragraph>
                    <Box textAlign="right">
                      <StatusChip
                        label={terms.approvalStatus}
                        status={terms.approvalStatus}
                        size="small"
                        style={{textTransform:"capitalize"}}
                      />
                      <Box mt={0.5}>
                        <Chip
                          label={
                            terms.isActive ? "Active" : "Inactive"
                          }
                          color={terms.isActive ? "success" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </FlexBetween>
                  <Paragraph
                    fontSize={14}
                    color="text.secondary"
                    lineHeight={1.6}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {terms.content}
                  </Paragraph>
                  <Paragraph
                    fontSize={11}
                    color="text.secondary"
                    mt={2}
                  >
                    Created: {formatDate(terms.createdAt)}
                    {terms.updatedAt &&
                      ` • Updated: ${formatDate(terms.updatedAt)}`}
                  </Paragraph>
                </Box>
              </InfoCard>
            ))}

            {/* Terms & Conditions Pagination */}
            <Box mt={3} mb={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.termsAndConditions?.length || 0) / tncPerPage
                )}
                page={currentTnCPage}
                onChange={(e, page) => setCurrentTnCPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No terms and conditions created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>

    {/* PRIVACY POLICIES */}
    <Grid size={12}>
      <Div>
        <SectionHeader>
          <SecurityIcon color="action" />
          <H6 fontSize={16}>
            Privacy Policies (
            {organizerData?.privacyPolicies?.length || 0})
          </H6>
        </SectionHeader>

        {organizerData?.privacyPolicies?.length > 0 ? (
          <>
            {paginatedPrivacy.map((policy, index) => (
              <InfoCard key={policy.id} sx={{ mb: 2 }}>
                <Box p={2}>
                  <FlexBetween mb={2}>
                    <Paragraph fontWeight={600} fontSize={15}>
                      Privacy Policy #{((currentPrivacyPage - 1) * privacyPerPage) + index + 1}
                    </Paragraph>
                    <Box textAlign="right">
                      <StatusChip
                        label={policy.approvalStatus}
                        status={policy.approvalStatus}
                        size="small"
                        style={{textTransform:"capitalize"}}
                      />
                      <Box mt={0.5}>
                        <Chip
                          label={
                            policy.isActive ? "Active" : "Inactive"
                          }
                          color={
                            policy.isActive ? "success" : "error"
                          }
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </FlexBetween>
                  <Paragraph
                    fontSize={14}
                    color="text.secondary"
                    lineHeight={1.6}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {policy.content}
                  </Paragraph>
                  {policy.reviewReason && (
                    <Box
                      mt={2}
                      p={1}
                      sx={{
                        backgroundColor: "#fff3cd",
                        borderRadius: 1,
                      }}
                    >
                      <Paragraph fontSize={12} color="text.secondary">
                        Review Reason: {policy.reviewReason}
                      </Paragraph>
                    </Box>
                  )}
                  <Paragraph
                    fontSize={11}
                    color="text.secondary"
                    mt={2}
                  >
                    Created: {formatDate(policy.createdAt)}
                    {policy.updatedAt &&
                      ` • Updated: ${formatDate(policy.updatedAt)}`}
                    {policy.reviewedBy &&
                      ` • Reviewed by: ${policy.reviewedBy}`}
                  </Paragraph>
                </Box>
              </InfoCard>
            ))}

            {/* Privacy Policies Pagination */}
            <Box mt={3} mb={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(
                  (organizerData?.privacyPolicies?.length || 0) / privacyPerPage
                )}
                page={currentPrivacyPage}
                onChange={(e, page) => setCurrentPrivacyPage(page)}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paragraph fontSize={14} color="text.secondary">
            No privacy policies created yet.
          </Paragraph>
        )}
      </Div>
    </Grid>
  </Grid>
</TabPanel>
          </Card>
        </Grid>

        {/* RIGHT COLUMN - SUMMARY CARDS */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Grid container spacing={3}>
            {/* ORGANIZER SUMMARY */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <PersonIcon color="action" />
                    <Paragraph fontWeight={600}>Organizer Summary</Paragraph>
                  </SectionHeader>

                  <FlexBox alignItems="center" gap={1.5} mb={2}>
                    <StyledAvatar
                      alt="Organizer Logo"
                      src={organizerData?.companyLogo}
                      sx={{ width: 60, height: 60 }}
                    />
                    <div>
                      <Paragraph
                        fontWeight={500}
                        style={{ textTransform: "capitalize" }}
                      >
                        {organizerData?.name}
                      </Paragraph>
                      <Paragraph
                        fontSize={13}
                        color="text.secondary"
                        style={{ textTransform: "capitalize" }}
                      >
                        {organizerData?.companyName}
                      </Paragraph>
                      <Paragraph fontSize={12} color="text.secondary">
                        {organizerData?.email}
                      </Paragraph>
                    </div>
                  </FlexBox>

                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Box
                        textAlign="center"
                        p={1}
                        sx={{ backgroundColor: "#f0f8ff", borderRadius: 1 }}
                      >
                        <Paragraph
                          fontSize={18}
                          fontWeight={600}
                          color="primary.main"
                        >
                          {organizerData?.commission}%
                        </Paragraph>
                        <Paragraph fontSize={11} color="text.secondary">
                          Commission
                        </Paragraph>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        textAlign="center"
                        p={1}
                        sx={{
                          backgroundColor: organizerData?.isActive
                            ? "#f0fff4"
                            : "#fff5f5",
                          borderRadius: 1,
                        }}
                      >
                        <Paragraph
                          fontSize={14}
                          fontWeight={600}
                          color={
                            organizerData?.isActive
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {organizerData?.isActive ? "Active" : "Inactive"}
                        </Paragraph>
                        <Paragraph fontSize={11} color="text.secondary">
                          Status
                        </Paragraph>
                      </Box>
                    </Grid>
                  </Grid>
                </Div>
              </Card>
            </Grid>

            {/* QUICK STATS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <BusinessIcon color="action" />
                    <Paragraph fontWeight={600}>Quick Statistics</Paragraph>
                  </SectionHeader>

                  <Stack spacing={2}>
                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Total Events:
                      </Paragraph>
                      <Paragraph
                        fontSize={14}
                        fontWeight={500}
                        color="primary.main"
                      >
                        {organizerData?.events?.filter((e) => !e.deletedAt)
                          .length || 0}
                      </Paragraph>
                    </FlexBetween>

                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Active Events:
                      </Paragraph>
                      <Paragraph
                        fontSize={14}
                        fontWeight={500}
                        color="success.main"
                      >
                        {organizerData?.events?.filter(
                          (e) => e.isActive && !e.deletedAt
                        ).length || 0}
                      </Paragraph>
                    </FlexBetween>

                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Total Challenges:
                      </Paragraph>
                      <Paragraph
                        fontSize={14}
                        fontWeight={500}
                        color="warning.main"
                      >
                        {organizerData?.challenges?.filter((c) => !c.deletedAt)
                          .length || 0}
                      </Paragraph>
                    </FlexBetween>

                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Total Products:
                      </Paragraph>
                      <Paragraph
                        fontSize={14}
                        fontWeight={500}
                        color="info.main"
                      >
                        {organizerData?.products?.filter((p) => !p.deletedAt)
                          .length || 0}
                      </Paragraph>
                    </FlexBetween>

                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Active Coupons:
                      </Paragraph>
                      <Paragraph
                        fontSize={14}
                        fontWeight={500}
                        color="primary.700"
                      >
                        {organizerData?.coupons?.filter(
                          (c) => c.isActive && !c.deletedAt
                        ).length || 0}
                      </Paragraph>
                    </FlexBetween>

                    <Divider />

                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Status:
                      </Paragraph>
                      <Chip
                        label={organizerData?.isActive ? "Active" : "Inactive"}
                        color={organizerData?.isActive ? "success" : "error"}
                        size="small"
                      />
                    </FlexBetween>
                  </Stack>
                </Div>
              </Card>
            </Grid>

            {/* RECENT ACTIVITY */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <EventIcon color="action" />
                    <Paragraph fontWeight={600}>Recent Activity</Paragraph>
                  </SectionHeader>

                  <Stack spacing={2}>
                    {organizerData?.events?.slice(0, 3).map((event, index) => (
                      <Box key={event.id}>
                        <FlexBox alignItems="center" gap={1} mb={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: event.isActive
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                          <Paragraph
                            fontSize={13}
                            fontWeight={500}
                            style={{ textTransform: "capitalize" }}
                          >
                            {event.title}
                          </Paragraph>
                        </FlexBox>
                        <Paragraph
                          fontSize={11}
                          color="text.secondary"
                          ml={2}
                          style={{ textTransform: "capitalize" }}
                        >
                          {event.date} • {event.approvalStatus}
                        </Paragraph>
                        {index < 2 && <Divider sx={{ my: 1 }} />}
                      </Box>
                    ))}

                    {(!organizerData?.events ||
                      organizerData.events.length === 0) && (
                      <Paragraph fontSize={13} color="text.secondary">
                        No recent activity
                      </Paragraph>
                    )}
                  </Stack>
                </Div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
