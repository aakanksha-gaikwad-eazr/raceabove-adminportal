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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import { format } from "date-fns";
import { getSingleFaq, reviewFaq } from "@/store/apps/faq";
import toast from "react-hot-toast";
import ApprovalModal from "@/components/approval-modal";
import { getSingleTnc, reviewTnc } from "@/store/apps/tnc";

// Skeleton loader component
const DetailsSkeleton = () => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
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

            <Skeleton variant="text" width="30%" height={20} sx={{ mt: 3 }} />
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
            <Skeleton variant="rounded" width={80} height={24} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default function TNCDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [tncData, setTncData] = useState(null);

  // Fetch FAQ data
  useEffect(() => {
    const fetchTncDetails = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(getSingleTnc(id));
        console.log("res",response)
        setTncData(response?.payload);
      } catch (error) {
        console.error("Error fetching Terms & Conditions details:", error);
        toast.error("Failed to load Terms & Conditions details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTncDetails();
    }
  }, [id, dispatch]);

  const handleReviewClick = () => {
    setApprovalModalOpen(true);
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
  };

  const handleApprovalSubmit = async (formData) => {
    try {
      const reviewData = {
        id: id,
        data: {
          approvalStatus: String(formData.approvalStatus).toLowerCase().trim(),
          reviewReason: String(formData.reviewReason).trim(),
        },
      };

      if (!["approved", "rejected"].includes(reviewData.data.approvalStatus)) {
        toast.error("Invalid approval status");
        return;
      }

      if (!reviewData.data.reviewReason) {
        toast.error("Review reason is required");
        return;
      }

      const result = await dispatch(reviewTnc(reviewData));

      if (result.meta?.requestStatus === "fulfilled") {
        const response = await dispatch(getSingleTnc(id));
        setTncData(response?.payload);

        toast.success(
          reviewData.data.approvalStatus === "approved"
            ? "Terms & Conditions approved successfully!"
            : "Terms & Conditions rejected successfully!"
        );

        setApprovalModalOpen(false);
      } else {
        toast.error("Failed to review Terms & Conditions");
      }
    } catch (error) {
      console.error("Error reviewing Terms & Conditions:", error);
      toast.error("Failed to review Terms & Conditions. Please try again.");
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DetailsSkeleton />
      </Container>
    );
  }

  if (!tncData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">Terms & Conditions not found</Alert>
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
          Terms & Conditions Details
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Q&A Card */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Question Section */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Content
                </Typography>
                <Typography variant="body2" style={{textTransform:"capitalize"}}>
                  {tncData?.content || "No content provided"}
                </Typography>
              </Box>

              {/* Review REASONS */}
              {tncData.reviewReason && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
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
                        {tncData.reviewReason}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

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
                      <Typography variant="body2">
                        {tncData.createdBy || "Unknown"}
                        {tncData.createdByRole && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {" "}
                            • {tncData.createdByRole}
                          </Typography>
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created On
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(tncData.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={2}>
                    {tncData.updatedBy && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated By
                        </Typography>
                        <Typography variant="body2">
                          {tncData.updatedBy}
                          {tncData.updatedByRole && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {" "}
                              • {tncData.updatedByRole}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    )}

                    {tncData?.updatedAt && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated On
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(tncData?.updatedAt)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Status Card */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
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
                    tncData.approvalStatus
                      ? tncData.approvalStatus.charAt(0).toUpperCase() +
                        tncData.approvalStatus.slice(1)
                      : "N/A"
                  }
                  color={getStatusColor(tncData.approvalStatus)}
                  size="small"
                />
              </Stack>

              {tncData.reviewedBy && (
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    Reviewed By
                  </Typography>
                  <Typography variant="body2">{tncData.reviewedBy}</Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="medium"
                onClick={handleReviewClick}
              >
                {tncData.approvalStatus !== "pending"
                  ? "Re-review Terms & Conditions"
                  : "Review Terms & Conditions"}
              </Button>
            </CardContent>
          </Card>

          {/* Organizer Info Card */}
          {tncData.organizer && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                  Organizer Details
                </Typography>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {tncData?.organizer?.companyLogo && (
                    <Box display="flex" my={2}>
                      <Avatar
                        src={tncData.organizer.companyLogo}
                        alt={tncData.organizer.name || "Organizer"}
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
                    {tncData.organizer.name && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body2">
                          {tncData.organizer.name}
                        </Typography>
                      </Box>
                    )}

                    {tncData.organizer.companyName && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Company
                        </Typography>
                        <Typography variant="body2">
                          {tncData.organizer.companyName}
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
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Status
              </Typography>
              <Chip
                label={tncData.isActive ? "Active" : "Inactive"}
                color={tncData.isActive ? "success" : "default"}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Modal */}
      <ApprovalModal
        open={approvalModalOpen}
        handleClose={handleApprovalCancel}
        title="Review Terms & Conditions"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: tncData?.approvalStatus || "",
          reviewReason: tncData?.reviewReason || "",
        }}
      />
    </Container>
  );
}
