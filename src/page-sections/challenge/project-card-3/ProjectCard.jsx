import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import {
  MoreHoriz,
  CheckCircle,
  Cancel,
  Close,
  RateReview,
  CalendarToday,
  Schedule,
  People,
  TrendingUp,
  Star,
} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// CUSTOM COMPONENTS
import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, H5, Paragraph } from "@/components/typography";
import MoreButtontwo from "@/components/more-button-two";

// STYLED COMPONENTS
import { reviewChallenges } from "@/store/apps/challenges";
import ApproveChallengeForm from "../approvalFormModal";
import { TextField } from "@mui/material";
import toast from "react-hot-toast";

// Enhanced Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    zIndex: 1,
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(transparent, rgba(0, 0, 0, 0.3))",
  },
}));

// const StatusBadge = styled(Chip)(({ theme, status }) => ({
//   position: "absolute",
//   top: 12,
//   right: 12,
//   zIndex: 2,
//   backdropFilter: "blur(10px)",
//   backgroundColor:
//     status === "approved"
//       ? "rgba(76, 175, 80, 0.9)"
//       : status === "rejected"
//         ? "rgba(244, 67, 54, 0.9)"
//         : "rgba(255, 152, 0, 0.9)",
//   color: "white",
//   fontWeight: 600,
//   fontSize: "0.75rem",
// }));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 10,
  backgroundColor:
    status === "approved"
      ? "#4CAF50" // Solid green
      : status === "rejected"
        ? "#F44336" // Solid red
        : "#FF9800", // Solid orange
  color: "white",
  fontWeight: 700,
  fontSize: "0.75rem",
  border: "2px solid white", // White border for contrast
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.7)",
  minWidth: "auto",
  height: "auto",
  padding: "6px 12px",
  "& .MuiChip-icon": {
    color: "white",
    fontSize: "16px",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))",
  },
  "& .MuiChip-label": {
    padding: "0 4px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  "& .MuiChip-icon": {
    color: theme.palette.primary.main,
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  borderRadius: 12,
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)",
  },
}));

