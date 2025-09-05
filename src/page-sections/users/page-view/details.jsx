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
import React from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
// CUSTOM COMPONENTS
import MoreButton from "@/components/more-button";
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import { CardHeader, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// Add these new imports at the top of your existing imports
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { primary } from "@/theme/colors";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { getAllDataOfUser } from "@/store/apps/user";
import { limitWords } from "@/utils/wordLimiter";
import Pagination from "@mui/material/Pagination";

const SimpleCouponCard = styled(Box)(({ theme, isActive }) => ({
  border: `2px dashed ${isActive ? theme.palette.primary.main : "#ccc"}`,
  borderRadius: 8,
  padding: "16px",
  margin: "12px 0",
  background: isActive ? "#fff" : "#f9f9f9",
  opacity: isActive ? 1 : 0.6,
  transition: "all 0.3s ease",
}));
const CouponCard = styled(Card)(({ theme, isActive }) => ({
  background: isActive ? "#ffffff" : "#f8f9fa",
  border: `2px dashed ${isActive ? theme.palette.primary.main : "#dee2e6"}`,
  borderRadius: 12,
  position: "relative",
  overflow: "visible",
  margin: "16px 0",
  opacity: isActive ? 1 : 0.7,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: isActive ? "translateY(-2px)" : "none",
    boxShadow: isActive ? "0 8px 25px rgba(0,0,0,0.1)" : "none",
  },
}));

const CouponLeftSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "white",
  padding: "24px",
  borderRadius: "12px 0 0 12px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "140px",
  "&::after": {
    content: '""',
    position: "absolute",
    right: -10,
    top: "50%",
    transform: "translateY(-50%)",
    width: 20,
    height: 20,
    background: "#fff",
    borderRadius: "50%",
    border: `2px dashed ${theme.palette.primary.main}`,
  },
}));

const CouponRightSection = styled(Box)({
  padding: "20px",
  flex: 1,
  position: "relative",
});

const DottedSeparator = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: "30%",
  top: 0,
  bottom: 0,
  width: "2px",
  background: `repeating-linear-gradient(to bottom, ${theme.palette.primary.main} 0, ${theme.palette.primary.main} 8px, transparent 8px, transparent 16px)`,
  opacity: 0.3,
}));

// const CouponCorner = styled(Box)({
//   position: "absolute",
//   top: 16,
//   right: 16,
//   background: "rgba(255,255,255,0.2)",
//   borderRadius: "50%",
//   width: 60,
//   height: 60,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   border: "2px dashed rgba(255,255,255,0.5)",
// });

const FormCard = styled(Card)(({ theme, isActive }) => ({
  border: `2px solid ${isActive ? theme.palette.primary.main : "#e0e0e0"}`,
  borderRadius: 12,
  background: isActive ? "rgba(25, 118, 210, 0.02)" : "#f9f9f9",
  transition: "all 0.3s ease",
  margin: "16px 0",
  opacity: isActive ? 1 : 0.7,
}));

const FormField = styled(Box)(({ theme, fieldType }) => ({
  marginBottom: 16,
  padding: 12,
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  background: "#fff",
  borderLeft: `4px solid ${
    fieldType === "text" || fieldType === "email"
      ? "#2196f3"
      : fieldType === "radio" || fieldType === "checkbox"
        ? "#4caf50"
        : fieldType === "file"
          ? "#ff9800"
          : fieldType === "textarea"
            ? "#9c27b0"
            : "#757575"
  }`,
}));

// Add this new styled component for the chatbox
const ChatboxContainer = styled(Box)({
  position: "fixed",
  bottom: 20,
  right: 20,
  zIndex: 1000,
});

const ChatDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    position: "fixed",
    bottom: 20,
    right: 20,
    margin: 0,
    width: 380,
    maxWidth: "90vw",
    height: 500,
    maxHeight: "80vh",
    borderRadius: 16,
  },
});

const AnnouncementItem = styled(Box)(({ theme, isOwn }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: 16,
  alignItems: isOwn ? "flex-end" : "flex-start",
}));

const AnnouncementBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: "80%",
  padding: "12px 16px",
  borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
  backgroundColor: isOwn ? "#007bff" : "#f1f3f4",
  color: isOwn ? "white" : "black",
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function UserDetailsPageView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { allDataOfSingleUser } = useSelector((state) => state.user);
  console.log(allDataOfSingleUser, "allDataOfSingleUser");
  const [usersData, setUsersData] = useState({});
  const [loading, setLoading] = useState(true);

  const [tabValue, setTabValue] = useState("1");
  const [formsActiveStates, setFormsActiveStates] = useState({});
  const [couponsActiveStates, setCouponsActiveStates] = useState({});

  //paginations
  const [stepsPage, setStepsPage] = useState(1);
  const [gearsPage, setGearsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [challengesPage, setChallengesPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [targetsPage, setTargetsPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const paginateData = (data, page, itemsPerPage = ITEMS_PER_PAGE) => {
      const safeData = data || [];
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: safeData.slice(startIndex, endIndex),
      totalPages: Math.ceil((data?.length || 0) / itemsPerPage),
      totalItems: data?.length || 0,
    };
  };
  const PaginationContainer = ({
    totalPages,
    currentPage,
    onPageChange,
    totalItems,
    itemName,
  }) => {
    if (totalPages <= 1) return null;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          pt: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {Math.min(ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
          {itemName}
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => onPageChange(value)}
          color="primary"
          size="small"
          showFirstButton
          showLastButton
        />
      </Box>
    );
  };

  const stepsData = paginateData(allDataOfSingleUser?.steps, stepsPage);
  const gearsData = paginateData(allDataOfSingleUser?.gears, gearsPage);
  const reviewsData = paginateData(allDataOfSingleUser?.reviews, reviewsPage);
  const transactionsData = paginateData(
    allDataOfSingleUser?.walletTransactions,
    transactionsPage
  );
  const challengesData = paginateData(
    allDataOfSingleUser?.challengeParticipations,
    challengesPage
  );
  const eventsData = paginateData(
    allDataOfSingleUser?.eventParticipations,
    eventsPage
  );
  const activitiesData = paginateData(
    allDataOfSingleUser?.activities,
    activitiesPage
  );
  const targetsData = paginateData(allDataOfSingleUser?.targets, targetsPage);

  useEffect(() => {
    console.log("id of user", id);
    dispatch(getAllDataOfUser(id));
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log("userData", usersData);

  // Add these new state variables to your existing useState declarations
  const [chatOpen, setChatOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

  const toggleFormActive = (formId) => {
    setFormsActiveStates((prev) => ({
      ...prev,
      [formId]: !prev[formId],
    }));
  };

  const toggleCouponActive = (couponId) => {
    setCouponsActiveStates((prev) => ({
      ...prev,
      [couponId]: !prev[couponId],
    }));
  };

  const renderFormField = (field) => {
    const getFieldIcon = (type) => {
      switch (type) {
        case "text":
        case "email":
        case "phone":
        case "url":
        case "password":
          return "📝";
        case "number":
        case "date":
          return "🔢";
        case "radio":
          return "⚪";
        case "checkbox":
          return "☑️";
        case "multi_select":
          return "📋";
        case "file":
          return "📎";
        case "textarea":
          return "📄";
        default:
          return "❓";
      }
    };

    return (
      <FormField key={field.name} fieldType={field.type}>
        <FlexBox alignItems="center" gap={1} mb={1}>
          <span style={{ fontSize: "16px" }}>{getFieldIcon(field.type)}</span>
          <Paragraph fontWeight={600} fontSize={14}>
            {field.label}
            {field.required && (
              <span style={{ color: "red", marginLeft: 4 }}>*</span>
            )}
          </Paragraph>
        </FlexBox>

        <Paragraph fontSize={12} color="text.secondary" mb={1}>
          Type: {field.type.replace("_", " ").toUpperCase()}
        </Paragraph>

        {field.helpText && (
          <Paragraph fontSize={11} color="text.secondary" mb={1}>
            💡 {field.helpText}
          </Paragraph>
        )}

        {field.placeholder && (
          <Paragraph fontSize={11} color="text.secondary" mb={1}>
            Placeholder: "{field.placeholder}"
          </Paragraph>
        )}

        {field.options && (
          <Box ml={2}>
            <Paragraph fontSize={11} color="text.secondary" mb={0.5}>
              Options:
            </Paragraph>
            {field.options.map((option, idx) => (
              <Chip
                key={idx}
                label={option}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5, fontSize: 10 }}
              />
            ))}
          </Box>
        )}

        {field.validation && (
          <Box mt={1} p={1} bgcolor="rgba(255, 193, 7, 0.1)" borderRadius={1}>
            <Paragraph fontSize={10} color="warning.main">
              ⚠️ Validation:{" "}
              {field.validation.errorMessage || "Has validation rules"}
            </Paragraph>
          </Box>
        )}
      </FormField>
    );
  };

  // const getEventsID = localStorage.getItem("eventsId");
  const navigate = useNavigate();

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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getAllDataOfUser(id))
        .then((response) => {
          if (response?.payload) {
            setUsersData(response?.payload);
            // Initialize announcements if they exist in the event data
            if (response?.payload?.announcements) {
              setAnnouncements(response.payload.announcements);
            }
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

  useEffect(() => {
    if (usersData.forms) {
      const initialFormsState = {};
      usersData.forms.forEach((form) => {
        initialFormsState[form.id] = form.approvalStatus === "approved";
      });
      setFormsActiveStates(initialFormsState);
    }

    if (usersData.coupons) {
      const initialCouponsState = {};
      usersData.coupons.forEach((coupon) => {
        initialCouponsState[coupon.id] = coupon.isVisible;
      });
      setCouponsActiveStates(initialCouponsState);
    }
  }, [usersData]);

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
      state: { event: usersData },
    });
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const formatAnnouncementTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate minimum and maximum ticket prices from all slots
  const getTicketPriceRange = () => {
    if (!usersData.slots || usersData.slots.length === 0) {
      return { min: 0, max: 0 };
    }

    let prices = [];
    usersData.slots.forEach((slot) => {
      if (slot.eventTickets && slot.eventTickets.length > 0) {
        slot.eventTickets.forEach((ticket) => {
          if (ticket.price) {
            prices.push(parseFloat(ticket.price));
          }
          if (ticket.discountedPrice) {
            prices.push(parseFloat(ticket.discountedPrice));
          }
        });
      }
    });

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const priceRange = getTicketPriceRange();

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}

        <Grid size={{ md: 8, xs: 12 }}>
          <Card>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="user details tabs"
                  style={{ padding: "15px 15px 0 15px" }}
                >
                  <Tab label="Overview" value="1" />
                  <Tab
                    label={`Challenge (${allDataOfSingleUser?.challengeParticipations?.length || 0})`}
                    value="2"
                  />
                  <Tab
                    label={`Event (${allDataOfSingleUser?.eventParticipations?.length || 0})`}
                    value="3"
                  />
                  <Tab
                    label={`Activities (${allDataOfSingleUser?.activities?.length || 0})`}
                    value="4"
                  />
                  <Tab
                    label={`Health & Gear (${(allDataOfSingleUser?.gears?.length || 0) + (allDataOfSingleUser?.steps?.length || 0)})`}
                    value="5"
                  />
                </TabList>
              </Box>

              {/* Tab 1: Overview */}
              <TabPanel value="1" sx={{ p: 0 }}>
                <Div>
                  {/* User Details Section */}
                  <Box mb={3}>
                    <H6 fontSize={18} mb={2}>
                      User Profile
                    </H6>

                    <FlexBetween
                      mb={2}
                      backgroundColor="primary.50"
                      style={{ borderRadius: "5px", padding: "10px 20px" }}
                    >
                      <FlexBox alignItems="center" gap={2}>
                        <Avatar
                          src={allDataOfSingleUser?.profilePhoto}
                          sx={{ width: 60, height: 60 }}
                        >
                          {allDataOfSingleUser?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <H6 fontSize={20}>{allDataOfSingleUser?.name}</H6>
                          <Paragraph fontSize={14} color="text.secondary">
                            {allDataOfSingleUser?.email}
                          </Paragraph>
                        </Box>
                      </FlexBox>
                      <StatusChip
                        label={
                          allDataOfSingleUser?.isActive ? "Active" : "Inactive"
                        }
                        status={
                          allDataOfSingleUser?.isActive
                            ? "approved"
                            : "rejected"
                        }
                        size="small"
                      />
                    </FlexBetween>

                    <Grid container spacing={2} mb={2}>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Phone Number
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.phoneNumber || "N/A"}
                        </Paragraph>
                      </Grid>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Gender
                        </Paragraph>
                        <Paragraph
                          fontWeight={500}
                          style={{ textTransform: "capitalize" }}
                        >
                          {allDataOfSingleUser?.gender || "N/A"}
                        </Paragraph>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mb={2}>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Date of Birth
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.dateOfBirth
                            ? formatDate(allDataOfSingleUser.dateOfBirth)
                            : "N/A"}
                        </Paragraph>
                      </Grid>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Location
                        </Paragraph>
                        {/* <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.city?.trim()},{" "}
                          {allDataOfSingleUser?.state?.trim()}
                        </Paragraph> */}

                        <Paragraph fontWeight={500}>
                          {[
                            allDataOfSingleUser?.city?.trim(),
                            allDataOfSingleUser?.state?.trim(),
                          ]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </Paragraph>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mb={2}>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Height
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.height || "N/A"} cm
                        </Paragraph>
                      </Grid>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Weight
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.weight || "N/A"} kg
                        </Paragraph>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mb={2}>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Daily Steps Target
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.dailyStepsTarget?.toLocaleString() ||
                            "N/A"}{" "}
                          steps
                        </Paragraph>
                      </Grid>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Activities Count
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {allDataOfSingleUser?.activitiesCount || 0} activities
                        </Paragraph>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={2}>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Exercise Level
                        </Paragraph>
                        <Paragraph
                          fontWeight={500}
                          style={{ textTransform: "capitalize" }}
                        >
                          {allDataOfSingleUser?.exerciseLevel || "N/A"}
                        </Paragraph>
                      </Grid>
                      <Grid size={6}>
                        <Paragraph fontSize={12} color="text.secondary">
                          Account Created
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {formatDateTime(allDataOfSingleUser?.createdAt)}
                        </Paragraph>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Wallet Information */}
                  <Box mb={3}>
                    <H6 fontSize={16} mb={2}>
                      Wallet Information
                    </H6>
                    {allDataOfSingleUser?.wallet ? (
                      <Grid container spacing={2}>
                        <Grid size={4}>
                          <Box
                            textAlign="center"
                            p={2}
                            sx={{ background: "#f8f9fa", borderRadius: 2 }}
                          >
                            <Paragraph
                              fontSize={20}
                              fontWeight={700}
                              color="success.main"
                            >
                              ₹
                              {parseFloat(
                                allDataOfSingleUser.wallet.balance
                              ).toFixed(2)}
                            </Paragraph>
                            <Paragraph fontSize={12} color="text.secondary">
                              Current Balance
                            </Paragraph>
                          </Box>
                        </Grid>
                        <Grid size={4}>
                          <Box
                            textAlign="center"
                            p={2}
                            sx={{ background: "#f8f9fa", borderRadius: 2 }}
                          >
                            <Paragraph
                              fontSize={20}
                              fontWeight={700}
                              color="primary.main"
                            >
                              ₹
                              {parseFloat(
                                allDataOfSingleUser.wallet.totalCoinsEarned
                              ).toFixed(2)}
                            </Paragraph>
                            <Paragraph fontSize={12} color="text.secondary">
                              Total Earned
                            </Paragraph>
                          </Box>
                        </Grid>
                        <Grid size={4}>
                          <Box
                            textAlign="center"
                            p={2}
                            sx={{ background: "#f8f9fa", borderRadius: 2 }}
                          >
                            <Paragraph
                              fontSize={20}
                              fontWeight={700}
                              color="warning.main"
                            >
                              ₹
                              {parseFloat(
                                allDataOfSingleUser.wallet.totalCoinsUsed
                              ).toFixed(2)}
                            </Paragraph>
                            <Paragraph fontSize={12} color="text.secondary">
                              Total Used
                            </Paragraph>
                          </Box>
                        </Grid>
                      </Grid>
                    ) : (
                      <Paragraph fontSize={14} color="text.secondary">
                        No wallet information available
                      </Paragraph>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Targets */}
                <Box mb={3}>
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="targets-content"
      id="targets-header"
    >
      <H6 fontSize={16}>
        User Targets ({allDataOfSingleUser?.targets?.length || 0})
      </H6>
    </AccordionSummary>
    <AccordionDetails>
      {targetsData.totalItems > 0 ? (
        <>
          {targetsData.items.map((target) => (
            <InfoCard key={target.id} sx={{ mb: 2 }}>
              <Box p={2}>
                <FlexBox alignItems="center" gap={2}>
                  <img
                    src={target.banner}
                    alt={target.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <Box flex={1}>
                    <Paragraph fontWeight={500} fontSize={14}>
                      {target.name}
                    </Paragraph>
                    <Paragraph fontSize={12} color="text.secondary">
                      Created: {formatDate(target.createdAt)}
                    </Paragraph>
                    <Chip
                      label={target.isActive ? "Active" : "Inactive"}
                      color={target.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                </FlexBox>
              </Box>
            </InfoCard>
          ))}

          <PaginationContainer
            totalPages={targetsData.totalPages}
            currentPage={targetsPage}
            onPageChange={setTargetsPage}
            totalItems={targetsData.totalItems}
            itemName="targets"
          />
        </>
      ) : (
        <Paragraph fontSize={13} color="text.secondary">
          No targets set by user.
        </Paragraph>
      )}
    </AccordionDetails>
  </Accordion>
</Box>
                </Div>
              </TabPanel>

              {/* Tab 2: Challenge Participations */}
              <TabPanel value="2" sx={{ p: 0 }}>
                <Div>
                  <SectionHeader>
                    {/* <CampaignIcon color="primary" /> */}
                    <H6 fontSize={16}>
                      Challenge Participations (
                      {allDataOfSingleUser?.challengeParticipations?.length ||
                        0}
                      )
                    </H6>
                  </SectionHeader>

                  {challengesData.totalItems > 0 ? (
                    <>
                      {challengesData.items.map((participation, idx) => (
                        <Accordion key={participation.id} sx={{ mb: 2 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <FlexBetween width="100%">
                              <Box>
                                <Paragraph
                                  fontWeight={600}
                                  fontSize={16}
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {participation.challenge.title}
                                </Paragraph>
                                <Paragraph
                                  fontSize={12}
                                  color="text.secondary"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {participation.challenge.challengeType} •{" "}
                                  {participation.challenge.totalDays} days
                                </Paragraph>
                                <Box mt={1}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={parseFloat(participation.progress)}
                                    sx={{
                                      width: 200,
                                      height: 6,
                                      borderRadius: 3,
                                    }}
                                  />
                                  <Paragraph
                                    fontSize={11}
                                    color="text.secondary"
                                    mt={0.5}
                                  >
                                    Progress:{" "}
                                    {parseFloat(participation.progress).toFixed(
                                      1
                                    )}
                                    %
                                  </Paragraph>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <StatusChip
                                  label={
                                    participation.isCompleted
                                      ? "Completed"
                                      : participation.status
                                  }
                                  status={
                                    participation.isCompleted
                                      ? "approved"
                                      : "pending"
                                  }
                                  size="small"
                                  style={{ textTransform: "capitalize" }}
                                />
                                <Paragraph
                                  fontSize={12}
                                  color="success.main"
                                  fontWeight={500}
                                >
                                  {parseFloat(
                                    participation.coinsEarned
                                  ).toFixed(0)}{" "}
                                  Coins Earned
                                </Paragraph>
                              </Box>
                            </FlexBetween>
                          </AccordionSummary>

                          <AccordionDetails sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                              {/* Challenge Details */}
                              <Grid size={6}>
                                <Box mb={2}>
                                  <img
                                    src={participation.challenge.banner}
                                    alt={participation.challenge.title}
                                    style={{
                                      width: "100%",
                                      height: 120,
                                      borderRadius: 8,
                                      objectFit: "cover",
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                    mb={1}
                                  >
                                    Challenge Description:
                                  </Paragraph>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        participation.challenge.description,
                                    }}
                                    style={{ textTransform: "capitalize" }}
                                  />
                                </Box>
                              </Grid>

                              {/* Progress Details */}
                              <Grid size={6}>
                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Target
                                  </Paragraph>
                                  <Paragraph fontWeight={500}>
                                    {participation.challenge.targetValue}{" "}
                                    {participation.challenge.targetUnit}
                                  </Paragraph>
                                </Box>

                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Duration
                                  </Paragraph>
                                  <Paragraph fontWeight={500}>
                                    {formatDate(
                                      participation.challenge.startDate
                                    )}{" "}
                                    -{" "}
                                    {formatDate(
                                      participation.challenge.endDate
                                    )}
                                  </Paragraph>
                                </Box>

                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Organizer
                                  </Paragraph>
                                  <FlexBox alignItems="center" gap={1}>
                                    <Avatar
                                      src={
                                        participation.challenge.organizer
                                          .companyLogo
                                      }
                                      sx={{ width: 24, height: 24 }}
                                    >
                                      {participation.challenge.organizer.name.charAt(
                                        0
                                      )}
                                    </Avatar>
                                    <Box>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {participation.challenge.organizer.name}
                                      </Paragraph>
                                      <Paragraph
                                        fontSize={11}
                                        color="text.secondary"
                                      >
                                        {
                                          participation.challenge.organizer
                                            .companyName
                                        }
                                      </Paragraph>
                                    </Box>
                                  </FlexBox>
                                </Box>

                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Stats
                                  </Paragraph>
                                  <Grid container spacing={1}>
                                    <Grid size={6}>
                                      <Paragraph fontSize={11}>
                                        Active Days:{" "}
                                        {participation.activeDaysCount}
                                      </Paragraph>
                                    </Grid>
                                    <Grid size={6}>
                                      <Paragraph fontSize={11}>
                                        Current Streak:{" "}
                                        {participation.currentStreak}
                                      </Paragraph>
                                    </Grid>
                                  </Grid>
                                </Box>

                                {participation.completedOn && (
                                  <Box>
                                    <Paragraph
                                      fontSize={12}
                                      color="text.secondary"
                                    >
                                      Completed On
                                    </Paragraph>
                                    <Paragraph
                                      fontWeight={500}
                                      color="success.main"
                                    >
                                      {formatDateTime(
                                        participation.completedOn
                                      )}
                                    </Paragraph>
                                  </Box>
                                )}
                              </Grid>

                              {/* Qualifying Sports */}
                              {participation.challenge.qualifyingSports
                                ?.length > 0 && (
                                <Grid size={12}>
                                  <Box>
                                    <Paragraph
                                      fontSize={12}
                                      color="text.secondary"
                                      mb={1}
                                    >
                                      Qualifying Sports:
                                    </Paragraph>
                                    <FlexBox gap={1} flexWrap="wrap">
                                      {participation.challenge.qualifyingSports.map(
                                        (sport) => (
                                          <Chip
                                            key={sport.id}
                                            label={sport.name}
                                            size="small"
                                            variant="outlined"
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          />
                                        )
                                      )}
                                    </FlexBox>
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                      <PaginationContainer
                        totalPages={challengesData.totalPages}
                        currentPage={challengesPage}
                        onPageChange={setChallengesPage}
                        totalItems={challengesData.totalItems}
                        itemName="challenges"
                      />
                    </>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <CampaignIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Paragraph fontSize={16} color="text.secondary">
                        No challenge participations found
                      </Paragraph>
                    </Box>
                  )}
                </Div>
              </TabPanel>

              {/* Tab 3: Event Participations */}
              <TabPanel value="3" sx={{ p: 0 }}>
                <Div>
                  <SectionHeader>
                    <LocalOfferIcon color="primary" />
                    <H6 fontSize={16}>
                      Event Participations (
                      {allDataOfSingleUser?.eventParticipations?.length || 0})
                    </H6>
                  </SectionHeader>

                  {eventsData.totalItems > 0 ? (
                    <>
                      {eventsData.items.map((participation, idx) => (
                        <Accordion key={participation.id} sx={{ mb: 2 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <FlexBetween width="100%">
                              <Box>
                                <Paragraph fontWeight={600} fontSize={16}>
                                  {participation.event.title}
                                </Paragraph>
                                <Paragraph fontSize={12} color="text.secondary">
                                  {participation.slot?.name} •{" "}
                                  {formatDateTime(
                                    participation.event.startDateTime
                                  )}
                                </Paragraph>
                              </Box>
                              <StatusChip
                                label={participation.participationStatus}
                                status={
                                  participation.participationStatus ===
                                  "confirmed"
                                    ? "approved"
                                    : "pending"
                                }
                                size="small"
                                style={{ textTransform: "capitalize" }}
                              />
                            </FlexBetween>
                          </AccordionSummary>

                          <AccordionDetails sx={{ p: 3 }}>
                            {/* Keep all existing accordion details content exactly as is */}
                            <Grid container spacing={3}>
                              {/* Event Details */}
                              <Grid size={6}>
                                <Box mb={2}>
                                  <img
                                    src={participation.event.desktopCoverImage}
                                    alt={participation.event.title}
                                    style={{
                                      width: "100%",
                                      height: 120,
                                      borderRadius: 8,
                                      objectFit: "cover",
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                    mb={1}
                                  >
                                    Event Description:
                                  </Paragraph>
                                  <Paragraph fontSize={13} lineHeight={1.5}>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: participation.event.description,
                                      }}
                                      style={{ textTransform: "capitalize" }}
                                    />
                                  </Paragraph>
                                </Box>
                              </Grid>

                              {/* Participation Details */}
                              <Grid size={6}>
                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Event Type
                                  </Paragraph>
                                  <Paragraph
                                    fontWeight={500}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {participation.event.type?.replace(
                                      "_",
                                      " "
                                    )}{" "}
                                    • {participation.event.language}
                                  </Paragraph>
                                </Box>

                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Location
                                  </Paragraph>
                                  <Paragraph fontWeight={500}>
                                    {participation.event.location.address},{" "}
                                    {participation.event.location.city}
                                  </Paragraph>
                                </Box>

                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Organizer
                                  </Paragraph>
                                  <FlexBox alignItems="center" gap={1}>
                                    <Box>
                                      <Paragraph fontSize={13} fontWeight={500}>
                                        {participation.event.organizer.name}
                                      </Paragraph>
                                      <Paragraph
                                        fontSize={11}
                                        color="text.secondary"
                                      >
                                        {
                                          participation.event.organizer
                                            .companyName
                                        }
                                      </Paragraph>
                                    </Box>
                                  </FlexBox>
                                </Box>

                                <Box mb={2}>
                                  <Paragraph
                                    fontSize={12}
                                    color="text.secondary"
                                  >
                                    Participation Date
                                  </Paragraph>
                                  <Paragraph fontWeight={500}>
                                    {formatDateTime(participation.createdAt)}
                                  </Paragraph>
                                </Box>
                              </Grid>

                              {/* Participants */}
                              <Grid size={12}>
                                <H6 fontSize={14} mb={2}>
                                  Participants (
                                  {participation.participants?.length || 0})
                                </H6>
                                {participation.participants?.map(
                                  (participant) => {
                                    const formFields = JSON.parse(
                                      participant.formFields || "[]"
                                    );
                                    const fullName =
                                      formFields.find(
                                        (f) => f.name === "full_name"
                                      )?.values || "No Name";

                                    return (
                                      <InfoCard
                                        key={participant.id}
                                        sx={{ mb: 1 }}
                                      >
                                        <Box p={2}>
                                          <FlexBetween>
                                            <FlexBox
                                              alignItems="center"
                                              gap={1.5}
                                            >
                                              <Avatar
                                                sx={{ width: 32, height: 32 }}
                                              >
                                                {fullName.charAt(0)}
                                              </Avatar>
                                              <Box>
                                                <Paragraph
                                                  fontWeight={500}
                                                  fontSize={13}
                                                  style={{
                                                    textTransform: "capitalize",
                                                  }}
                                                >
                                                  {fullName}
                                                </Paragraph>
                                                <Paragraph
                                                  fontSize={11}
                                                  color="text.secondary"
                                                >
                                                  {participant.ticket?.name ??
                                                    "No Ticket"}{" "}
                                                  - ₹
                                                  {participant.ticket
                                                    ?.discountedPrice ??
                                                    participant.ticket?.price ??
                                                    "0"}
                                                </Paragraph>
                                              </Box>
                                            </FlexBox>
                                            <Chip
                                              label={
                                                participant.isCheckedIn
                                                  ? "Checked In"
                                                  : "Not Checked In"
                                              }
                                              color={
                                                participant.isCheckedIn
                                                  ? "success"
                                                  : "default"
                                              }
                                              size="small"
                                            />
                                          </FlexBetween>
                                        </Box>
                                      </InfoCard>
                                    );
                                  }
                                )}
                              </Grid>

                              {/* Payment Details */}
                              {participation.payment && (
                                <Grid size={12}>
                                  <H6 fontSize={14} mb={2}>
                                    Payment Details
                                  </H6>
                                  <InfoCard>
                                    <Box p={2}>
                                      <Grid
                                        container
                                        spacing={2}
                                        style={{ alignItems: "center" }}
                                      >
                                        <Grid size={3}>
                                          <Paragraph
                                            fontSize={12}
                                            color="text.secondary"
                                          >
                                            Status
                                          </Paragraph>
                                          <StatusChip
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                            label={
                                              participation.payment
                                                .paymentStatus
                                            }
                                            status={
                                              participation.payment
                                                .paymentStatus === "success"
                                                ? "approved"
                                                : "pending"
                                            }
                                            size="small"
                                          />
                                        </Grid>
                                        <Grid size={3}>
                                          <Paragraph
                                            fontSize={12}
                                            color="text.secondary"
                                          >
                                            Amount
                                          </Paragraph>
                                          <Paragraph
                                            fontWeight={600}
                                            color="success.main"
                                          >
                                            ₹
                                            {participation.payment.amountPaid ??
                                              "N/A"}
                                          </Paragraph>
                                        </Grid>
                                        <Grid size={3}>
                                          <Paragraph
                                            fontSize={12}
                                            color="text.secondary"
                                          >
                                            Method
                                          </Paragraph>
                                          <Paragraph
                                            fontWeight={500}
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {participation.payment.paymentMethod?.replace(
                                              "_",
                                              " "
                                            ) ?? "N/A"}
                                          </Paragraph>
                                        </Grid>
                                        <Grid size={3}>
                                          <Paragraph
                                            fontSize={8}
                                            color="text.secondary"
                                          >
                                            Order ID
                                          </Paragraph>
                                          <Paragraph
                                            fontSize={11}
                                            fontFamily="monospace"
                                          >
                                            {limitWords(
                                              participation.payment.orderId,
                                              20
                                            )}
                                          </Paragraph>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </InfoCard>
                                </Grid>
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}

                      <PaginationContainer
                        totalPages={eventsData.totalPages}
                        currentPage={eventsPage}
                        onPageChange={setEventsPage}
                        totalItems={eventsData.totalItems}
                        itemName="events"
                      />
                    </>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <LocalOfferIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Paragraph fontSize={16} color="text.secondary">
                        No event participations found
                      </Paragraph>
                    </Box>
                  )}
                </Div>
              </TabPanel>

              {/* Tab 4: Activities */}
              <TabPanel value="4" sx={{ p: 0 }}>
                <Div>
                  <SectionHeader>
                    <AccessTimeIcon color="action" />
                    <H6 fontSize={16}>
                      Activities ({allDataOfSingleUser?.activities?.length || 0}
                      )
                    </H6>
                  </SectionHeader>

                  {activitiesData.totalItems > 0 ? (
                    <>
                      {activitiesData.items.map((activity, idx) => {
                        const stats = JSON.parse(activity.statistics || "{}");

                        return (
                          <Accordion key={activity.id} sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <FlexBetween width="100%">
                                <FlexBox alignItems="center" gap={2}>
                                  <Avatar
                                    src={activity.sport?.icon}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      background: "#f5f5f5",
                                    }}
                                  >
                                    🏃
                                  </Avatar>
                                  <Box>
                                    <Paragraph
                                      fontWeight={600}
                                      fontSize={14}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {activity.name ||
                                        `${activity.sport?.name} Activity`}
                                    </Paragraph>
                                    <Paragraph
                                      fontSize={12}
                                      color="text.secondary"
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {activity.sport?.name} •{" "}
                                      {formatDateTime(activity.completedAt)}
                                    </Paragraph>
                                  </Box>
                                </FlexBox>
                                <Box textAlign="right">
                                  <Paragraph
                                    fontSize={14}
                                    fontWeight={600}
                                    color="primary.main"
                                  >
                                    {(activity.distanceInMeters / 1000).toFixed(
                                      2
                                    )}{" "}
                                    km
                                  </Paragraph>
                                  <Paragraph
                                    fontSize={11}
                                    color="text.secondary"
                                  >
                                    {Math.floor(
                                      activity.durationInSeconds / 60
                                    )}
                                    :
                                    {(activity.durationInSeconds % 60)
                                      .toString()
                                      .padStart(2, "0")}
                                  </Paragraph>
                                </Box>
                              </FlexBetween>
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: 3 }}>
                              {/* Keep all existing accordion details content exactly as is */}
                              <Grid container spacing={3}>
                                {/* Activity Stats */}
                                <Grid size={8}>
                                  <Grid container spacing={2}>
                                    <Grid size={6}>
                                      <Box
                                        textAlign="center"
                                        p={1.5}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 2,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={18}
                                          fontWeight={700}
                                          color="primary.main"
                                        >
                                          {(
                                            activity.distanceInMeters / 1000
                                          ).toFixed(2)}
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={11}
                                          color="text.secondary"
                                        >
                                          Distance (km)
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                    <Grid size={6}>
                                      <Box
                                        textAlign="center"
                                        p={1.5}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 2,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={18}
                                          fontWeight={700}
                                          color="success.main"
                                        >
                                          {activity.stepsCount}
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={11}
                                          color="text.secondary"
                                        >
                                          Steps
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                    <Grid size={6}>
                                      <Box
                                        textAlign="center"
                                        p={1.5}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 2,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={18}
                                          fontWeight={700}
                                          color="warning.main"
                                        >
                                          {stats.calories?.toFixed(1) || 0}
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={11}
                                          color="text.secondary"
                                        >
                                          Calories
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                    <Grid size={6}>
                                      <Box
                                        textAlign="center"
                                        p={1.5}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 2,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={18}
                                          fontWeight={700}
                                          color="info.main"
                                        >
                                          {stats.avgPace?.toFixed(1) || 0}
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={11}
                                          color="text.secondary"
                                        >
                                          Avg Pace
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                  </Grid>

                                  {activity.description && (
                                    <Box mt={2}>
                                      <Paragraph
                                        fontSize={12}
                                        color="text.secondary"
                                        mb={1}
                                      >
                                        Description:
                                      </Paragraph>
                                      <Paragraph fontSize={13}>
                                        {activity.description}
                                      </Paragraph>
                                    </Box>
                                  )}
                                </Grid>

                                {/* Activity Media & Gear */}
                                <Grid size={4}>
                                  {activity.media?.length > 0 && (
                                    <Box mb={2}>
                                      <Paragraph
                                        fontSize={12}
                                        color="text.secondary"
                                        mb={1}
                                      >
                                        Media:
                                      </Paragraph>
                                      <img
                                        src={activity.media[0]}
                                        alt="Activity"
                                        style={{
                                          width: "100%",
                                          height: 120,
                                          borderRadius: 8,
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Box>
                                  )}

                                  {activity.gear && (
                                    <Box>
                                      <Paragraph
                                        fontSize={12}
                                        color="text.secondary"
                                        mb={1}
                                      >
                                        Gear Used:
                                      </Paragraph>
                                      <FlexBox
                                        alignItems="center"
                                        gap={1}
                                        p={1}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Avatar
                                          src={activity.gear.photo}
                                          sx={{ width: 24, height: 24 }}
                                        >
                                          G
                                        </Avatar>
                                        <Box>
                                          <Paragraph
                                            fontSize={11}
                                            fontWeight={500}
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {activity.gear.brand}{" "}
                                            {activity.gear.model}
                                          </Paragraph>
                                          <Paragraph
                                            fontSize={10}
                                            color="text.secondary"
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {activity.gear.type?.name}
                                          </Paragraph>
                                        </Box>
                                      </FlexBox>
                                    </Box>
                                  )}
                                </Grid>

                                {/* Exertion & Map Type */}
                                <Grid size={12}>
                                  <FlexBox gap={1}>
                                    <Chip
                                      label={`Exertion: ${activity.exertion?.replace("_", " ")}`}
                                      size="small"
                                      variant="outlined"
                                      style={{ textTransform: "capitalize" }}
                                    />
                                    <Chip
                                      label={`Map: ${activity.mapType}`}
                                      size="small"
                                      variant="outlined"
                                      style={{ textTransform: "capitalize" }}
                                    />
                                  </FlexBox>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}

                      <PaginationContainer
                        totalPages={activitiesData.totalPages}
                        currentPage={activitiesPage}
                        onPageChange={setActivitiesPage}
                        totalItems={activitiesData.totalItems}
                        itemName="activities"
                      />
                    </>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <AccessTimeIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Paragraph fontSize={16} color="text.secondary">
                        No activities found
                      </Paragraph>
                    </Box>
                  )}
                </Div>
              </TabPanel>

              {/* Tab 5: Health & Gear */}

              <TabPanel value="5" sx={{ p: 0 }}>
                <Div>
                  {/* Steps Section with Pagination */}
                  <Box mb={4}>
                    <Accordion style={{ borderRadius: "0" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="steps-content"
                        id="steps-header"
                      >
                        <FlexBox
                          alignItems="center"
                          gap={1}
                          style={{ borderRadius: "0" }}
                        >
                          <AccessTimeIcon color="primary" />
                          <H6 fontSize={16}>
                            Daily Steps (
                            {allDataOfSingleUser?.steps?.length || 0})
                          </H6>
                        </FlexBox>
                      </AccordionSummary>
                      <AccordionDetails style={{ borderRadius: "0" }}>
                        {stepsData.totalItems > 0 ? (
                          <>
                            {stepsData.items.map((step, idx) => (
                              <InfoCard
                                key={step.id}
                                sx={{ mb: 2 }}
                                style={{ borderRadius: "0" }}
                              >
                                <Box p={2}>
                                  <FlexBetween mb={2}>
                                    <Box>
                                      <Paragraph
                                        fontWeight={600}
                                        fontSize={16}
                                        color="primary.main"
                                      >
                                        {step.count?.toLocaleString()} steps
                                      </Paragraph>
                                      <Paragraph
                                        fontSize={12}
                                        color="text.secondary"
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {formatDate(step.date)} • Source:{" "}
                                        {step.source}
                                      </Paragraph>
                                    </Box>
                                  </FlexBetween>

                                  <Grid container spacing={2}>
                                    <Grid size={4}>
                                      <Box
                                        textAlign="center"
                                        p={1}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={14}
                                          fontWeight={600}
                                          color="info.main"
                                        >
                                          {parseFloat(
                                            step.distanceInMeter / 1000
                                          ).toFixed(2)}{" "}
                                          km
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={10}
                                          color="text.secondary"
                                        >
                                          Distance
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                    <Grid size={4}>
                                      <Box
                                        textAlign="center"
                                        p={1}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={14}
                                          fontWeight={600}
                                          color="warning.main"
                                        >
                                          {parseFloat(
                                            step.caloriesInKCal
                                          ).toFixed(1)}
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={10}
                                          color="text.secondary"
                                        >
                                          Calories
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                    <Grid size={4}>
                                      <Box
                                        textAlign="center"
                                        p={1}
                                        sx={{
                                          background: "#f8f9fa",
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Paragraph
                                          fontSize={14}
                                          fontWeight={600}
                                          color="success.main"
                                        >
                                          {parseFloat(step.coinsEarned).toFixed(
                                            2
                                          )}
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={10}
                                          color="text.secondary"
                                        >
                                          Coins Earned
                                        </Paragraph>
                                      </Box>
                                    </Grid>
                                  </Grid>

                                  {/* Progress toward daily target */}
                                  {allDataOfSingleUser?.dailyStepsTarget && (
                                    <Box mt={2}>
                                      <FlexBetween mb={0.5}>
                                        <Paragraph
                                          fontSize={11}
                                          color="text.secondary"
                                        >
                                          Daily Target Progress
                                        </Paragraph>
                                        <Paragraph
                                          fontSize={11}
                                          color="text.secondary"
                                        >
                                          {(
                                            (step.count /
                                              allDataOfSingleUser.dailyStepsTarget) *
                                            100
                                          ).toFixed(1)}
                                          %
                                        </Paragraph>
                                      </FlexBetween>
                                      <LinearProgress
                                        variant="determinate"
                                        value={Math.min(
                                          (step.count /
                                            allDataOfSingleUser.dailyStepsTarget) *
                                            100,
                                          100
                                        )}
                                        sx={{ height: 4, borderRadius: 2 }}
                                      />
                                    </Box>
                                  )}
                                </Box>
                              </InfoCard>
                            ))}

                            <PaginationContainer
                              totalPages={stepsData.totalPages}
                              currentPage={stepsPage}
                              onPageChange={setStepsPage}
                              totalItems={stepsData.totalItems}
                              itemName="steps"
                            />
                          </>
                        ) : (
                          <Box
                            textAlign="center"
                            py={3}
                            sx={{ background: "#f9f9f9", borderRadius: 2 }}
                          >
                            <Paragraph fontSize={14} color="text.secondary">
                              No daily steps data available
                            </Paragraph>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Gears Section with Pagination */}
                  <Box mb={4}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="gears-content"
                        id="gears-header"
                      >
                        <FlexBox alignItems="center" gap={1}>
                          <PersonIcon color="primary" />
                          <H6 fontSize={16}>
                            User Gears (
                            {allDataOfSingleUser?.gears?.length || 0})
                          </H6>
                        </FlexBox>
                      </AccordionSummary>

                      <AccordionDetails>
                        {gearsData.totalItems > 0 ? (
                          <>
                            <Stack spacing={2}>
                              {gearsData.items.map((gear) => (
                                <Box
                                  key={gear.id}
                                  sx={{
                                    p: 2,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar
                                    src={gear.photo}
                                    sx={{ width: 48, height: 48 }}
                                  >
                                    {gear.brand?.charAt(0) || "G"}
                                  </Avatar>

                                  <Box flex={1}>
                                    <Paragraph
                                      fontWeight={600}
                                      fontSize={14}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {gear.brand} {gear.model}
                                    </Paragraph>
                                    <Paragraph
                                      fontSize={12}
                                      color="text.secondary"
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {gear.type?.name} • {gear.sport?.name}
                                    </Paragraph>
                                    <Paragraph
                                      fontSize={11}
                                      color="text.disabled"
                                    >
                                      Added: {formatDate(gear.createdAt)}
                                    </Paragraph>
                                  </Box>

                                  <Paragraph
                                    fontSize={13}
                                    fontWeight={600}
                                    color="primary.main"
                                    sx={{ whiteSpace: "nowrap" }}
                                  >
                                    {gear.weight} kg
                                  </Paragraph>
                                </Box>
                              ))}
                            </Stack>

                            <PaginationContainer
                              totalPages={gearsData.totalPages}
                              currentPage={gearsPage}
                              onPageChange={setGearsPage}
                              totalItems={gearsData.totalItems}
                              itemName="gears"
                            />
                          </>
                        ) : (
                          <Box
                            textAlign="center"
                            py={3}
                            sx={{ background: "#f9f9f9", borderRadius: 2 }}
                          >
                            <PersonIcon
                              sx={{
                                fontSize: 32,
                                color: "text.secondary",
                                mb: 1,
                              }}
                            />
                            <Paragraph fontSize={14} color="text.secondary">
                              No gears registered by user
                            </Paragraph>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Reviews Section with Pagination */}
                  <Box mb={4}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="reviews-content"
                        id="reviews-header"
                      >
                        <FlexBox alignItems="center" gap={1}>
                          <HelpIcon color="primary" />
                          <H6 fontSize={16}>
                            User Reviews (
                            {allDataOfSingleUser?.reviews?.length || 0})
                          </H6>
                        </FlexBox>
                      </AccordionSummary>

                      <AccordionDetails>
                        {reviewsData.totalItems > 0 ? (
                          <>
                            {reviewsData.items.map((review) => (
                              <InfoCard key={review.id} sx={{ mb: 2 }}>
                                <Box p={2}>
                                  <Paragraph fontSize={13}>
                                    Review content will be displayed here
                                  </Paragraph>
                                </Box>
                              </InfoCard>
                            ))}

                            <PaginationContainer
                              totalPages={reviewsData.totalPages}
                              currentPage={reviewsPage}
                              onPageChange={setReviewsPage}
                              totalItems={reviewsData.totalItems}
                              itemName="reviews"
                            />
                          </>
                        ) : (
                          <Box
                            textAlign="center"
                            py={3}
                            sx={{ background: "#f9f9f9", borderRadius: 2 }}
                          >
                            <HelpIcon
                              sx={{
                                fontSize: 32,
                                color: "text.secondary",
                                mb: 1,
                              }}
                            />
                            <Paragraph fontSize={14} color="text.secondary">
                              No reviews written by user
                            </Paragraph>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Wallet Transactions with Pagination */}
                  <Box>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="transactions-content"
                        id="transactions-header"
                      >
                        <FlexBox alignItems="center" gap={1}>
                          <LocalOfferIcon color="primary" />
                          <H6 fontSize={16}>
                            Recent Wallet Transactions (
                            {allDataOfSingleUser?.walletTransactions?.length ||
                              0}
                            )
                          </H6>
                        </FlexBox>
                      </AccordionSummary>
                      <AccordionDetails>
                        {transactionsData.totalItems > 0 ? (
                          <>
                            {transactionsData.items.map((transaction) => (
                              <InfoCard key={transaction.id} sx={{ mb: 1 }}>
                                <Box p={2}>
                                  <FlexBetween>
                                    <Box>
                                      <Paragraph
                                        fontWeight={500}
                                        fontSize={14}
                                        color={
                                          transaction.type === "credit"
                                            ? "success.main"
                                            : "error.main"
                                        }
                                      >
                                        {transaction.type === "credit"
                                          ? "+"
                                          : "-"}
                                        ₹
                                        {parseFloat(transaction.amount).toFixed(
                                          2
                                        )}
                                      </Paragraph>
                                      <Paragraph
                                        fontSize={12}
                                        color="text.secondary"
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {transaction.source?.replace("_", " ")}{" "}
                                        •{" "}
                                        {formatDateTime(transaction.createdAt)}
                                      </Paragraph>
                                    </Box>
                                    <StatusChip
                                      label={transaction.status}
                                      status={
                                        transaction.status === "completed"
                                          ? "approved"
                                          : "pending"
                                      }
                                      size="small"
                                      style={{ textTransform: "capitalize" }}
                                    />
                                  </FlexBetween>
                                </Box>
                              </InfoCard>
                            ))}

                            <PaginationContainer
                              totalPages={transactionsData.totalPages}
                              currentPage={transactionsPage}
                              onPageChange={setTransactionsPage}
                              totalItems={transactionsData.totalItems}
                              itemName="transactions"
                            />
                          </>
                        ) : (
                          <Box
                            textAlign="center"
                            py={3}
                            sx={{ background: "#f9f9f9", borderRadius: 2 }}
                          >
                            <LocalOfferIcon
                              sx={{
                                fontSize: 32,
                                color: "text.secondary",
                                mb: 1,
                              }}
                            />
                            <Paragraph fontSize={14} color="text.secondary">
                              No wallet transactions found
                            </Paragraph>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Div>
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Grid container spacing={3}>
            {/* ORGANIZER DETAILS */}
            {/* <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <PersonIcon color="action" />
                    <Paragraph fontWeight={600}>Organizer Details</Paragraph>
                  </SectionHeader>
                  {usersData?.organizer ? (
                    <FlexBox alignItems="center" gap={1.5}>
                      <StyledAvatar
                        alt="Organizer"
                        src={usersData?.organizer?.companyLogo}
                      />
                      <div>
                        <Paragraph fontWeight={500}>
                          {usersData?.organizer?.name}
                        </Paragraph>
                        <Paragraph fontSize={13} color="text.secondary">
                          {usersData?.organizer?.companyName}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          {usersData?.organizer?.phoneNumber}
                        </Paragraph>
                        <Paragraph fontSize={12} color="text.secondary">
                          {usersData?.organizer?.email}
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
            </Grid> */}

            {/* STATUS */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <Paragraph fontWeight={600}>User Status</Paragraph>
                  </SectionHeader>
                  <Switch checked={usersData?.isActive} />
                </Div>
              </Card>
            </Grid>

            {/* NOTIFICATION PREFERENCES */}
            <Grid size={12}>
              <Card>
                <Div>
                  <SectionHeader>
                    <Paragraph fontWeight={600}>
                      Notification Preferences
                    </Paragraph>
                  </SectionHeader>

                  {usersData?.notificationPreferences?.length > 0 ? (
                    usersData.notificationPreferences.map((pref) => (
                      <Chip
                        fontSize={14}
                        color="primary"
                        label={pref.type.replace(/_/g, " ")}
                        style={{ textTransform: "capitalize", margin: "5px" }}
                      />
                    ))
                  ) : (
                    <Paragraph fontSize={14} color="text.secondary">
                      No preferences set
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
