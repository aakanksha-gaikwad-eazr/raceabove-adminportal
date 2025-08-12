import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  Divider,
  Avatar,
  Paper,
  IconButton,
  Skeleton,
  Alert,
  Container,
  Tooltip,
  AvatarGroup,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Close from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InfoIcon from "@mui/icons-material/Info";
import { format } from "date-fns";
import {
  getChallengesById,
  reviewChallenges,
} from "@/store/apps/challenges";
import toast from "react-hot-toast";
import MoreButton from "@/components/more-button";
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import CircularProgress from "@mui/material/CircularProgress";

// Styled Components
const StyledAvatar = styled(Avatar)({
  width: 34,
  height: 34,
});

const RightContentWrapper = styled("div")({
  gap: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`challenge-tabpanel-${index}`}
      aria-labelledby={`challenge-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `challenge-tab-${index}`,
    "aria-controls": `challenge-tabpanel-${index}`,
  };
}

// Dialog Styles
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
    padding: theme.spacing(1),
    maxWidth: 500,
    width: "100%",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  "& .MuiDialogTitle": {
    fontWeight: 700,
    fontSize: "1.4rem",
    padding: theme.spacing(0, 0, theme.spacing(2)),
    color: theme.palette.primary.main,
    textAlign: "center",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: theme.spacing(1),
      left: "25%",
      right: "25%",
      height: 2,
      background:
        "linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent)",
    },
  },
  "& .MuiDialogContent": {
    padding: theme.spacing(2, 0, theme.spacing(3)),
    textAlign: "center",
  },
  "& .MuiDialogActions": {
    padding: theme.spacing(2, 0, 0),
    justifyContent: "center",
    gap: theme.spacing(2),
  },
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    },
  },
  "& .MuiButton-root": {
    borderRadius: 12,
    fontWeight: 600,
    padding: "10px 24px",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
}));

const DialogButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  border: "1px solid",
  fontWeight: 600,
  padding: "12px 28px",
  textTransform: "none",
  transition: "all 0.3s ease",
  boxShadow: "none",
  minWidth: 140,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  ...(variant === "primary" && {
    color: "grey",
    "&:hover": {
      background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
      color: "white",
    },
  }),
  ...(variant === "success" && {
    borderColor: "green",
    color: "grey",
    "&:hover": {
      background: "linear-gradient(45deg, #388E3C, #2E7D32)",
      color: "white",
    },
  }),
  ...(variant === "error" && {
    borderColor: "red",
    color: "grey",
    "&:hover": {
      background: "linear-gradient(45deg, #D32F2F, #C62828)",
      color: "white",
    },
  }),
  ...(variant === "outlined" && {
    background: "transparent",
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    "&:hover": {
      background: "rgba(102, 126, 234, 0.08)",
      borderColor: theme.palette.primary.dark,
    },
  }),
}));

// Enhanced Tab Styles
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(3),
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: 3,
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.875rem",
  minHeight: 48,
  textTransform: "none",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "& .MuiTab-iconWrapper": {
    marginBottom: 0,
    marginRight: theme.spacing(1),
  },
}));

// Skeleton loader component
const DetailsSkeleton = () => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="text" width={150} height={24} />
    </Stack>
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton
              variant="text"
              width="100%"
              height={16}
              sx={{ mt: 1.5 }}
            />
            <Skeleton variant="text" width="90%" height={16} />
            <Skeleton variant="text" width="95%" height={16} />
            <Skeleton
              variant="text"
              width="30%"
              height={20}
              sx={{ mt: 3 }}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={16}
              sx={{ mt: 1.5 }}
            />
            <Skeleton variant="text" width="85%" height={16} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton
              variant="rounded"
              width={80}
              height={24}
              sx={{ mt: 1 }}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={16}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default function ChallengeDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getChallengeID = localStorage.getItem("challengeId");
  const [isLoading, setIsLoading] = useState(true);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(""); // 'approve' or 'reject'
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reviewReason, setReviewReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [challengeData, setChallengeData] = useState({
    participants: [],
    qualifyingSports: [],
  });
  const [activeTab, setActiveTab] = useState(0);

  // Fetch Challenge data
  useEffect(() => {
    const fetchChallengeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(
          getChallengesById(getChallengeID)
        );
        setChallengeData(response?.payload);
      } catch (error) {
        console.error("Error fetching Challenge details:", error);
        toast.error("Failed to load Challenge details");
      } finally {
        setIsLoading(false);
      }
    };
    if (getChallengeID) {
      fetchChallengeDetails();
    }
  }, [getChallengeID, dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReviewClick = () => {
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setShowReasonInput(false);
    setReviewReason("");
    setReviewAction("");
  };

  const handleSubmitReview = async () => {
    try {
      setIsProcessing(true);
      const requestBody = {
        approvalStatus:
          reviewAction === "approve" ? "approved" : "rejected",
        reviewReason: reviewReason.trim(),
      };
      console.log(`Action: ${reviewAction}, Reason: ${reviewReason}`);
      console.log("Challenge ID:", getChallengeID);
      console.log("Request Body:", requestBody);
      const response = await dispatch(
        reviewChallenges({
          challengeId: getChallengeID,
          reviewData: requestBody,
        })
      );
      console.log("Full response:", response);
      // Check if the response was successful
      if (
        response?.type ===
          "appChallenges/reviewChallenges/fulfilled" &&
        response?.payload?.status === 200
      ) {
        const action =
          reviewAction === "approve" ? "approved" : "rejected";
        if (reviewAction === "approve") {
          toast.success(`Challenge ${action} successfully!`);
        } else {
          toast.error(`Challenge ${action} successfully!`);
        }
        // Refresh the challenge data
        const freshData = await dispatch(
          getChallengesById(getChallengeID)
        );
        setChallengeData(freshData?.payload);
        // Reset states and close modal
        setShowReasonInput(false);
        setReviewReason("");
        setReviewAction("");
        setOpenReviewModal(false);
      } else if (
        response?.type === "appChallenges/reviewChallenges/rejected"
      ) {
        console.error(
          "API rejected:",
          response.payload || response.error
        );
        toast.error("Failed to review challenge. Please try again.");
      } else {
        console.error("Unexpected response:", response);
        toast.error("Failed to review challenge. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSubmitReview:", error);
      toast.error("Error reviewing challenge. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircleIcon fontSize="small" color="success" />;
      case "rejected":
        return <CancelIcon fontSize="small" color="error" />;
      case "pending":
        return <PendingIcon fontSize="small" color="warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getChallengeTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "collective":
        return "primary";
      case "individual":
        return "secondary";
      case "team":
        return "info";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DetailsSkeleton />
      </Container>
    );
  }

  if (!challengeData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">Challenge not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          size="small"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={500}>
          Challenge Details
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Main Content with Tabs */}
        <Grid item xs={12} md={8}>
          <Card
            variant="outlined"
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            {/* Enhanced Tabs Header */}
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="challenge details tabs"
              variant="fullWidth"
            >
              <StyledTab
                icon={<InfoIcon />}
                label="Overview"
                {...a11yProps(0)}
              />
              <StyledTab
                icon={<PeopleIcon />}
                label="Participants"
                {...a11yProps(1)}
              />
              <StyledTab
                icon={<EmojiEventsIcon />}
                label="Rewards"
                {...a11yProps(2)}
              />
            </StyledTabs>

            {/* Tab Panels */}
            <Box sx={{ p: 3 }}>
              {/* Overview Tab */}
              <TabPanel value={activeTab} index={0}>
                <Box sx={{ mb: 3 }}>
                  <FlexBetween>
                    <H6 fontSize={18} mb={1}>
                      {challengeData?.title?.toUpperCase()}
                    </H6>
                    <Chip
                      label={
                        challengeData.challengeType
                          ? challengeData.challengeType
                              .charAt(0)
                              .toUpperCase() +
                            challengeData.challengeType.slice(1)
                          : "N/A"
                      }
                      color={getChallengeTypeColor(
                        challengeData.challengeType
                      )}
                      size="small"
                    />
                  </FlexBetween>

                  <Paragraph
                    lineHeight={1.75}
                    color="text.secondary"
                    dangerouslySetInnerHTML={{
                      __html: challengeData?.description,
                    }}
                  />

                  <Stack
                    direction="row"
                    spacing={2}
                    mt={2}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Start Date
                      </Typography>
                      <Typography variant="subtitle2">
                        {formatDate(challengeData?.startDate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        End Date
                      </Typography>
                      <Typography variant="subtitle2">
                        {formatDate(challengeData?.endDate)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Challenge Banner */}
                <div
                  className="img-wrapper"
                  style={{
                    textAlign: "center",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  <img
                    src={challengeData?.banner}
                    alt="Challenge Banner"
                    style={{
                      height: "250px",
                      borderRadius: "20px",
                      width: "100%",
                      padding: "1rem",
                      maxWidth: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <Divider />

                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    {/* TASKS */}
                    <Grid item xs={12} sm={7}>
                      <Paragraph fontWeight={600} mb={2}>
                        Qualifying Sports
                      </Paragraph>
                      {challengeData?.qualifyingSports?.map(
                        (sport) => (
                          <div
                            key={sport.id}
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                          >
                            <Paragraph
                              lineHeight={1}
                              fontWeight={500}
                              style={{ marginRight: "15px" }}
                            >
                              {sport.name}
                            </Paragraph>
                            <Avatar
                              src={sport.icon}
                              alt={sport.name}
                              sx={{
                                width: 24,
                                height: 24,
                                mt: 0.5,
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                        )
                      )}
                    </Grid>

                    {/* PARTICIPANTS */}
                    <Grid item xs={12} sm={5}>
                      <Paragraph fontWeight={600} mb={2}>
                        Participants
                      </Paragraph>
                      <AvatarGroup max={4}>
                        {challengeData?.participants?.length > 0 ? (
                          challengeData.participants.map(
                            (participant) => (
                              <Tooltip
                                key={participant?.participantId}
                                title={participant?.participantName}
                                arrow
                                placement="top"
                              >
                                <Avatar
                                  alt={participant?.participantName}
                                  src={
                                    participant?.participantProfilePhoto
                                  }
                                />
                              </Tooltip>
                            )
                          )
                        ) : (
                          <Paragraph
                            fontSize={14}
                            style={{ width: "90px", border: "none" }}
                            color="text.secondary"
                          >
                            No Participants
                          </Paragraph>
                        )}
                      </AvatarGroup>
                      <Box mt={2}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Participants Count
                        </Typography>
                        <Typography variant="body2">
                          {challengeData.participantsCount || "0"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Review REASONS */}
                {challengeData.reviewReason && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="primary.500"
                        gutterBottom
                      >
                        Review Reasons
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          backgroundColor: "warning.lighter",
                          borderColor: "primary.300",
                          borderRadius: "15px",
                          textTransform: "capitalize",
                        }}
                      >
                        <Typography variant="body2">
                          {challengeData.reviewReason}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}

                {/* Metadata */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    gutterBottom
                  >
                    Information
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
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
                            {challengeData.createdBy || "Unknown"}
                            {challengeData.createdByRole && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                style={{
                                  textTransform: "capitalize",
                                }}
                              >
                                {" "}
                                • {challengeData.createdByRole}
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
                            {formatDate(challengeData.createdAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        {challengeData.updatedBy && (
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
                              {challengeData.updatedBy}
                              {challengeData.updatedByRole && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  style={{
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {" "}
                                  • {challengeData.updatedByRole}
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                        )}
                        {challengeData?.updatedAt && (
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Updated On
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(challengeData?.updatedAt)}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Participants Tab */}
              <TabPanel value={activeTab} index={1}>
                <Box sx={{ mb: 3 }}>
                  <H6 fontSize={18} mb={3}>
                    Participants
                  </H6>

                  {challengeData?.participants?.length > 0 ? (
                    <Grid container spacing={2}>
                      {challengeData.participants.map(
                        (participant) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={participant.participantId}
                          >
                            <Card
                              variant="outlined"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 2,
                              }}
                            >
                              <Avatar
                                src={
                                  participant.participantProfilePhoto
                                }
                                alt={participant.participantName}
                                sx={{ width: 50, height: 50, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle2">
                                  {participant.participantName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ID: {participant.participantId}
                                </Typography>
                              </Box>
                            </Card>
                          </Grid>
                        )
                      )}
                    </Grid>
                  ) : (
                    <Box textAlign="center" py={5}>
                      <PeopleIcon
                        sx={{
                          fontSize: 60,
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No participants yet
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        This challenge doesn't have any participants
                        at the moment.
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <H6 fontSize={18} mb={3}>
                    Leaderboard
                  </H6>

                  {Object.keys(challengeData.leaderboard || {})
                    .length > 0 ? (
                    <Grid container spacing={2}>
                      {Object.entries(challengeData.leaderboard).map(
                        ([rank, participant], index) => (
                          <Grid item xs={12} key={index}>
                            <Card
                              variant="outlined"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor:
                                    index === 0
                                      ? "gold"
                                      : index === 1
                                        ? "silver"
                                        : index === 2
                                          ? "#cd7f32"
                                          : "grey",
                                  color: "white",
                                  fontWeight: "bold",
                                  mr: 2,
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Avatar
                                src={
                                  participant.participantProfilePhoto
                                }
                                alt={participant.participantName}
                                sx={{ width: 50, height: 50, mr: 2 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2">
                                  {participant.participantName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Score: {participant.score || "N/A"}
                                </Typography>
                              </Box>
                            </Card>
                          </Grid>
                        )
                      )}
                    </Grid>
                  ) : (
                    <Box textAlign="center" py={5}>
                      <EmojiEventsIcon
                        sx={{
                          fontSize: 60,
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No leaderboard data
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Leaderboard will be available once
                        participants join the challenge.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              {/* Rewards Tab */}
              <TabPanel value={activeTab} index={2}>
                <Box sx={{ mb: 3 }}>
                  <H6 fontSize={18} mb={3}>
                    Reward Details
                  </H6>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={500}
                          gutterBottom
                        >
                          Reward Structure
                        </Typography>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Reward Coins Interval
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.rewardCoinsInterval ||
                              "N/A"}
                          </Typography>
                        </Box>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Reward Coins Per Interval
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.rewardCoinsPerInterval ||
                              "N/A"}
                          </Typography>
                        </Box>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Reward Coins Multiplier
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.rewardCoinsMultiplier ||
                              "N/A"}
                          </Typography>
                        </Box>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Max Reward Coins
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.maxRewardCoins || "N/A"}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={500}
                          gutterBottom
                        >
                          Reward Description
                        </Typography>

                        <Box mt={2}>
                          <Typography variant="body1">
                            {challengeData.reward ||
                              "No reward description available"}
                          </Typography>
                        </Box>

                        <Box mt={3}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={500}
                            gutterBottom
                          >
                            Challenge Badge
                          </Typography>
                          <Box
                            display="flex"
                            justifyContent="center"
                            mt={2}
                          >
                            <Avatar
                              src={challengeData.badge}
                              alt="Challenge Badge"
                              sx={{ width: 100, height: 100 }}
                            />
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <H6 fontSize={18} mb={3}>
                    Target Details
                  </H6>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={500}
                          gutterBottom
                        >
                          Basic Information
                        </Typography>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Target Value
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.targetValue || "N/A"}
                          </Typography>
                        </Box>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Target Unit
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.targetUnit || "N/A"}
                          </Typography>
                        </Box>

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Target Description
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.targetDescription || "N/A"}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={500}
                          gutterBottom
                        >
                          Challenge Settings
                        </Typography>

                        {challengeData.dailyTargetValue && (
                          <Box mt={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Daily Target Value
                            </Typography>
                            <Typography variant="body2">
                              {challengeData.dailyTargetValue}
                            </Typography>
                          </Box>
                        )}

                        {challengeData.minActiveDays && (
                          <Box mt={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Minimum Active Days
                            </Typography>
                            <Typography variant="body2">
                              {challengeData.minActiveDays}
                            </Typography>
                          </Box>
                        )}

                        {challengeData.totalDays && (
                          <Box mt={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Total Days
                            </Typography>
                            <Typography variant="body2">
                              {challengeData.totalDays}
                            </Typography>
                          </Box>
                        )}

                        {challengeData.dailyCompletionThreshold && (
                          <Box mt={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Daily Completion Threshold
                            </Typography>
                            <Typography variant="body2">
                              {challengeData.dailyCompletionThreshold}
                              %
                            </Typography>
                          </Box>
                        )}

                        <Box mt={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Require Consecutive Days
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.requireConsecutiveDays
                              ? "Yes"
                              : "No"}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </Box>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <RightContentWrapper>
            {/* Status Card */}
            <Card variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  gutterBottom
                >
                  Approval Status
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 1.5, mb: 2 }}
                >
                  <Chip
                    label={
                      challengeData.approvalStatus
                        ? challengeData.approvalStatus
                            .charAt(0)
                            .toUpperCase() +
                          challengeData.approvalStatus.slice(1)
                        : "N/A"
                    }
                    color={getStatusColor(
                      challengeData.approvalStatus
                    )}
                    size="small"
                  />
                </Stack>
                {challengeData.reviewedBy && (
                  <Box mb={2}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Reviewed By
                    </Typography>
                    <Typography variant="body2">
                      {challengeData.reviewedBy}
                    </Typography>
                  </Box>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={handleReviewClick}
                >
                  {challengeData.approvalStatus !== "pending"
                    ? "Re-review Challenge"
                    : "Review Challenge"}
                </Button>
              </CardContent>
            </Card>

            {/* Organizer Info Card */}
            {challengeData.organizer && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    gutterBottom
                  >
                    Organizer Details
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {challengeData?.organizer?.companyLogo && (
                      <Box display="flex" my={2}>
                        <Avatar
                          src={challengeData.organizer.companyLogo}
                          alt={
                            challengeData.organizer.name ||
                            "Organizer"
                          }
                          sx={{
                            width: 60,
                            height: 60,
                            border: "2px solid",
                            borderColor: "divider",
                          }}
                        />
                      </Box>
                    )}
                    <Stack spacing={1.5}>
                      {challengeData.organizer.name && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Name
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.organizer.name}
                          </Typography>
                        </Box>
                      )}
                      {challengeData.organizer.companyName && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Company
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.organizer.companyName}
                          </Typography>
                        </Box>
                      )}
                      {challengeData.organizer.phoneNumber && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Phone
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.organizer.phoneNumber}
                          </Typography>
                        </Box>
                      )}
                      {challengeData.organizer.email && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Email
                          </Typography>
                          <Typography variant="body2">
                            {challengeData.organizer.email}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Status */}
            <Card variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  gutterBottom
                >
                  Status
                </Typography>
                <Chip
                  label={
                    challengeData.isActive ? "Active" : "Inactive"
                  }
                  color={
                    challengeData.isActive ? "success" : "default"
                  }
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </RightContentWrapper>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <StyledDialog
        open={openReviewModal}
        onClose={handleCloseReviewModal}
      >
        <IconButton
          onClick={handleCloseReviewModal}
          sx={{
            color: "text.secondary",
            position: "absolute",
            top: "8px",
            right: "8px",
            border: "0.1px solid #f5f5dbff",
            "&:hover": {
              color: "text.primary",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Close />
        </IconButton>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "primary.main",
                textAlign: "center",
                flex: 1,
              }}
            >
              Review Challenge
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {!showReasonInput ? (
            <Box sx={{ py: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 4, fontSize: "1.1rem" }}
              >
                Do you want to approve or reject this challenge?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  mb: 2,
                }}
              >
                <Typography
                  variant="paragraph1"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    textTransform: "capitalize",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  {challengeData?.title || "Challenge Title"}
                </Typography>
                <Avatar
                  src={challengeData?.banner}
                  sx={{
                    width: 300,
                    height: 150,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                }}
              >
                Please provide a reason for{" "}
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      reviewAction === "approve"
                        ? "#4CAF50"
                        : "#F44336",
                  }}
                >
                  {reviewAction === "approve"
                    ? "approving"
                    : "rejecting"}
                </span>{" "}
                this challenge:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter your reason here..."
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-input": {
                    fontSize: "1rem",
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!showReasonInput ? (
            <>
              <DialogButton
                onClick={() => {
                  setReviewAction("reject");
                  setShowReasonInput(true);
                }}
                variant="error"
              >
                Reject
              </DialogButton>
              <DialogButton
                onClick={() => {
                  setReviewAction("approve");
                  setShowReasonInput(true);
                }}
                variant="success"
              >
                Approve
              </DialogButton>
            </>
          ) : (
            <>
              <DialogButton
                onClick={() => {
                  setShowReasonInput(false);
                  setReviewReason("");
                  setReviewAction("");
                }}
                variant="outlined"
              >
                Back
              </DialogButton>
              <DialogButton
                onClick={handleSubmitReview}
                variant={
                  reviewAction === "approve" ? "success" : "error"
                }
                disabled={!reviewReason.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={16} color="inherit" />
                    <span>Processing...</span>
                  </Box>
                ) : (
                  `Submit ${reviewAction === "approve" ? "Approval" : "Rejection"}`
                )}
              </DialogButton>
            </>
          )}
        </DialogActions>
      </StyledDialog>
    </Container>
  );
}
