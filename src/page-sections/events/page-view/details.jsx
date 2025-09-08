import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import AvatarGroup from "@mui/material/AvatarGroup";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "@mui/material/styles/styled";
import CircularProgress from "@mui/material/CircularProgress";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HelpIcon from "@mui/icons-material/Help";
import PolicyIcon from "@mui/icons-material/Policy";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import ObstacleIcon from "@mui/icons-material/Terrain";
import FitnessIcon from "@mui/icons-material/FitnessCenter";
import PublicIcon from "@mui/icons-material/Public";
import LanguageIcon from "@mui/icons-material/Language";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

// CUSTOM COMPONENTS
import MoreButton from "@/components/more-button";
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getEventsById } from "../../../store/apps/events";
import { toast } from "react-hot-toast";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import {
  CardContent,
  CardHeader,
  Stack,
  Tabs,
  Typography,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { formatDate } from "@/utils/dateFormatter";

const StyledAvatar = styled(Avatar)({
  width: 34,
  height: 34,
});

const Div = styled("div")({
  padding: "1.5rem",
});

const RightContentWrapper = styled("div")({
  gap: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "& .MuiPaper-root": {
    padding: "1.5rem",
  },
});

const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  width: "100%",
  paddingBottom: "1rem",
  alignItems: "flex-start",
  "& .MuiRadio-root": {
    padding: 0,
    paddingRight: 10,
  },
  "&:last-child": {
    paddingBottom: 0,
  },
});

const SectionHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1rem",
});

const InfoCard = styled(Card)({
  marginBottom: 0,
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

const InfoRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.75rem",
  "& .label": {
    fontSize: "13px",
    color: "#666",
    minWidth: "140px",
  },
  "& .value": {
    fontSize: "14px",
    fontWeight: 500,
  },
});

