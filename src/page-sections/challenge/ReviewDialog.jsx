import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
  Avatar,
  styled,
} from "@mui/material";
import Close from "@mui/icons-material/Close";

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

const ReviewDialog = ({
  open,
  onClose,
  challengeData,
  onSubmitReview,
  isProcessing,
}) => {
  const [showReasonInput, setShowReasonInput] = React.useState(false);
  const [reviewAction, setReviewAction] = React.useState("");
  const [reviewReason, setReviewReason] = React.useState("");

  const handleClose = () => {
    setShowReasonInput(false);
    setReviewReason("");
    setReviewAction("");
    onClose();
  };

  const handleRejectClick = () => {
    setReviewAction("reject");
    setShowReasonInput(true);
  };

  const handleApproveClick = () => {
    setReviewAction("approve");
    setShowReasonInput(true);
  };

  const handleBackClick = () => {
    setShowReasonInput(false);
    setReviewReason("");
    setReviewAction("");
  };

  const handleSubmit = () => {
    onSubmitReview(reviewAction, reviewReason);
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <IconButton
        onClick={handleClose}
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
            <DialogButton onClick={handleRejectClick} variant="error">
              Reject
            </DialogButton>
            <DialogButton
              onClick={handleApproveClick}
              variant="success"
            >
              Approve
            </DialogButton>
          </>
        ) : (
          <>
            <DialogButton
              onClick={handleBackClick}
              variant="outlined"
            >
              Back
            </DialogButton>
            <DialogButton
              onClick={handleSubmit}
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
  );
};

export default ReviewDialog;
