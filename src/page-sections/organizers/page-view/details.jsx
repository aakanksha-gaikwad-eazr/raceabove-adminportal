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
import {
  Tabs,
  Tab,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";

// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { formatDate } from "@/utils/dateFormatter";

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

  const navigate = useNavigate();
  const { id } = useParams();

  // Mock function to simulate API call - replace with your actual API call
  const getOrganizerById = (organizerId) => {
    return new Promise((resolve) => {
      // Replace this with your actual API call
      setTimeout(() => {
        resolve({
          payload: organizerData, // Your JSON data here
        });
      }, 1000);
    });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      // Replace this with your actual API call
      // dispatch(getOrganizerById(id))
      getOrganizerById(id)
        .then((response) => {
          if (response?.payload) {
            setOrganizerData(response?.payload);
          }
        })
        .catch((error) => {
          console.error("Error fetching organizer:", error);
          toast.error("Failed to fetch organizer details");
        })
        .finally(() => setLoading(false));
    } else {
      toast.error("No organizer selected");
      navigate("/organizers");
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
                style={{padding:"10px 20px"}}
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
                  <Grid size={4}>
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
                  <Grid size={4}>
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
                  </Grid>
                  <Grid size={4}>
                    <Box>
                      <Paragraph fontSize={12} color="text.secondary">
                        Review Status
                      </Paragraph>
                      <Paragraph fontWeight={500}>
                        {organizerData?.reviewReason || "No review"}
                      </Paragraph>
                    </Box>
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
                  organizerData.events.map((event, index) => (
                    <InfoCard key={event.id}>
                      <Box p={2}>
                        <FlexBetween mb={2}>
                          <Box flex={1}>
                            <FlexBox alignItems="center" gap={1} mb={1}>
                              <Paragraph
                                fontWeight={600}
                                fontSize={16}
                                style={{ textTransform: "capitalize" }}
                              >
                                {event.title}
                              </Paragraph>
                              <StatusChip
                                label={event.approvalStatus}
                                status={event.approvalStatus}
                                size="small"
                              />
                            </FlexBox>
                            <div style={{ marginBottom: "8px" }}>
                              {event.banner && (
                                <img
                                  src={event.banner}
                                  alt="Event Banner"
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

                        <Grid container spacing={2} mb={2}>
                          <Grid size={3}>
                            <Paragraph fontSize={12} color="text.secondary">
                              Date
                            </Paragraph>
                            <Paragraph fontSize={13} fontWeight={500}>
                              {event.date}
                            </Paragraph>
                          </Grid>
                          <Grid size={3}>
                            <Paragraph fontSize={12} color="text.secondary">
                              Time
                            </Paragraph>
                            <Paragraph fontSize={13} fontWeight={500}>
                              {event.startTime} - {event.endTime}
                            </Paragraph>
                          </Grid>
                          <Grid size={3}>
                            <Paragraph fontSize={12} color="text.secondary">
                              Price
                            </Paragraph>
                            <Paragraph
                              fontSize={13}
                              fontWeight={500}
                              color="primary.main"
                            >
                              ₹{event.price}
                            </Paragraph>
                          </Grid>
                          <Grid size={3}>
                            <Paragraph fontSize={12} color="text.secondary">
                              Slots
                            </Paragraph>
                            <Paragraph fontSize={13} fontWeight={500}>
                              {event.slots?.length || 0}
                            </Paragraph>
                          </Grid>
                        </Grid>

                        <Box>
                          <Paragraph
                            fontSize={13}
                            color="text.secondary"
                            mb={1}
                          >
                            Location: {event.location?.address},{" "}
                            {event.location?.city}, {event.location?.state}
                          </Paragraph>
                          <FlexBox alignItems="center" gap={1}>
                            <Chip
                              label={event.isActive ? "Active" : "Inactive"}
                              color={event.isActive ? "success" : "error"}
                              size="small"
                            />
                            <Paragraph fontSize={12} color="text.secondary">
                              Participants: {event.participationsCount || 0}
                            </Paragraph>
                          </FlexBox>
                        </Box>
                      </Box>
                    </InfoCard>
                  ))
                ) : (
                  <Paragraph fontSize={14} color="text.secondary">
                    No events created yet.
                  </Paragraph>
                )}
              </Div>
            </TabPanel>

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
                  organizerData.challenges.map((challenge) => (
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
                                label={challenge.approvalStatus}
                                status={challenge.approvalStatus}
                                size="small"
                              />
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

                        <Paragraph fontSize={13} color="text.secondary" mb={2}>
                          {challenge.description}
                        </Paragraph>

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
                              {challenge.startDate} to {challenge.endDate}
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
                  ))
                ) : (
                  <Paragraph fontSize={14} color="text.secondary">
                    No challenges created yet.
                  </Paragraph>
                )}
              </Div>
            </TabPanel>

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
                      <Grid container spacing={2}>
                        {organizerData.products.map((product) => (
                          <Grid size={12} key={product.id}>
                            <InfoCard>
                              <Box p={2}>
                                <FlexBox gap={2}>
                                  {product.image && (
                                    <img
                                      src={product.image}
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
                                      <Paragraph fontWeight={600} fontSize={16}>
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
                                    >
                                      {product.description}
                                    </Paragraph>

                                    <FlexBetween>
                                      <Chip
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
                      <Grid container spacing={2}>
                        {organizerData.coupons.map((coupon) => (
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
                                    >
                                      {coupon.description}
                                    </Paragraph>
                                  </Box>
                                  <Box textAlign="right">
                                    <Chip
                                      label={`${coupon.discountValue}% OFF`}
                                      color="secondary"
                                      size="small"
                                    />
                                    <Box mt={1}>
                                      <StatusChip
                                        label={coupon.approvalStatus}
                                        status={coupon.approvalStatus}
                                        size="small"
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
                    ) : (
                      <Paragraph fontSize={14} color="text.secondary">
                        No coupons created yet.
                      </Paragraph>
                    )}
                  </Div>
                </Grid>

                {/* PRODUCT CATEGORIES */}
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
                                <Box>
                                  <Paragraph fontWeight={500}>
                                    {category.name}
                                  </Paragraph>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    {category.description}
                                  </Paragraph>
                                </Box>
                                <StatusChip
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
                      organizerData.ticketTemplates.map((template) => (
                        <InfoCard key={template.id} sx={{ mb: 2 }}>
                          <Box p={2}>
                            <FlexBetween mb={1}>
                              <Box>
                                <Paragraph fontWeight={600} fontSize={15}>
                                  {template.ticketType?.title}
                                </Paragraph>
                                <Paragraph fontSize={13} color="text.secondary">
                                  {template.description}
                                </Paragraph>
                              </Box>
                              <Box textAlign="right">
                                <Paragraph
                                  fontWeight={600}
                                  color="primary.main"
                                  fontSize={16}
                                >
                                  ₹{template.price}
                                </Paragraph>
                                <StatusChip
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
                              <Grid size={3}>
                                <Paragraph fontSize={12} color="text.secondary">
                                  Quantity
                                </Paragraph>
                                <Paragraph fontSize={13} fontWeight={500}>
                                  {template.quantity}
                                </Paragraph>
                              </Grid>
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
                      ))
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
                      <Grid container spacing={2}>
                        {organizerData.ticketTypes.map((ticketType) => (
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
                      organizerData.frequentlyAskedQuestions.map((faq) => (
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
                      ))
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
                      organizerData.termsAndConditions.map((terms, index) => (
                        <InfoCard key={terms.id} sx={{ mb: 2 }}>
                          <Box p={2}>
                            <FlexBetween mb={2}>
                              <Paragraph fontWeight={600} fontSize={15}>
                                Terms & Conditions #{index + 1}
                              </Paragraph>
                              <Box textAlign="right">
                                <StatusChip
                                  label={terms.approvalStatus}
                                  status={terms.approvalStatus}
                                  size="small"
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
                      ))
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
                      organizerData.privacyPolicies.map((policy, index) => (
                        <InfoCard key={policy.id} sx={{ mb: 2 }}>
                          <Box p={2}>
                            <FlexBetween mb={2}>
                              <Paragraph fontWeight={600} fontSize={15}>
                                Privacy Policy #{index + 1}
                              </Paragraph>
                              <Box textAlign="right">
                                <StatusChip
                                  label={policy.approvalStatus}
                                  status={policy.approvalStatus}
                                  size="small"
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
                      ))
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
                        color="secondary.main"
                      >
                        {organizerData?.coupons?.filter(
                          (c) => c.isActive && !c.deletedAt
                        ).length || 0}
                      </Paragraph>
                    </FlexBetween>

                    <Divider />

                    <FlexBetween>
                      <Paragraph fontSize={13} color="text.secondary">
                        Approval Status:
                      </Paragraph>
                      <StatusChip
                        label={organizerData?.approvalStatus || "Pending"}
                        status={organizerData?.approvalStatus}
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
                        <Paragraph fontSize={11} color="text.secondary" ml={2}>
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
