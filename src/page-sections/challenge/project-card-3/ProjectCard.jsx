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
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.18)",
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
  height: 180,
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    background: "linear-gradient(transparent, rgba(0, 0, 0, 0.5))",
  },
}));

// Enhanced StatusBadge with better colors and effects
const StatusBadge = styled(Chip)(({ theme, status }) => ({
  zIndex: 10,
  fontWeight: 700,
  fontSize: "0.7rem",
  height: "auto",
  padding: "4px 10px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  // Status-specific styles
  ...(status === "approved" && {
    background: "linear-gradient(135deg, #4CAF50, #388E3C)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    "& .MuiChip-icon": {
      color: "white",
    },
  }),
  ...(status === "rejected" && {
    background: "linear-gradient(135deg, #F44336, #D32F2F)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    "& .MuiChip-icon": {
      color: "white",
    },
  }),
  ...(status === "pending" && {
    background: "linear-gradient(135deg, #FF9800, #F57C00)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    "& .MuiChip-icon": {
      color: "white",
    },
  }),
  "& .MuiChip-label": {
    padding: "0 4px",
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  "& .MuiChip-icon": {
    fontSize: "14px",
    marginLeft: "2px",
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "24px",
  "& .MuiChip-icon": {
    color: theme.palette.primary.main,
    fontSize: "16px",
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  borderRadius: 12,
  padding: theme.spacing(1.5),
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
    // background:
    //   "linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)",
  },
}));

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

const GradientButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  ...(color === "success" && {
    background: "linear-gradient(45deg, #4CAF50, #388E3C)",
    "&:hover": {
      background: "linear-gradient(45deg, #388E3C, #2E7D32)",
      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
    },
  }),
  ...(color === "error" && {
    background: "linear-gradient(45deg, #F44336, #D32F2F)",
    "&:hover": {
      background: "linear-gradient(45deg, #D32F2F, #C62828)",
      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)",
    },
  }),
  ...(color === "primary" && {
    background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
    "&:hover": {
      background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    },
  }),
}));

const ReviewButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  padding: "20px 16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
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
    // borderColor: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
    color: "grey",
    "&:hover": {
      background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
      color: "white",
    },
  }),
  ...(variant === "success" && {
    // borderColor: "linear-gradient(45deg, #4CAF50, #388E3C)",
    borderColor: "green",
    color: "grey",
    "&:hover": {
      background: "linear-gradient(45deg, #388E3C, #2E7D32)",
      color: "white",
    },
  }),
  ...(variant === "error" && {
    // borderColor: "linear-gradient(45deg, #F44336, #D32F2F)",
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
      return {
        text: "Tomorrow",
        color: "success",
        icon: <Schedule />,
      };
    } else if (diffDays <= 7) {
      return {
        text: `${diffDays} days`,
        color: "primary",
        icon: <Schedule />,
      };
    } else {
      return {
        text: date.toLocaleDateString(),
        color: "default",
        icon: <CalendarToday />,
      };
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
        // label: "Approved",
        color: "success",
        icon: <CheckCircle />,
      },
      rejected: {
        // label: "Rejected",
        color: "error",
        icon: <Cancel />,
      },
      pending: {
        // label: "Pending",
        color: "warning",
        icon: <Schedule />,
      },
    };
    const config =
      statusConfig[isApprovalStatus] || statusConfig.pending;
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
        approvalStatus:
          reviewAction === "approve" ? "approved" : "rejected",
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
        setIsApprovalStatus(requestBody.approvalStatus);
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
      <CardContent
        sx={{
          p: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title with Status Badge */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Link
            href="/challenges/details"
            onClick={() =>
              handleChallengeDetailsClick(allChallenges?.id)
            }
            style={{ textDecoration: "none", flex: 1 }}
          >
            <Tooltip title={allChallenges?.title || "No title"}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textTransform: "capitalize",
                  textOverflow: "ellipsis",
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                  pr: 1,
                  lineHeight: 1.3,
                }}
              >
                {allChallenges?.title || "No title"}
              </Typography>
            </Tooltip>
          </Link>
          <Box sx={{ padding: "10px" }}> {getStatusChip()}</Box>
        </Box>

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
            lineHeight: 1.5,
            fontSize: "0.9rem",
          }}
          dangerouslySetInnerHTML={{
            __html:
              allChallenges?.description ||
              "No description available",
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
        <FlexBetween sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 28,
                  height: 28,
                  border: "2px solid white",
                },
              }}
            >
              <Avatar
                alt="Challenge Badge"
                src={allChallenges?.badge}
              />
              <Avatar
                sx={{ bgcolor: "primary.main", fontSize: "0.7rem" }}
              >
                +5
              </Avatar>
            </AvatarGroup>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              badges
            </Typography>
          </Box>
        </FlexBetween>

        {/* Action Button */}
        {isApprovalStatus === "pending" && (
          <ReviewButton
            color="primary"
            size="small"
            startIcon={<RateReview />}
            onClick={(e) => {
              e.stopPropagation();
              handleChallengeDetailsClick(allChallenges?.id);
            }}
            disabled={isProcessing}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isProcessing ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CircularProgress size={16} color="inherit" />
                <span>Processing...</span>
              </Box>
            ) : (
              `Review Challenge`
            )}
          </ReviewButton>
        )}
      </CardContent>

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
            top: "0",
            right: "0",
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
                  {allChallenges?.title || "Challenge Title"}
                </Typography>
                <Avatar
                  src={allChallenges?.banner}
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
    </StyledCard>
  );
}
