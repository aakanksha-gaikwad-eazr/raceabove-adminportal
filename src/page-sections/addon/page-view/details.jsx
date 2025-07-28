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
import { getSingleTicketTemplate, reviewTicketTemplate } from "@/store/apps/tickettemplate";
import { getSingleAddOnCategory, reviewAddOnsCategory } from "@/store/apps/addonscategory";
import { reviewAddOns, singleAddOn } from "@/store/apps/addons";

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

export default function AddonDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [AddonData, setAddonData] = useState(null);

  // Fetch FAQ data
  useEffect(() => {
    const fetchAddonDetails = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(singleAddOn(id));
        console.log("res",response)
        setAddonData(response?.payload);
      } catch (error) {
        console.error("Error fetching Addon details:", error);
        toast.error("Failed to load Addon details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAddonDetails();
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

      const result = await dispatch(reviewAddOns(reviewData));

      if (result.meta?.requestStatus === "fulfilled") {
        const response = await dispatch(singleAddOn(id));
        setAddonData(response?.payload);

        toast.success(
          reviewData.data.approvalStatus === "approved"
            ? "Product approved successfully!"
            : "Product rejected successfully!"
        );

        setApprovalModalOpen(false);
      } else {
        toast.error("Failed to review Product");
      }
    } catch (error) {
      console.error("Error reviewing Product:", error);
      toast.error("Failed to review Product. Please try again.");
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

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `$${parseFloat(amount).toFixed(2)}`;
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

  if (!AddonData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">Product not found</Alert>
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
          Product Details
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Ticket Details Card */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Name Section */}
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Name
                </Typography>
                <Typography variant="body2" style={{textTransform:"capitalize"}}>
                  {AddonData?.name || "No name provided"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Ticket Information Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Description
                    </Typography>
                    <Typography variant="body2" style={{textTransform:"capitalize"}}>
                      {AddonData?.description|| "N/A"}
                    </Typography>
                  </Box>
                </Grid>

              </Grid>

              {/* Review REASONS */}
              {AddonData.reviewReason && (
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
                        {AddonData.reviewReason}
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
                      <Typography variant="body2" style={{textTransform:"capitalize"}}>
                        {AddonData.createdBy || "Unknown"}
                        {AddonData.createdByRole && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary" 
                            style={{textTransform:"capitalize"}}
                          >
                            {" "}
                            • {AddonData.createdByRole}
                          </Typography>
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created On
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(AddonData.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={2}>
                    {AddonData.updatedBy && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated By
                        </Typography>
                        <Typography variant="body2" style={{textTransform:"capitalize"}}>
                          {AddonData.updatedBy}
                          {AddonData.updatedByRole && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              style={{textTransform:"capitalize"}}
                            >
                              {" "}
                              • {AddonData.updatedByRole}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    )}

                    {AddonData?.updatedAt && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated On
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(AddonData?.updatedAt)}
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
                    AddonData.approvalStatus
                      ? AddonData.approvalStatus.charAt(0).toUpperCase() +
                        AddonData.approvalStatus.slice(1)
                      : "N/A"
                  }
                  color={getStatusColor(AddonData.approvalStatus)}
                  size="small"
                />
              </Stack>

              {AddonData.reviewedBy && (
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    Reviewed By
                  </Typography>
                  <Typography variant="body2">{AddonData.reviewedBy}</Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="medium"
                onClick={handleReviewClick}
              >
                {AddonData.approvalStatus !== "pending"
                  ? "Re-review Product Category"
                  : "Review Product Category"}
              </Button>
            </CardContent>
          </Card>

          {/* Organizer Info Card */}
          {AddonData.organizer && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                  Organizer Details
                </Typography>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {AddonData?.organizer?.companyLogo && (
                    <Box display="flex" my={2}>
                      <Avatar
                        src={AddonData.organizer.companyLogo}
                        alt={AddonData.organizer.name || "Organizer"}
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
                    {AddonData.organizer.name && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body2" >
                          {AddonData.organizer.name}
                        </Typography>
                      </Box>
                    )}

                    {AddonData.organizer.companyName && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Company
                        </Typography>
                        <Typography variant="body2">
                          {AddonData.organizer.companyName}
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
                label={AddonData.isActive ? "Active" : "Inactive"}
                color={AddonData.isActive ? "success" : "default"}
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
        title="Review Product Category"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: AddonData?.approvalStatus || "",
          reviewReason: AddonData?.reviewReason || "",
        }}
      />
    </Container>
  );
}