export default function ChallengeCard3({ challenges, isAdmin = false }) {
  const navigate = useNavigate();
  const [allChallenges, setAllChallenges] = useState([]);
  const [isApprovalStatus, setIsApprovalStatus] = useState(
    challenges?.approvalStatus
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(""); // 'approve' or 'reject'
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reviewReason, setReviewReason] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (challenges?.id) {
      setAllChallenges(challenges);
      setIsApprovalStatus(challenges?.approvalStatus);
    }
  }, [challenges]);

  const handleChallengeDetailsClick = (id) => {
    localStorage.setItem("challengeId", id);
    navigate("/challenges/details");
  };

  const handleOpenReviewModal = () => {
    // Your modal opening logic here
    console.log("Opening review modal");
    setOpenReviewModal(true);
  };

  // Smart date formatting
  const formatSmartDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Ended", color: "error", icon: <Cancel /> };
    } else if (diffDays === 0) {
      return { text: "Today", color: "warning", icon: <Schedule /> };
    } else if (diffDays === 1) {
      return { text: "Tomorrow", color: "success", icon: <Schedule /> };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days`, color: "primary", icon: <Schedule /> };
    } else {
      return {
        text: date.toLocaleDateString(),
        color: "default",
        icon: <CalendarToday />,
      };
    }
  };

  // Calculate challenge progress (mock data - replace with actual logic)
  const getChallengeProgress = () => {
    const startDate = new Date(allChallenges?.startDate);
    const endDate = new Date(allChallenges?.endDate);
    const now = new Date();

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const total = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / total) * 100);
  };

  const getStatusChip = () => {
    const statusConfig = {
      approved: { label: "Approved", color: "success", icon: <CheckCircle /> },
      rejected: { label: "Rejected", color: "error", icon: <Cancel /> },
      pending: {
        label: "Pending Review",
        color: "warning",
        icon: <Schedule />,
      },
    };

    const config = statusConfig[isApprovalStatus] || statusConfig.pending;
    return (
      <StatusBadge
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        status={isApprovalStatus}
      />
    );
  };
  
  const handleSubmitReview = async () => {
    try {
      setIsProcessing(true);
  
      const requestBody = {
        approvalStatus: reviewAction === "approve" ? "approved" : "rejected",
        reviewReason: reviewReason.trim(),
      };
  
      console.log(`Action: ${reviewAction}, Reason: ${reviewReason}`);
      console.log("Challenge ID:", allChallenges?.id);
      console.log("Request Body:", requestBody);
  
      const response = await dispatch(
        reviewChallenges({
          challengeId: allChallenges?.id,
          reviewData: requestBody,
        })
      );
      
      console.log("Full response:", response);
  
      // Check if the response was successful
      if (response?.type === "appChallenges/reviewChallenges/fulfilled" && response?.payload?.status === 200) {
        const action = reviewAction === "approve" ? "approved" : "rejected";
        
        if (reviewAction === "approve") {
          toast.success(`Challenge ${action} successfully!`);
        } else {
          toast.error(`Challenge ${action} successfully!`);
        }
        
        setIsApprovalStatus(requestBody.approvalStatus);
  
        // Reset states and close modal
        setShowReasonInput(false);
        setReviewReason("");
        setReviewAction("");
        setOpenReviewModal(false);
      } else if (response?.type === "appChallenges/reviewChallenges/rejected") {
        // Handle rejected case
        console.error("API rejected:", response.payload || response.error);
        toast.error("Failed to review challenge. Please try again.");
      } else {
        // Handle other error cases
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
  
  // Also update the handleCloseReviewModal function to reset showReasonInput
  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setShowReasonInput(false);
    setReviewReason("");
    setReviewAction("");
  };
  
  const startDateInfo = formatSmartDate(allChallenges?.startDate);
  const endDateInfo = formatSmartDate(allChallenges?.endDate);
  const progress = getChallengeProgress();

  return (
    <StyledCard>
      {/* Status Badge */}
      {getStatusChip()}

      {/* Challenge Image */}
       <StyledCardMedia
        image={allChallenges?.banner}
        title={allChallenges?.title}
      />

      <CardContent sx={{ p: 3, height: "300px" }}>
        {/* Title */}
        <Link
          href="/challenges/details"
          onClick={() => handleChallengeDetailsClick(allChallenges?.id)}
          style={{ textDecoration: "none" }}
        >
          <Tooltip title={allChallenges?.title || "No title"}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "text.primary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {allChallenges?.title || "No title"}
            </Typography>
          </Tooltip>
        </Link>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{
            __html: allChallenges?.description || "No description available",
          }}
        />

        {/* Date Information */}
        <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 2 }}>
          <InfoChip
            size="small"
            icon={startDateInfo.icon}
            label={`Starts: ${startDateInfo.text}`}
            color={startDateInfo.color}
          />
          <InfoChip
            size="small"
            icon={endDateInfo.icon}
            label={`Ends: ${endDateInfo.text}`}
            color={endDateInfo.color}
          />
        </Box>

        {/* Bottom Section */}
        <FlexBetween sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  border: "2px solid white",
                },
              }}
            >
              <Avatar alt="Challenge Badge" src={allChallenges?.badge} />
              <Avatar sx={{ bgcolor: "primary.main", fontSize: "0.8rem" }}>
                +5
              </Avatar>
            </AvatarGroup>
            <Typography variant="caption" color="text.secondary">
              badges
            </Typography>
          </Box>
        </FlexBetween>

        {/* Action Button */}
        {isApprovalStatus === "pending" && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<RateReview />}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenReviewModal();
            }}
            sx={{
              mt: 1,
              mb: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
              },
            }}
            disabled={isProcessing}
            fullWidth
          >
            {isProcessing ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <span>Processing...</span>
              </Box>
            ) : (
              `Review`
            )}
          </Button>
        )}
      </CardContent>

{/* dialog box */}
      <Dialog open={openReviewModal} onClose={handleCloseReviewModal}>
        <DialogTitle>Review Challenge</DialogTitle>
        <DialogContent>
          {!showReasonInput ? (
            <Typography>
              Do you want to approve the challenge or reject?
            </Typography>
          ) : (
            <div>
              <Typography sx={{ mb: 2 }}>
                Please provide a reason for{" "}
                {reviewAction === "approve" ? "approving" : "rejecting"} this
                challenge:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter your reason here..."
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                sx={{ mb: 2 }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {!showReasonInput ? (
            <>
              <Button
                onClick={() => {
                  setReviewAction("reject");
                  setShowReasonInput(true);
                }}
                color="error"
                variant="outlined"
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  setReviewAction("approve");
                  setShowReasonInput(true);
                }}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setShowReasonInput(false);
                  setReviewReason("");
                  setReviewAction("");
                }}
                color="inherit"
                variant="outlined"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmitReview}
                color={reviewAction === "approve" ? "success" : "error"}
                variant="contained"
                disabled={!reviewReason.trim() || isProcessing}
                sx={{
                  minWidth: 120,
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                    color: "rgba(0, 0, 0, 0.26)",
                  },
                }}
              >
                {isProcessing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <span>Processing...</span>
                  </Box>
                ) : (
                  `Submit ${reviewAction === "approve" ? "Approval" : "Rejection"}`
                )}{" "}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}