export default function EventsDetailsPageView() {
  const dispatch = useDispatch();
  const { allEvents } = useSelector((state) => state.events);

  const [eventsData, setEventsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();

  function TabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  function getCouponStatus(coupon) {
    const today = new Date();
    const start = new Date(coupon?.startTimeStamp);
    const end = new Date(coupon?.endTimeStamp);

    let statusText = "";
    let statusColor = "text.secondary";
    let style = {};

    if (today < start) {
      statusText = `Applicable from: ${start.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    } else if (today > end) {
      statusText = "Expired";
      statusColor = "text.disabled";
      style = { opacity: 0.5 };
    } else {
      statusText = `Expiring on: ${end.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }

    return { statusText, statusColor, style };
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getEventsById(id))
        .then((response) => {
          if (response?.payload) {
            setEventsData(response?.payload);
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          toast.error("Failed to fetch event details");
        })
        .finally(() => setLoading(false));
    } else {
      console.error("No event ID found");
      toast.error("No event selected");
      navigate("/events");
    }
  }, [dispatch, id, navigate]);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  const handleClickonSlots = (slotId) => {
    navigate(`/events/eventticket-details/${slotId}`, {
      state: { event: eventsData },
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
                aria-label="event details tabs"
                style={{ padding: "10px" }}
              >
                <Tab label="Overview" />
                <Tab label="Slots & Tickets" />
                <Tab label="Coupons & Add-ons" />
                <Tab label="Forms & Participants" />
              </Tabs>
            </Box>

            {/* TAB 1: OVERVIEW */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                {/* MAIN EVENT INFO */}
                <Grid size={12}>
                  <Div>
                    <FlexBetween mb={2} style={{ textTransform: "capitalize" }}>
                      <H6 fontSize={18}>{eventsData?.title?.toUpperCase()}</H6>
                      <StatusChip
                        label={eventsData?.approvalStatus || "Pending"}
                        status={eventsData?.approvalStatus}
                        size="small"
                      />
                    </FlexBetween>

                    {/* Event Banner */}
                    <div
                      style={{ textAlign: "center", marginBottom: "1.5rem" }}
                    >
                      <img
                        src={eventsData?.desktopCoverImage}
                        alt="Event Banner"
                        style={{
                          borderRadius: "15px",
                          height: "200px",
                          maxWidth: "100%",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    </div>

                    {/* Event Description */}
                    <Box mb={2}>
                      <Paragraph
                        fontSize={16}
                        lineHeight={1.6}
                        color="text.primary"
                        dangerouslySetInnerHTML={{
                          __html: eventsData?.description,
                        }}
                      />
                    </Box>

                    {/* Event Details Grid */}
                    <Grid container spacing={2} mb={3}>
                      <Grid size={6}>
                        <InfoRow>
                          <CategoryIcon fontSize="small" color="action" />
                          <span className="label">Type:</span>
                          <span className="value" style={{ textTransform: "capitalize" }}>
                            {eventsData?.type?.replace("_", " ") || "N/A"}
                          </span>
                        </InfoRow>
                      </Grid>
                      <Grid size={6}>
                        <InfoRow>
                          <LanguageIcon fontSize="small" color="action" />
                          <span className="label">Language:</span>
                          <span className="value">{eventsData?.language || "N/A"}</span>
                        </InfoRow>
                      </Grid>
                      <Grid size={6}>
                        <InfoRow>
                          <VisibilityIcon fontSize="small" color="action" />
                          <span className="label">Visibility:</span>
                          <span className="value" style={{ textTransform: "capitalize" }}>
                            {eventsData?.visibility || "N/A"}
                          </span>
                        </InfoRow>
                      </Grid>
                      <Grid size={6}>
                        <InfoRow>
                          <StarIcon fontSize="small" color="action" />
                          <span className="label">Featured:</span>
                          <span className="value">
                            {eventsData?.featuredEvent ? "Yes" : "No"}
                          </span>
                        </InfoRow>
                      </Grid>
                      <Grid size={6}>
                        <InfoRow>
                          <PublicIcon fontSize="small" color="action" />
                          <span className="label">Status:</span>
                          <Chip
                            label={eventsData?.status || "Draft"}
                            size="small"
                            color={eventsData?.status === "published" ? "success" : "default"}
                          />
                        </InfoRow>
                      </Grid>
                      <Grid size={6}>
                        <InfoRow>
                          <AttachMoneyIcon fontSize="small" color="action" />
                          <span className="label">Coins Discount:</span>
                          <span className="value">
                            {eventsData?.coinsDiscountPercentage || 0}%
                          </span>
                        </InfoRow>
                      </Grid>
                    </Grid>

                    {/* Date and Time */}
                    <Box mb={3}>
                      <SectionHeader>
                        <AccessTimeIcon color="primary" />
                        <H6 fontSize={16}>Event Schedule</H6>
                      </SectionHeader>
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Paragraph fontSize={12} color="text.secondary">
                            Start Date & Time
                          </Paragraph>
                          <Paragraph fontWeight={500}>
                            {eventsData?.startDateTime
                              ? new Date(eventsData.startDateTime).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </Paragraph>
                        </Grid>
                        <Grid size={6}>
                          <Paragraph fontSize={12} color="text.secondary">
                            End Date & Time
                          </Paragraph>
                          <Paragraph fontWeight={500}>
                            {eventsData?.endDateTime
                              ? new Date(eventsData.endDateTime).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </Paragraph>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Fee Information */}
                    <Box mb={3}>
                      <SectionHeader>
                        <AttachMoneyIcon color="action" />
                        <H6 fontSize={16}>Fee Structure</H6>
                      </SectionHeader>
                      <Grid container spacing={2}>
                        <Grid size={4}>
                          <Paragraph fontSize={12} color="text.secondary">
                            Platform Fee Paid By
                          </Paragraph>
                          <Paragraph fontWeight={500} style={{ textTransform: "capitalize" }}>
                            {eventsData?.platformFeePayBy || "N/A"}
                          </Paragraph>
                        </Grid>
                        <Grid size={4}>
                          <Paragraph fontSize={12} color="text.secondary">
                            Gateway Fee Paid By
                          </Paragraph>
                          <Paragraph fontWeight={500} style={{ textTransform: "capitalize" }}>
                            {eventsData?.gatewayFeePayBy || "N/A"}
                          </Paragraph>
                        </Grid>
                        <Grid size={4}>
                          <Paragraph fontSize={12} color="text.secondary">
                            GST for Event
                          </Paragraph>
                          <Paragraph fontWeight={500}>
                            {eventsData?.gstForEvent || 0}%
                          </Paragraph>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Event Settings */}
                    {eventsData?.settings && (
                      <Box mb={3}>
                        <SectionHeader>
                          <SettingsIcon color="action" />
                          <H6 fontSize={16}>Event Settings</H6>
                        </SectionHeader>
                        <Grid container spacing={2}>
                          <Grid size={12}>
                            <InfoRow>
                              <span className="label">Refund Policy:</span>
                              <span className="value">
                                {eventsData.settings.refundPolicy || "No refund policy"}
                              </span>
                            </InfoRow>
                          </Grid>
                          <Grid size={6}>
                            <InfoRow>
                              <span className="label">Reminder Days:</span>
                              <span className="value">
                                {eventsData.settings.reminderDays?.join(", ") || "None"} days before
                              </span>
                            </InfoRow>
                          </Grid>
                          <Grid size={6}>
                            <InfoRow>
                              <span className="label">Cancellation Deadline:</span>
                              <span className="value">
                                {eventsData.settings.cancellationDeadline || 0} hours
                              </span>
                            </InfoRow>
                          </Grid>
                          <Grid size={6}>
                            <InfoRow>
                              <span className="label">Send Reminder Email:</span>
                              <span className="value">
                                {eventsData.settings.sendReminderEmail ? "Yes" : "No"}
                              </span>
                            </InfoRow>
                          </Grid>
                          <Grid size={6}>
                            <InfoRow>
                              <span className="label">Send Confirmation Email:</span>
                              <span className="value">
                                {eventsData.settings.sendConfirmationEmail ? "Yes" : "No"}
                              </span>
                            </InfoRow>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Location */}
                    <Box mb={3}>
                      <SectionHeader>
                        <LocationOnIcon color="primary" />
                        <H6 fontSize={16}>Location Details</H6>
                      </SectionHeader>
                      <Grid container spacing={2}>
                        <Grid size={12}>
                          <Paragraph fontWeight={500}>
                            {eventsData?.location?.address || "Location not specified"}
                          </Paragraph>
                          <Paragraph fontSize={13} color="text.secondary">
                            {eventsData?.location?.city}, {eventsData?.location?.state}
                          </Paragraph>
                        </Grid>
                        {eventsData?.location?.additionalInstructions && (
                          <Grid size={12}>
                            <InfoRow>
                              <span className="label">Instructions:</span>
                              <span className="value">
                                {eventsData.location.additionalInstructions}
                              </span>
                            </InfoRow>
                          </Grid>
                        )}
                        {eventsData?.location?.platform && (
                          <Grid size={6}>
                            <InfoRow>
                              <span className="label">Platform:</span>
                              <span className="value">{eventsData.location.platform}</span>
                            </InfoRow>
                          </Grid>
                        )}
                        {eventsData?.location?.link && (
                          <Grid size={6}>
                            <InfoRow>
                              <span className="label">Link:</span>
                              <span className="value">
                                <a href={eventsData.location.link} target="_blank" rel="noopener noreferrer">
                                  Join Event
                                </a>
                              </span>
                            </InfoRow>
                          </Grid>
                        )}
                      </Grid>
                    </Box>

                    {/* Status and Review */}
                    <Box mb={3}>
                      <FlexBox alignItems="center" gap={2}>
                        <Chip
                          label={eventsData?.isActive ? "Active" : "Inactive"}
                          color={eventsData?.isActive ? "success" : "error"}
                          size="small"
                        />
                        {eventsData?.reviewReason && (
                          <Paragraph fontSize={12} color="text.secondary">
                            Review: {eventsData?.reviewReason}
                          </Paragraph>
                        )}
                      </FlexBox>
                    </Box>
                  </Div>
                </Grid>

                {/* PARTICIPATION SECTION */}
                {eventsData?.participation && (
                  <Grid size={12}>
                    <Div>
                      <SectionHeader>
                        <GroupIcon color="action" />
                        <H6 fontSize={16}>Participation Guidelines</H6>
                      </SectionHeader>
                      <Paragraph
                        lineHeight={1.6}
                        color="text.secondary"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {eventsData?.participation?.content || eventsData?.participation || "No participation guidelines available."}
                      </Paragraph>
                    </Div>
                  </Grid>
                )}

                {/* OBSTACLES SECTION */}
                {eventsData?.obstacles && (
                  <Grid size={12}>
                    <Div>
                      <SectionHeader>
                        <ObstacleIcon color="action" />
                        <H6 fontSize={16}>Obstacles & Challenges</H6>
                      </SectionHeader>
                      <Paragraph
                        lineHeight={1.6}
                        color="text.secondary"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {eventsData?.obstacles?.content || eventsData?.obstacles || "No obstacle information available."}
                      </Paragraph>
                    </Div>
                  </Grid>
                )}

                {/* ENDURANCE LEVEL SECTION */}
                {eventsData?.enduranceLevel && (
                  <Grid size={12}>
                    <Div>
                      <SectionHeader>
                        <FitnessIcon color="action" />
                        <H6 fontSize={16}>Endurance Level Requirements</H6>
                      </SectionHeader>
                      <Paragraph
                        lineHeight={1.6}
                        color="text.secondary"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {eventsData?.enduranceLevel?.content || eventsData?.enduranceLevel || "No endurance level information available."}
                      </Paragraph>
                    </Div>
                  </Grid>
                )}

                {/* TERMS AND CONDITIONS */}
                {eventsData?.termsAndCondition && (
                  <Grid size={12}>
                    <Div>
                      <SectionHeader>
                        <PolicyIcon color="action" />
                        <H6 fontSize={16}>Terms & Conditions</H6>
                      </SectionHeader>
                      <Paragraph
                        lineHeight={1.6}
                        color="text.secondary"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {eventsData?.termsAndCondition?.content || "No terms and conditions available."}
                      </Paragraph>
                    </Div>
                  </Grid>
                )}

                {/* PRIVACY POLICY */}
                {eventsData?.privacyPolicy && (
                  <Grid size={12}>
                    <Div>
                      <SectionHeader>
                        <SecurityIcon color="action" />
                        <H6 fontSize={16}>Privacy Policy</H6>
                      </SectionHeader>
                      <Paragraph
                        lineHeight={1.6}
                        color="text.secondary"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {eventsData?.privacyPolicy?.content || "No privacy policy available."}
                      </Paragraph>
                    </Div>
                  </Grid>
                )}

                {/* FAQ SECTION */}
                <Grid size={12}>
                  <Div>
                    <SectionHeader>
                      <HelpIcon color="action" />
                      <H6 fontSize={16}>Frequently Asked Questions</H6>
                    </SectionHeader>

                    {eventsData?.frequentlyAskedQuestions?.length > 0 ? (
                      eventsData.frequentlyAskedQuestions.map((faq, index) => (
                        <Accordion key={faq.id} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Paragraph fontWeight={500}>{faq.question}</Paragraph>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Paragraph color="text.secondary">{faq.answer}</Paragraph>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <Paragraph fontSize={13} color="text.secondary">
                        No FAQs available.
                      </Paragraph>
                    )}
                  </Div>
                </Grid>

                {/* META DATA */}
                <Grid size={12}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                      Information
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Created By
                            </Typography>
                            <Typography variant="body2" style={{ textTransform: "capitalize" }}>
                              {eventsData.createdBy || "System"}
                              {eventsData.createdByRole && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {" "}
                                  • {eventsData.createdByRole}
                                </Typography>
                              )}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Created On
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(eventsData.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={2}>
                          {eventsData.updatedBy && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Updated By
                              </Typography>
                              <Typography variant="body2" style={{ textTransform: "capitalize" }}>
                                {eventsData.updatedBy}
                                {eventsData.updatedByRole && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {" "}
                                    • {eventsData.updatedByRole}
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                          )}

                          {eventsData?.updatedAt && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Updated On
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(eventsData?.updatedAt)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 2: SLOTS & TICKETS */}
            <TabPanel value={activeTab} index={1}>
              <Div>
                <SectionHeader>
                  <AccessTimeIcon color="action" />
                  <H6 fontSize={16}>Event Slots & Tickets</H6>
                </SectionHeader>

                {eventsData?.slots?.length > 0 ? (
                  eventsData.slots.map((slot, index) => (
                    <InfoCard key={slot.id} sx={{ mb: 2 }}>
                      <Box p={2} style={{ cursor: "pointer" }} onClick={() => handleClickonSlots(slot.id)}>
                        <FlexBetween mb={2}>
                          <Box>
                            <Paragraph fontWeight={600} fontSize={16}>
                              {slot.name || `Slot ${index + 1}`}
                            </Paragraph>
                            <Paragraph color="text.secondary" fontSize={14}>
                              {new Date(slot.startDateTime).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(slot.endDateTime).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Paragraph>
                          </Box>
                          <Box textAlign="right">
                            <Chip
                              label={slot.isActive ? "Active" : "Inactive"}
                              color={slot.isActive ? "primary" : "default"}
                              size="small"
                              variant="outlined"
                            />
                            <Box mt={1}>
                              <Chip
                                label={slot.approvalStatus || "Pending"}
                                color={slot.approvalStatus === "approved" ? "success" : "warning"}
                                size="small"
                              />
                            </Box>
                          </Box>
                        </FlexBetween>

                        <Divider sx={{ my: 2 }} />

                        {slot.eventTickets?.length > 0 ? (
                          <Box>
                            <Paragraph fontSize={14} fontWeight={500} mb={2}>
                              Available Tickets:
                            </Paragraph>
                            <Grid container spacing={2}>
                              {slot.eventTickets.map((ticket) => (
                                <Grid size={12} key={ticket.id}>
                                  <Box
                                    sx={{
                                      border: "1px solid #e0e0e0",
                                      borderRadius: 1,
                                      p: 2,
                                      backgroundColor: "#fafafa",
                                    }}
                                  >
                                    <FlexBetween mb={1}>
                                      <Box>
                                        <Paragraph fontWeight={500} fontSize={15}>
                                          {ticket.name}
                                        </Paragraph>
                                        <Chip
                                          label={ticket.type === "free" ? "FREE" : "PAID"}
                                          color={ticket.type === "free" ? "success" : "primary"}
                                          size="small"
                                          sx={{ mt: 0.5 }}
                                        />
                                      </Box>
                                      <Box textAlign="right">
                                        <Paragraph fontWeight={600} color="primary.main" fontSize={16}>
                                          ₹{ticket.price}
                                        </Paragraph>
                                        {ticket.discountedPrice !== ticket.price && (
                                          <Paragraph
                                            fontSize={12}
                                            color="text.secondary"
                                            sx={{ textDecoration: "line-through" }}
                                          >
                                            ₹{ticket.discountedPrice}
                                          </Paragraph>
                                        )}
                                      </Box>
                                    </FlexBetween>

                                    <Box mb={1}>
                                      <Paragraph fontSize={13} color="text.secondary" mb={0.5}>
                                        {ticket.description}
                                      </Paragraph>
                                      <Grid container spacing={1}>
                                        <Grid size={6}>
                                          <Paragraph fontSize={12} color="text.secondary">
                                            Age Limit: {ticket.minAge} - {ticket.maxAge} years
                                          </Paragraph>
                                        </Grid>
                                        <Grid size={6}>
                                          <Paragraph fontSize={12} color="text.secondary">
                                            Booking Limit: {ticket.minPerBooking} - {ticket.maxPerBooking}
                                          </Paragraph>
                                        </Grid>
                                      </Grid>
                                    </Box>

                                    <Box mb={1}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Sale Period:
                                      </Paragraph>
                                      <Paragraph fontSize={12}>
                                        {new Date(ticket.saleStartDateTime).toLocaleDateString("en-IN")} -{" "}
                                        {new Date(ticket.saleEndDateTime).toLocaleDateString("en-IN")}
                                      </Paragraph>
                                    </Box>

                                    <FlexBetween>
                                      <Box>
                                        <Paragraph fontSize={13} color="text.secondary">
                                          Booked: {ticket.bookedCount} / {ticket.quantity}
                                        </Paragraph>
                                        <LinearProgress
                                          variant="determinate"
                                          value={(ticket.bookedCount / ticket.quantity) * 100}
                                          sx={{ width: 100, mt: 0.5 }}
                                        />
                                      </Box>
                                      <Box textAlign="right">
                                        <Chip
                                          label={ticket.approvalStatus || "Pending"}
                                          color={ticket.approvalStatus === "approved" ? "success" : "warning"}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </Box>
                                    </FlexBetween>

                                    {/* Applicable Coupons */}
                                    {ticket.applicableCoupons?.length > 0 && (
                                      <Box mt={2}>
                                        <Paragraph fontSize={12} color="text.secondary" mb={1}>
                                          Applicable Coupons:
                                        </Paragraph>
                                        <FlexBox gap={1} flexWrap="wrap">
                                          {ticket.applicableCoupons.map((coupon) => (
                                            <Chip
                                              key={coupon.id}
                                              label={`${coupon.code} (${coupon.discountValue}% OFF)`}
                                              size="small"
                                              variant="outlined"
                                              color="secondary"
                                            />
                                          ))}
                                        </FlexBox>
                                      </Box>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        ) : (
                          <Paragraph fontSize={13} color="text.secondary">
                            No tickets available for this slot.
                          </Paragraph>
                        )}
                      </Box>
                    </InfoCard>
                  ))
                ) : (
                  <Paragraph fontSize={13} color="text.secondary">
                    No slots available.
                  </Paragraph>
                )}
              </Div>
            </TabPanel>

            {/* TAB 3: COUPONS & ADD-ONS */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                {/* COUPONS SECTION */}
                <Grid size={12}>
                  <Div>
                    <SectionHeader>
                      <LocalOfferIcon color="action" />
                      <H6 fontSize={16}>Coupons</H6>
                    </SectionHeader>

                    {eventsData?.coupons?.length > 0 ? (
                      <Grid container spacing={2}>
                        {eventsData.coupons.map((coupon, idx) => {
                          const { statusText, statusColor, style } = getCouponStatus(coupon);
                          return (
                            <Grid size={12} key={coupon?.id || idx}>
                              <InfoCard style={style}>
                                <Box p={2}>
                                  <FlexBetween mb={2}>
                                    <Box>
                                      <Paragraph fontWeight={600} color="primary.main" fontSize={16}>
                                        {coupon?.code}
                                      </Paragraph>
                                      <Paragraph fontSize={14} fontWeight={500} mt={0.5}>
                                        {coupon?.title}
                                      </Paragraph>
                                      <Paragraph fontSize={13} color="text.secondary" mt={0.5}>
                                        {coupon?.description}
                                      </Paragraph>
                                    </Box>
                                    <Box textAlign="right">
                                      <Chip
                                        label={`${coupon?.discountValue}% OFF`}
                                        color="secondary"
                                        size="small"
                                      />
                                      <Box mt={1}>
                                        <Chip
                                          label={coupon?.approvalStatus || "Pending"}
                                          color={coupon?.approvalStatus === "approved" ? "success" : "warning"}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </Box>
                                    </Box>
                                  </FlexBetween>

                                  <Grid container spacing={2}>
                                    <Grid size={3}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Discount Type
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500} style={{ textTransform: "capitalize" }}>
                                        {coupon?.discountType}
                                      </Paragraph>
                                    </Grid>
                                    <Grid size={3}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Max Discount
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        ₹{coupon?.maxDiscountValue || "N/A"}
                                      </Paragraph>
                                    </Grid>
                                    <Grid size={3}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Min Purchase
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        ₹{coupon?.minimumPurchase || "0"}
                                      </Paragraph>
                                    </Grid>
                                    <Grid size={3}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Usage
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {coupon?.usageCount || 0} / {coupon?.usageLimit || "∞"}
                                      </Paragraph>
                                    </Grid>
                                  </Grid>

                                  <Grid container spacing={2} mt={1}>
                                    <Grid size={4}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Start Date
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {new Date(coupon?.startTimeStamp).toLocaleDateString("en-IN", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </Paragraph>
                                    </Grid>
                                    <Grid size={4}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        End Date
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {new Date(coupon?.endTimeStamp).toLocaleDateString("en-IN", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </Paragraph>
                                    </Grid>
                                    <Grid size={4}>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        Per User Limit
                                      </Paragraph>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {coupon?.usageLimitPerUser || "∞"}
                                      </Paragraph>
                                    </Grid>
                                  </Grid>

                                  {/* Additional Restrictions */}
                                  <Box mt={2}>
                                    <FlexBox gap={1} flexWrap="wrap">
                                      {coupon?.genderRestriction && (
                                        <Chip
                                          label={`Gender: ${coupon.genderRestriction}`}
                                          size="small"
                                          variant="outlined"
                                        />
                                      )}
                                      {coupon?.ageRestriction && (
                                        <Chip
                                          label={`Age: ${coupon.ageRestriction.minAge}-${coupon.ageRestriction.maxAge}`}
                                          size="small"
                                          variant="outlined"
                                        />
                                      )}
                                      {coupon?.isQuantityBased && (
                                        <Chip
                                          label={`Qty: ${coupon.minQuantityRequired}-${coupon.maxQuantityAllowed}`}
                                          size="small"
                                          variant="outlined"
                                        />
                                      )}
                                      {coupon?.isVisible && (
                                        <Chip label="Visible" size="small" color="success" variant="outlined" />
                                      )}
                                    </FlexBox>
                                  </Box>

                                  <Box mt={2}>
                                    <Paragraph fontSize={12} color={statusColor} fontWeight={500}>
                                      {statusText}
                                    </Paragraph>
                                  </Box>
                                </Box>
                              </InfoCard>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Paragraph fontSize={14} color="text.secondary">
                        No coupons available
                      </Paragraph>
                    )}
                  </Div>
                </Grid>

                {/* ADD-ONS SECTION */}
                <Grid size={12}>
                  <Div>
                    <SectionHeader>
                      <ShoppingCartIcon color="action" />
                      <H6 fontSize={16}>Add-ons</H6>
                    </SectionHeader>

                    {eventsData?.addOns?.length > 0 ? (
                      <Grid container spacing={2}>
                        {eventsData.addOns.map((addon, idx) => (
                          <Grid size={12} key={addon?.id || idx}>
                            <InfoCard>
                              <Box p={2}>
                                <FlexBox gap={2}>
                                  {addon?.product?.image && (
                                    <img
                                      src={addon?.product?.image}
                                      alt={addon?.product?.name || "Add On"}
                                      style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        objectFit: "cover",
                                        background: "#f5f5f5",
                                      }}
                                    />
                                  )}
                                  <Box flex={1}>
                                    <FlexBetween mb={1}>
                                      <Paragraph fontWeight={600} fontSize={16}>
                                        {addon?.product?.name}
                                      </Paragraph>
                                      <Paragraph fontWeight={600} color="primary.main" fontSize={18}>
                                        ₹{addon?.product?.price}
                                      </Paragraph>
                                    </FlexBetween>

                                    <Paragraph fontSize={13} color="text.secondary" mb={1}>
                                      {addon?.product?.description}
                                    </Paragraph>

                                    <FlexBetween mb={1}>
                                      <Chip
                                        label={addon?.product?.category?.name}
                                        size="small"
                                        variant="outlined"
                                      />
                                      <Chip
                                        label={addon?.approvalStatus || "Pending"}
                                        color={addon?.approvalStatus === "approved" ? "success" : "warning"}
                                        size="small"
                                      />
                                    </FlexBetween>

                                    <Grid container spacing={2} mt={1}>
                                      <Grid size={4}>
                                        <Paragraph fontSize={12} color="text.secondary">
                                          Total Quantity
                                        </Paragraph>
                                        <Paragraph fontSize={14} fontWeight={500}>
                                          {addon?.quantity}
                                        </Paragraph>
                                      </Grid>
                                      <Grid size={4}>
                                        <Paragraph fontSize={12} color="text.secondary">
                                          Sold Quantity
                                        </Paragraph>
                                        <Paragraph fontSize={14} fontWeight={500}>
                                          {addon?.soldQuantity}
                                        </Paragraph>
                                      </Grid>
                                      <Grid size={4}>
                                        <Paragraph fontSize={12} color="text.secondary">
                                          Available
                                        </Paragraph>
                                        <Paragraph fontSize={14} fontWeight={500} color="success.main">
                                          {addon?.quantity - addon?.soldQuantity}
                                        </Paragraph>
                                      </Grid>
                                    </Grid>

                                    <Box mt={2}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={(addon?.soldQuantity / addon?.quantity) * 100}
                                        sx={{ height: 8, borderRadius: 1 }}
                                      />
                                      <Paragraph fontSize={11} color="text.secondary" mt={0.5}>
                                        {Math.round((addon?.soldQuantity / addon?.quantity) * 100)}% sold
                                      </Paragraph>
                                    </Box>
                                  </Box>
                                </FlexBox>
                              </Box>
                            </InfoCard>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Paragraph fontSize={14} color="text.secondary">
                        No add-ons available
                      </Paragraph>
                    )}
                  </Div>
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 4: FORMS & PARTICIPANTS */}
            <TabPanel value={activeTab} index={3}>
              <Grid container spacing={3}>
                {/* FORMS SECTION */}
                <Grid size={12}>
                  <Div>
                    <SectionHeader>
                      <AssignmentIcon color="action" />
                      <H6 fontSize={16}>Registration Forms</H6>
                    </SectionHeader>

                    {eventsData?.forms?.length > 0 ? (
                      eventsData.forms.map((form, idx) => (
                        <InfoCard key={form.id} sx={{ mb: 2 }}>
                          <Box p={2}>
                            <FlexBetween mb={2}>
                              <Box>
                                <Paragraph fontWeight={600} fontSize={16} style={{ textTransform: "capitalize" }}>
                                  {form.formType?.replace("_", " ")} Form
                                </Paragraph>
                                <Paragraph fontSize={13} color="text.secondary">
                                  Show: {form.showTiming?.replace("_", " ")}
                                </Paragraph>
                              </Box>
                              <Chip
                                label={form.approvalStatus || "Pending"}
                                color={form.approvalStatus === "approved" ? "success" : "warning"}
                                size="small"
                              />
                            </FlexBetween>

                            <Divider sx={{ my: 2 }} />

                            <Paragraph fontSize={14} fontWeight={500} mb={2}>
                              Form Fields:
                            </Paragraph>
                            <Grid container spacing={2}>
                              {form.fields?.map((field, fieldIdx) => (
                                <Grid size={6} key={fieldIdx}>
                                  <Box
                                    sx={{
                                      border: "1px solid #e0e0e0",
                                      borderRadius: 1,
                                      p: 1.5,
                                      backgroundColor: "#fafafa",
                                    }}
                                  >
                                    <FlexBetween>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {field.label}
                                      </Paragraph>
                                      {field.required && (
                                        <Chip label="Required" size="small" color="error" variant="outlined" />
                                      )}
                                    </FlexBetween>
                                    <Paragraph fontSize={12} color="text.secondary" mt={0.5}>
                                      Type: {field.type}
                                    </Paragraph>
                                    {field.helpText && (
                                      <Paragraph fontSize={11} color="text.secondary" mt={0.5}>
                                        {field.helpText}
                                      </Paragraph>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </InfoCard>
                      ))
                    ) : (
                      <Paragraph fontSize={14} color="text.secondary">
                        No forms configured
                      </Paragraph>
                    )}
                  </Div>
                </Grid>

                {/* PARTICIPANTS SECTION */}
                <Grid size={12}>
                  <Div>
                    <SectionHeader>
                      <PeopleIcon color="action" />
                      <H6 fontSize={16}>
                        Participants ({eventsData?.participationsCount || 0})
                      </H6>
                    </SectionHeader>

                    {eventsData?.participations?.length > 0 ? (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Participant Name</TableCell>
                              <TableCell>Contact</TableCell>
                              <TableCell>Slot</TableCell>
                              <TableCell>Ticket Type</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Check-in</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {eventsData.participations.map((participation) =>
                              participation.participants?.map((participant) => (
                                <TableRow key={participant.id}>
                                  <TableCell>
                                    {participation.user?.name || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <Box>
                                      <Paragraph fontSize={13}>
                                        {participation.user?.email}
                                      </Paragraph>
                                      <Paragraph fontSize={12} color="text.secondary">
                                        {participation.user?.phoneNumber}
                                      </Paragraph>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {participation.slot?.name || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {participant.ticket?.name || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={participation.participationStatus || "Pending"}
                                      color={participation.participationStatus === "confirmed" ? "success" : "warning"}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={participant.isCheckedIn ? "Checked In" : "Not Checked"}
                                      color={participant.isCheckedIn ? "success" : "default"}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Paragraph fontSize={14} color="text.secondary">
                        No participants yet
                      </Paragraph>
                    )}
                  </Div>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Grid container spacing={3}>
            {/* ORGANIZER DETAILS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <PersonIcon color="action" />
                    <Paragraph fontWeight={600}>Organizer Details</Paragraph>
                  </SectionHeader>

                  {eventsData?.organizer ? (
                    <Box>
                      <FlexBox alignItems="center" gap={1.5} mb={2}>
                        <StyledAvatar alt="Organizer" src={eventsData?.organizer?.companyLogo} />
                        <div>
                          <Paragraph fontWeight={500}>{eventsData?.organizer?.name}</Paragraph>
                          <Paragraph fontSize={13} color="text.secondary">
                            {eventsData?.organizer?.companyName}
                          </Paragraph>
                        </div>
                      </FlexBox>
                      <Box>
                        <InfoRow>
                          <span className="label">Phone:</span>
                          <span className="value">{eventsData?.organizer?.phoneNumber}</span>
                        </InfoRow>
                        <InfoRow>
                          <span className="label">Email:</span>
                          <span className="value" style={{ fontSize: "12px" }}>
                            {eventsData?.organizer?.email}
                          </span>
                        </InfoRow>
                        <InfoRow>
                          <span className="label">Commission:</span>
                          <span className="value">{eventsData?.organizer?.commission}%</span>
                        </InfoRow>
                        <InfoRow>
                          <span className="label">Status:</span>
                          <Chip
                            label={eventsData?.organizer?.approvalStatus || "Pending"}
                            color={eventsData?.organizer?.approvalStatus === "approved" ? "success" : "warning"}
                            size="small"
                          />
                        </InfoRow>
                      </Box>
                    </Box>
                  ) : (
                    <Paragraph fontSize={14} color="text.secondary">
                      No organizer details available
                    </Paragraph>
                  )}
                </Div>
              </Card>
            </Grid>

            {/* QUICK STATS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <EventIcon color="action" />
                    <Paragraph fontWeight={600}>Quick Stats</Paragraph>
                  </SectionHeader>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Box textAlign="center" p={1} sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                        <Paragraph fontSize={24} fontWeight={600} color="primary.main">
                          {eventsData?.participationsCount || 0}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          Total Participants
                        </Paragraph>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box textAlign="center" p={1} sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                        <Paragraph fontSize={24} fontWeight={600} color="success.main">
                          {eventsData?.slots?.length || 0}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          Total Slots
                        </Paragraph>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box textAlign="center" p={1} sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                        <Paragraph fontSize={24} fontWeight={600} color="secondary.main">
                          {eventsData?.coupons?.length || 0}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          Active Coupons
                        </Paragraph>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box textAlign="center" p={1} sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                        <Paragraph fontSize={24} fontWeight={600} color="warning.main">
                          {eventsData?.addOns?.length || 0}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          Add-ons
                        </Paragraph>
                      </Box>
                    </Grid>
                  </Grid>
                </Div>
              </Card>
            </Grid>

            {/* MOBILE COVER IMAGE */}
            {eventsData?.mobileCoverImage && (
              <Grid size={12}>
                <Card>
                  <Div>
                    <SectionHeader>
                      <EventIcon color="action" />
                      <Paragraph fontWeight={600}>Mobile Banner</Paragraph>
                    </SectionHeader>
                    <img
                      src={eventsData?.mobileCoverImage}
                      alt="Mobile Banner"
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Div>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}