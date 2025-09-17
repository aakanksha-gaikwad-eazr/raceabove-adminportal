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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Switch,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { getSingleAppTnc } from "@/store/apps/apptnc";
import { deleteAppTnc } from "@/store/apps/apptnc";
import { getAppTnc, updateAppTnc } from "@/store/apps/apptnc";
import styled from "@emotion/styled";


const QuillContentRenderer = styled("div")(({ theme }) => ({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary,

  // Headers
  "& h1": {
    fontSize: "1.5rem",
    fontWeight: 600,
    margin: "1rem 0 0.5rem 0",
    color: theme.palette.text.primary,
  },
  "& h2": {
    fontSize: "1.25rem",
    fontWeight: 600,
    margin: "1rem 0 0.5rem 0",
    color: theme.palette.text.primary,
  },
  "& h3": {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: "1rem 0 0.5rem 0",
    color: theme.palette.text.primary,
  },

  // Paragraphs
  "& p": {
    margin: "0.5rem 0",
    textAlign: "left",
    "&:first-of-type": {
      marginTop: 0,
    },
    "&:last-of-type": {
      marginBottom: 0,
    },
  },

  // Lists
  "& ul, & ol": {
    paddingLeft: "1.5rem",
    margin: "0.5rem 0",
  },
  "& li": {
    margin: "0.25rem 0",
  },

  // Text formatting
  "& strong": {
    fontWeight: 600,
  },
  "& em": {
    fontStyle: "italic",
  },
  "& u": {
    textDecoration: "underline",
  },
  "& s": {
    textDecoration: "line-through",
  },

  // Links
  "& a": {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  // Text alignment
  "& .ql-align-center": {
    textAlign: "center",
  },
  "& .ql-align-right": {
    textAlign: "right",
  },
  "& .ql-align-justify": {
    textAlign: "justify",
  },

  // Indentation
  "& .ql-indent-1": {
    paddingLeft: "2rem",
  },
  "& .ql-indent-2": {
    paddingLeft: "4rem",
  },
  "& .ql-indent-3": {
    paddingLeft: "6rem",
  },
}));
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

export default function AppTNCDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [tncData, setTncData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [isToggling, setIsToggling] = useState(false);

  // Fetch FAQ data
  useEffect(() => {
    const fetchTncDetails = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(getSingleAppTnc(id));
        console.log("res", response);
        setTncData(response?.payload);
      } catch (error) {
        console.error("Error fetching App Terms & Conditions details:", error);
        toast.error("Failed to load App Terms & Conditions details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTncDetails();
    }
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    console.log("clicked");
    handleMenuClose();
    navigate(`/tnc-details/${id}`);
  };

  const handleDeleteClick = () => {
    console.log("clciked");
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAppTnc(id));
      toast.success("App Terms deleted successfully");
      setDeleteDialogOpen(false);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting App Terms:", error);
      toast.error("Failed to delete App Terms");
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleStatusToggle = async (e, appTncId, currentStatus, isDeleted) => {
  //   // Stop propagation to prevent row click
  //   e.stopPropagation();

  //   if (isDeleted) {
  //     toast.error("Cannot update status of deleted items");
  //     return;
  //   }

  //   setLoadingStates((prev) => ({ ...prev, [appTncId]: true }));

  //   try {
  //     const updateData = {
  //       id: appTncId,
  //       data: {
  //         isActive: !currentStatus,
  //       },
  //     };
  //     console.log("::updateData", updateData);

  //     const result = await dispatch(updateAppTnc(updateData)).unwrap();
  //     console.log(":::::result", result);
  //     if (result?.status === 200 || result?.success) {
  //       toast.success("Status updated successfully");

  //       await dispatch(getAppTnc()).unwrap();

  //       if (id === appTncId) {
  //         setSelectedTnc((prevSelected) => ({
  //           ...prevSelected,
  //           isActive: !currentStatus,
  //         }));
  //       }
  //     } else {
  //       toast.error(result?.message || "Status update failed");
  //     }
  //   } catch (error) {
  //     console.error("Error updating App Terms status:", error);
  //     toast.error(error?.message || "Failed to update status");
  //   } finally {
  //     setLoadingStates((prev) => ({ ...prev, [appTncId]: false }));
  //   }
  // };

  const handleStatusToggle = async (e) => {
    // Stop propagation to prevent any parent click events
    e.stopPropagation();

    // Check if item is deleted (if you have this check)
    if (tncData?.isDeleted) {
      toast.error("Cannot update status of deleted items");
      return;
    }

    setIsToggling(true);

    try {
      const updateData = {
        id: id, // Use id from params directly
        data: {
          isActive: !tncData.isActive, // Toggle current status
        },
      };

      console.log("::updateData", updateData);

      const result = await dispatch(updateAppTnc(updateData)).unwrap();
      console.log(":::::result", result);

      if (result?.status === 200 || result?.success) {
        toast.success("Status updated successfully");

        // Update local state immediately for better UX
        setTncData((prevData) => ({
          ...prevData,
          isActive: !prevData.isActive,
        }));

        // Optional: Refresh the data from server to ensure consistency
        // You can remove this if you trust the local update
        try {
          const refreshResponse = await dispatch(getSingleAppTnc(id));
          setTncData(refreshResponse?.payload);
        } catch (refreshError) {
          console.warn(
            "Failed to refresh data after status update:",
            refreshError
          );
          // Don't show error toast for this as the update was successful
        }
      } else {
        toast.error(result?.message || "Status update failed");
      }
    } catch (error) {
      console.error("Error updating App Terms status:", error);
      toast.error(error?.message || "Failed to update status");
    } finally {
      setIsToggling(false);
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
        <Alert severity="error">App Terms & Conditions not found</Alert>
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
          Apps Terms & Conditions Details
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
  {tncData?.content ? (
    <QuillContentRenderer
      dangerouslySetInnerHTML={{ __html: tncData.content }}
    />
  ) : (
    <Typography variant="body2" color="text.secondary">
      No content provided
    </Typography>
  )}
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
                      <Typography
                        variant="body2"
                        style={{ textTransform: "capitalize" }}
                      >
                        {tncData.createdBy || "Unknown"}
                        {tncData.createdByRole && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            style={{ textTransform: "capitalize" }}
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
                        <Typography
                          variant="body2"
                          style={{ textTransform: "capitalize" }}
                        >
                          {tncData.updatedBy}
                          {tncData.updatedByRole && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              style={{ textTransform: "capitalize" }}
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
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Actions
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1.5, mb: 2, cursor: "pointer" }}
              >
                <Chip
                  label={"Edit"}
                  color={"primary"}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => navigate(`/edit-apptnc/${id}`)}
                />
                {/* <Chip
                  label={"Delete"}
                  color={"error"}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={handleDeleteClick}
                /> */}
                {/* <Chip
                  label={tncData.isActive ? "Active" : "Inactive"}
                  color={tncData.isActive ? "success" : "default"}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                /> */}
                {loadingStates[tncData.id] ? (
                  <CircularProgress size={20} />
                ) : (
                  <Switch
                    checked={tncData?.isActive || false}
                    onChange={handleStatusToggle}
                    onClick={(e) => e.stopPropagation()}
                    size="small"
                    color="success"
                    disabled={tncData?.isDeleted}
                  />
                )}
              </Stack>
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
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Terms and Conditions
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this Terms and Conditions? This
            action cannot be undone.
          </DialogContentText>
          {tncData?.content && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: "grey.50" }}>
              <Typography variant="body2" fontWeight={500}>
                "{tncData.content}"
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
