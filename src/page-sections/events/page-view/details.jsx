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
import { CardContent, CardHeader, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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

export default function EventsDetailsPageView() {
  const dispatch = useDispatch();
  const { allEvents } = useSelector((state) => state.events);

  const [eventsData, setEventsData] = useState({});
  const [loading, setLoading] = useState(true);

  // const getEventsID = localStorage.getItem("eventsId");
  const navigate = useNavigate();
  const {id}= useParams()

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
      console.error("No event ID found in localStorage");
      toast.error("No event selected");
      navigate("/events");
    }
  }, [dispatch, id, navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  const handleClickonSlots = (slotId) => {
    navigate(`/events/eventticket-details/${slotId}`, {
      state: { event: eventsData }
    });
  };

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid size={{ md: 8, xs: 12 }}>
          <Grid container spacing={3}>
            {/* MAIN EVENT INFO */}
            <Grid size={12}>
              <Card>
                <Div>
                  <FlexBetween mb={2} style={{textTransform:"capitalize"}}>
                    <H6 fontSize={18}>{eventsData?.title?.toUpperCase()}</H6>
                    <StatusChip 
                      label={eventsData?.approvalStatus || "Pending"} 
                      status={eventsData?.approvalStatus}
                      size="small"
                    />
                  </FlexBetween>

                  {/* Event Banner */}
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <img
                      src={eventsData?.banner}
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
                  <Box mb={2}  style={{textTransform:"capitalize"}}>
                    <Paragraph
                      fontSize={16}
                      lineHeight={1.6}
                      color="text.primary"
                      dangerouslySetInnerHTML={{ __html: eventsData?.description }}
                    />
                  </Box>

                  {/* Event Basic Details */}
                  <Grid container spacing={2} mb={2}>
                    <Grid size={6}>
                      <FlexBox alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Box>
                          <Paragraph fontSize={12} color="text.secondary">Date</Paragraph>
                          <Paragraph fontWeight={500}>{eventsData?.date}</Paragraph>
                        </Box>
                      </FlexBox>
                    </Grid>
                    <Grid size={6}>
                      <FlexBox alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Box>
                          <Paragraph fontSize={12} color="text.secondary">Time</Paragraph>
                          <Paragraph fontWeight={500}>
                            {eventsData?.startTime} - {eventsData?.endTime}
                          </Paragraph>
                        </Box>
                      </FlexBox>
                    </Grid>
                  </Grid>

                  {/* Price and Discount Info */}
                  <Grid container spacing={2} mb={2}>
                    <Grid size={4}>
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">Price</Paragraph>
                        <Paragraph fontWeight={500} fontSize={18} color="primary.main">
                          ₹{eventsData?.price || 0}
                        </Paragraph>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">Coins Discount</Paragraph>
                        <Paragraph fontWeight={500}>{eventsData?.coinsDiscountPercentage || 0}%</Paragraph>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box>
                        <Paragraph fontSize={12} color="text.secondary">Max Tickets/User</Paragraph>
                        <Paragraph fontWeight={500}>{eventsData?.maxTicketsPerUser || 0}</Paragraph>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Status and Review */}
                  <FlexBox alignItems="center" gap={2} mb={2}>
                    <Chip 
                      label={eventsData?.isActive ? "Active" : "Inactive"} 
                      color={eventsData?.isActive ? "success" : "error"}
                      size="small"
                    />
                    {eventsData?.reviewReason && (
                      <Paragraph fontSize={12} color="text.secondary">
                        Review Reason: {eventsData?.reviewReason}
                      </Paragraph>
                    )}
                  </FlexBox>
                </Div>
              </Card>
            </Grid>

            {/* EVENT SLOTS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <AccessTimeIcon color="action" />
                    <H6 fontSize={16}>Event Slots</H6>
                  </SectionHeader>

                  {eventsData?.slots?.length > 0 ? (
                    eventsData.slots.map((slot, index) => (
                      <InfoCard key={slot.id}>
                        <Box
                          p={2}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClickonSlots(slot.id)}
                        >
                          <FlexBetween mb={1}>
                            <Paragraph fontWeight={500}>
                              Slot {index + 1}: {slot.startTime} - {slot.endTime}
                            </Paragraph>
                            <Chip 
                              label={slot.isSoldOut ? "Sold Out" : "Available"} 
                              color={slot.isSoldOut ? "error" : "success"}
                              size="small"
                            />
                          </FlexBetween>
                          
                          {slot.eventTickets?.length > 0 && (
                            <Box>
                              <Paragraph fontSize={12} color="text.secondary" mb={1}>
                                Tickets Available:
                              </Paragraph>
                              {slot.eventTickets.map((ticket, idx) => (
                                <Box key={ticket.id} ml={2} mb={1}>
                                  <FlexBetween>
                                    <Paragraph fontSize={13}>
                                      {ticket.ticketTemplate?.type?.title} - ₹{ticket.ticketTemplate?.price}
                                    </Paragraph>
                                    <Paragraph fontSize={13} color="text.secondary">
                                      {ticket.bookedCount}/{ticket.ticketTemplate?.quantity}
                                    </Paragraph>
                                  </FlexBetween>
                                </Box>
                              ))}
                            </Box>
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
              </Card>
            </Grid>

            {/* FAQ SECTION */}
            <Grid size={12}>
              <Card>
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
              </Card>
            </Grid>

            {/* PARTICIPATION SECTION */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <GroupIcon color="action" />
                    <H6 fontSize={16}>Participation Guidelines</H6>
                  </SectionHeader>
                  <Paragraph lineHeight={1.6} color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                    {eventsData?.participation?.content || 
                     eventsData?.participation || 
                     "No participation guidelines available."}
                  </Paragraph>
                </Div>
              </Card>
            </Grid>

            {/* OBSTACLES SECTION */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <ObstacleIcon color="action" />
                    <H6 fontSize={16}>Obstacles & Challenges</H6>
                  </SectionHeader>
                  <Paragraph lineHeight={1.6} color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                    {eventsData?.obstacles?.content || 
                     eventsData?.obstacles || 
                     "No obstacle information available."}
                  </Paragraph>
                </Div>
              </Card>
            </Grid>

            {/* ENDURANCE LEVEL SECTION */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <FitnessIcon color="action" />
                    <H6 fontSize={16}>Endurance Level Requirements</H6>
                  </SectionHeader>
                  <Paragraph lineHeight={1.6} color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                    {eventsData?.enduranceLevel?.content || 
                     eventsData?.enduranceLevel || 
                     "No endurance level information available."}
                  </Paragraph>
                </Div>
              </Card>
            </Grid>

            {/* TERMS AND CONDITIONS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <PolicyIcon color="action" />
                    <H6 fontSize={16}>Terms & Conditions</H6>
                  </SectionHeader>
                  <Paragraph lineHeight={1.6} color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                    {eventsData?.termsAndCondition?.content || "No terms and conditions available."}
                  </Paragraph>
                </Div>
              </Card>
            </Grid>

            {/* PRIVACY POLICY */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <SecurityIcon color="action" />
                    <H6 fontSize={16}>Privacy Policy</H6>
                  </SectionHeader>
                  <Paragraph lineHeight={1.6} color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                    {eventsData?.privacyPolicy?.content || "No privacy policy available."}
                  </Paragraph>
                </Div>
              </Card>
            </Grid>

            {/* META DATA*/}
            <Grid size={12}>
                  {/* Metadata Card */}
          <Card variant="outlined">
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
                      <Typography variant="body2" style={{textTransform:"capitalize"}}>
                        {eventsData.createdBy || "Unknown"}
                        {eventsData.createdByRole && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary" 
                            style={{textTransform:"capitalize"}}
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
                        <Typography variant="body2" style={{textTransform:"capitalize"}}>
                          {eventsData.updatedBy}
                          {eventsData.updatedByRole && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              style={{textTransform:"capitalize"}}
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
          </Card>
            </Grid>
          </Grid>
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
                    <FlexBox alignItems="center" gap={1.5}>
                      <StyledAvatar
                        alt="Organizer"
                        src={eventsData?.organizer?.companyLogo}
                      />
                      <div>
                        <Paragraph fontWeight={500}>
                          {eventsData?.organizer?.name}
                        </Paragraph>
                        <Paragraph fontSize={13} color="text.secondary">
                          {eventsData?.organizer?.companyName}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          {eventsData?.organizer?.phoneNumber}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          {eventsData?.organizer?.email}
                        </Paragraph>
                      </div>
                    </FlexBox>
                  ) : (
                    <Paragraph fontSize={14} color="text.secondary">
                      No organizer details available
                    </Paragraph>
                  )}
                </Div>
              </Card>
            </Grid>

            {/* LOCATION */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <LocationOnIcon color="action" />
                    <Paragraph fontWeight={600}>Location</Paragraph>
                  </SectionHeader>
                  <Paragraph fontWeight={500}>
                    {eventsData?.location?.address || "Location not specified"}
                  </Paragraph>
                  {eventsData?.location?.coordinate && (
                    <Paragraph fontSize={12} color="text.secondary" mt={1}>
                      {/* Coordinates: {eventsData?.location?.coordinate?.coordinates?.join(', ')} */}
                    </Paragraph>
                  )}
                </Div>
              </Card>
            </Grid>

            {/* EVENT QUICK INFO */}
            {/* <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <HelpIcon color="action" />
                    <Paragraph fontWeight={600}>Event Details</Paragraph>
                  </SectionHeader>
                  
                  <Box mb={2}>
                    <FlexBetween mb={1}>
                      <Paragraph fontSize={13} color="text.secondary">Participation:</Paragraph>
                      <Paragraph fontSize={13} fontWeight={500}>
                        {eventsData?.participation?.title || eventsData?.participation || "N/A"}
                      </Paragraph>
                    </FlexBetween>
                    
                    <FlexBetween mb={1}>
                      <Paragraph fontSize={13} color="text.secondary">Obstacles:</Paragraph>
                      <Paragraph fontSize={13} fontWeight={500}>
                        {eventsData?.obstacles?.title || eventsData?.obstacles || "N/A"}
                      </Paragraph>
                    </FlexBetween>
                    
                    <FlexBetween mb={1}>
                      <Paragraph fontSize={13} color="text.secondary">Endurance Level:</Paragraph>
                      <Paragraph fontSize={13} fontWeight={500}>
                        {eventsData?.enduranceLevel?.title || eventsData?.enduranceLevel || "N/A"}
                      </Paragraph>
                    </FlexBetween>
                  </Box>
                </Div>
              </Card>
            </Grid> */}

            {/* ADD ONS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <ShoppingCartIcon color="action" />
                    <Paragraph fontWeight={600}>Add Ons</Paragraph>
                  </SectionHeader>

                  {eventsData?.addOns?.length > 0 ? (
                    eventsData.addOns.map((addon, idx) => (
                      <Box key={addon?.id || idx} mb={2}>
                        <FlexBox alignItems="center" gap={1.5}>
                          {addon?.product?.image && (
                            <img
                              src={addon?.product?.image}
                              alt={addon?.product?.name || 'Add On'}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                objectFit: 'cover',
                                background: '#f5f5f5'
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <Paragraph fontWeight={500}>
                              {addon?.product?.name}
                            </Paragraph>
                            <Paragraph fontSize={13} color="primary.main">
                              ₹{addon?.product?.price}
                            </Paragraph>
                            <Paragraph fontSize={12} color="text.secondary">
                              {addon?.product?.category?.name}
                            </Paragraph>
                            <FlexBox alignItems="center" gap={1} mt={0.5}>
                              <Paragraph fontSize={12} color="text.secondary">
                                Available: {addon?.quantity - addon?.soldQuantity}
                              </Paragraph>
                              <Paragraph fontSize={12} color="text.secondary">
                                Sold: {addon?.soldQuantity}
                              </Paragraph>
                            </FlexBox>
                          </div>
                        </FlexBox>
                      </Box>
                    ))
                  ) : (
                    <Paragraph fontSize={14} color="text.secondary">
                      No add-ons available
                    </Paragraph>
                  )}
                </Div>
              </Card>
            </Grid>

            {/* COUPONS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <LocalOfferIcon color="action" />
                    <Paragraph fontWeight={600}>Coupons</Paragraph>
                  </SectionHeader>

                  {eventsData?.coupons?.length > 0 ? (
                    eventsData.coupons.map((coupon, idx) => {
                      const { statusText, statusColor, style } = getCouponStatus(coupon);
                      return (
                        <Box key={coupon?.id || idx} mb={2} style={style}>
                          <InfoCard>
                            <Box p={2}>
                              <FlexBetween mb={1}>
                                <Paragraph fontWeight={500} color="primary.main">
                                  {coupon?.code}
                                </Paragraph>
                                <Chip 
                                  label={`${coupon?.discountValue}% OFF`} 
                                  color="secondary" 
                                  size="small"
                                />
                              </FlexBetween>
                              <Paragraph fontSize={13} color="text.secondary" mb={1}>
                                {coupon?.description}
                              </Paragraph>
                              <Paragraph fontSize={12} color={statusColor}>
                                {statusText}
                              </Paragraph>
                            </Box>
                          </InfoCard>
                        </Box>
                      );
                    })
                  ) : (
                    <Paragraph fontSize={14} color="text.secondary">
                      No coupons available
                    </Paragraph>
                  )}
                </Div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}