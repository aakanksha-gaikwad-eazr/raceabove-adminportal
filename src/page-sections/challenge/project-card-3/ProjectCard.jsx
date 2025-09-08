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
import { CircularProgress, IconButton } from "@mui/material";
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
  AccessTime,
  EventAvailable,
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

// Clean, elegant styled components without animations
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "box-shadow 0.2s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 160,
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "12px 12px 0 0",
}));

// Clean status badge design
const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  fontSize: "0.7rem",
  height: 24,
  borderRadius: 6,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  ...(status === "approved" && {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    "& .MuiChip-icon": {
      color: "#2e7d32",
    },
  }),
  ...(status === "rejected" && {
    backgroundColor: "#ffebee",
    color: "#c62828",
    "& .MuiChip-icon": {
      color: "#c62828",
    },
  }),
  ...(status === "pending" && {
    backgroundColor: "#fff3e0",
    color: "#e65100",
    "& .MuiChip-icon": {
      color: "#e65100",
    },
  }),
  "& .MuiChip-label": {
    padding: "0 8px",
  },
  "& .MuiChip-icon": {
    fontSize: "14px",
    marginLeft: "4px",
  },
}));

const InfoChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 8px",
  borderRadius: 6,
  backgroundColor: theme.palette.grey[50],
  fontSize: "0.75rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  "& svg": {
    fontSize: "14px",
  },
}));

const DescriptionBox = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
  height: 50, // Fixed height for description
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  textOverflow: "ellipsis",
  textTransform:"capitalize"
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&.MuiButton-outlined": {
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light + "10",
    },
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    padding: theme.spacing(2),
    maxWidth: 500,
    width: "100%",
  },
}));

const DialogButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  fontWeight: 600,
  padding: "10px 24px",
  textTransform: "none",
  minWidth: 120,
  ...(variant === "success" && {
    backgroundColor: "#4CAF50",
    color: "white",
    "&:hover": {
      backgroundColor: "#388E3C",
    },
  }),
  ...(variant === "error" && {
    backgroundColor: "#F44336",
    color: "white",
    "&:hover": {
      backgroundColor: "#D32F2F",
    },
  }),
  ...(variant === "outlined" && {
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.grey[50],
    },
  }),
}));

export default function ChallengeCard3({
  challenges,
  isAdmin = false,
}) {
  const navigate = useNavigate();
  const [allChallenges, setAllChallenges] = useState([]);
  const [isApprovalStatus, setIsApprovalStatus] = useState(
    challenges?.approvalStatus
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState("");
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
    setOpenReviewModal(true);
  };

  // Smart date formatting
  const formatSmartDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: "Ended", color: "error" };
    } else if (diffDays === 0) {
      return { text: "Today", color: "warning" };
    } else if (diffDays === 1) {
      return { text: "Tomorrow", color: "success" };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days`, color: "primary" };
    } else {
      return { text: date.toLocaleDateString(), color: "default" };
    }
  };

  // Calculate challenge progress
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
      approved: {
        label: "Approved",
        icon: <CheckCircle />,
      },
      rejected: {
        label: "Rejected",
        icon: <Cancel />,
      },
      pending: {
        label: "Pending",
        icon: <Schedule />,
      },
    };
    const config = statusConfig[isApprovalStatus] || statusConfig.pending;
    return (
      <StatusBadge
        label={config.label}
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
      
      const response = await dispatch(
        reviewChallenges({
          challengeId: allChallenges?.id,
          reviewData: requestBody,
        })
      );
      
      if (
        response?.type === "appChallenges/reviewChallenges/fulfilled" &&
        response?.payload?.status === 200
      ) {
        const action = reviewAction === "approve" ? "approved" : "rejected";
        if (reviewAction === "approve") {
          toast.success(`Challenge ${action} successfully!`);
        } else {
          toast.error(`Challenge ${action} successfully!`);
        }
        setIsApprovalStatus(requestBody.approvalStatus);
        setShowReasonInput(false);
        setReviewReason("");
        setReviewAction("");
        setOpenReviewModal(false);
      } else {
        toast.error("Failed to review challenge. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSubmitReview:", error);
      toast.error("Error reviewing challenge. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
      {/* Challenge Image */}
      <StyledCardMedia
        image={allChallenges?.banner}
        title={allChallenges?.title}
      />
      
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Typography
            variant="h6"
            component="h4"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              flex: 1,
              pr: 1,
              color: "text.primary",
              height:"60px",
              cursor: "pointer",
              "&:hover": {
                color: "primary.main",
              },
            }}
            style={{textTransform:"capitalize"}}
            onClick={() => handleChallengeDetailsClick(allChallenges?.id)}
          >
            {allChallenges?.title || "No title"}
          </Typography>
          {getStatusChip()}
        </Box>

        {/* Fixed Height Description */}
        <DescriptionBox
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: allChallenges?.description || "No description available",
          }}
        />

        {/* Date Information - Simplified */}
        <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
          <InfoChip >
            <AccessTime sx={{color:"primary.main"}}/>
            <span>Starts: {startDateInfo.text}</span>
          </InfoChip>
          <InfoChip>
            <EventAvailable sx={{color:"primary.main"}} />
            <span>Ends: {endDateInfo.text}</span>
          </InfoChip>
        </Box>

        {/* Badges Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": {
                width: 24,
                height: 24,
                fontSize: "0.7rem",
                border: "2px solid white",
              },
            }}
          >
            <Avatar alt="Badge" src={allChallenges?.badge} />
            <Avatar sx={{ bgcolor: "primary.light" }}>+5</Avatar>
          </AvatarGroup>
          <Typography variant="caption" color="text.secondary">
            badges available
          </Typography>
        </Box>

        {/* Action Button */}
        {isApprovalStatus === "pending" && (
          <ActionButton
            variant="outlined"
            size="small"
            startIcon={<RateReview />}
            onClick={(e) => {
              e.stopPropagation();
              handleChallengeDetailsClick(allChallenges?.id);
            }}
            disabled={isProcessing}
            fullWidth
            sx={{ mt: "auto" }}
          >
            {isProcessing ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                <span>Processing...</span>
              </Box>
            ) : (
              "Review Challenge"
            )}
          </ActionButton>
        )}
      </CardContent>

      {/* Review Dialog */}
      <StyledDialog open={openReviewModal} onClose={handleCloseReviewModal}>
        <IconButton
          onClick={handleCloseReviewModal}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "text.secondary",
          }}
        >
          <Close />
        </IconButton>
        
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Review Challenge
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {!showReasonInput ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Do you want to approve or reject this challenge?
              </Typography>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                  {allChallenges?.title}
                </Typography>
                <Avatar
                  src={allChallenges?.banner}
                  sx={{
                    width: 280,
                    height: 140,
                    borderRadius: 2,
                    margin: "0 auto",
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please provide a reason for{" "}
                <span style={{ fontWeight: 600, color: reviewAction === "approve" ? "#4CAF50" : "#F44336" }}>
                  {reviewAction === "approve" ? "approving" : "rejecting"}
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
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
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
                variant={reviewAction === "approve" ? "success" : "error"}
                disabled={!reviewReason.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
    </StyledCard>
  );
}