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
  Switch,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ApprovalModal from "@/components/approval-modal";
import { getSingleAppPrivacyPolicies } from "@/store/apps/appprivacypolicy";
import { getAppPrivacyPolicies, updateAppPrivacyPolicy } from "@/store/apps/appprivacypolicy";
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
            <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1.5 }} />
            <Skeleton variant="text" width="90%" height={16} />
            <Skeleton variant="text" width="95%" height={16} />
            
            <Skeleton variant="text" width="30%" height={20} sx={{ mt: 3 }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1.5 }} />
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

export default function AppPrivacyPolicyDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [ppData, setPPData] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  

  // Fetch FAQ data
  useEffect(() => {
    const fetchPPDetails = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(getSingleAppPrivacyPolicies(id));
        console.log("pp", response)
        setPPData(response?.payload);
      } catch (error) {
        console.error("Error fetching privacy policy details:", error);
        toast.error("Failed to load privacy policy details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPPDetails();
    }
  }, [id, dispatch]);

  const handleReviewClick = () => {
    setApprovalModalOpen(true);
  };

const handleStatusToggle = async () => {
  setIsToggling(true);

  try {
    const updateData = {
      id: id, // Using id from params
      data: {
        isActive: !ppData.isActive, // Toggle current status from ppData
      },
    };
    console.log("::updateData", updateData);

    const result = await dispatch(
      updateAppPrivacyPolicy(updateData)
    ).unwrap();
    console.log(":::::result", result);
    
    // Check for successful response
    if (result?.status === 200 || result?.success) {
      toast.success("Status updated successfully");

      // Update local state with new status
      setPPData(prevData => ({
        ...prevData,
        isActive: !prevData.isActive
      }));

      // Optionally refresh the full data
      const response = await dispatch(getSingleAppPrivacyPolicies(id));
      setPPData(response?.payload);
    } else {
      toast.error(result?.message || "Status update failed");
    }
  } catch (error) {
    console.error("Error updating privacy policy status:", error);
    toast.error(error?.message || "Failed to update status");
  } finally {
    setIsToggling(false);
  }
};

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
  };

  console.log("pp", ppData)


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

  if (!ppData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">App Privacy Policy not found</Alert>
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
          App Privacy Policy Details
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
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  CONTENT
                </Typography>
               {ppData?.content ? (
                  <QuillContentRenderer
                    dangerouslySetInnerHTML={{ __html: ppData.content }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No content provided
                  </Typography>
                )}
              </Box>

              {/* Review REASONS */}
              {ppData.reviewReason && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="primary.500" gutterBottom>
                      Review Reasons
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        backgroundColor: "warning.lighter",
                        borderColor: "primary.300",
                        borderRadius:"15px",
                        textTransform:"capitalize"

                      }}
                    >
                      <Typography variant="body2">
                        {ppData.reviewReason}
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
                        {ppData.createdBy || "Unknown"} 
                        {ppData.createdByRole && (
                          <Typography component="span" variant="caption" color="text.secondary" style={{textTransform:"capitalize"}}>
                            {" "}• {ppData.createdByRole}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created On
                      </Typography>
                      <Typography variant="body2" style={{textTransform:"capitalize"}}>
                        {formatDate(ppData.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={2}>
                    {ppData.updatedBy && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated By
                        </Typography>
                        <Typography variant="body2" style={{textTransform:"capitalize"}}>
                          {ppData.updatedBy}
                          {ppData.updatedByRole && (
                            <Typography component="span" variant="caption" color="text.secondary" style={{textTransform:"capitalize"}}>
                              {" "}• {ppData.updatedByRole}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    )}
                    
                    {ppData?.updatedAt && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated On
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(ppData?.updatedAt)}
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
                  onClick={() => navigate(`/edit-appprivacy-policy/${id}`)}
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
                  label={ppData.isActive ? "Active" : "Inactive"}
                  color={ppData.isActive ? "success" : "default"}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                /> */}
               {isToggling ? (
  <CircularProgress size={20} />
) : (
  <Switch
    checked={ppData?.isActive || false}
    onChange={handleStatusToggle} // No parameters needed now
    onClick={(e) => e.stopPropagation()}
    size="small"
    color="success"
    disabled={ppData?.isDeleted}
  />
)}
              </Stack>
            </CardContent>
          </Card>

          {/* Organizer Info Card */}
          {ppData.organizer && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                  Organizer Details
                </Typography>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                {ppData?.organizer?.companyLogo && (
                  <Box display="flex" my={2}>
                    <Avatar
                      src={ppData.organizer.companyLogo}
                      alt={ppData.organizer.name || "Organizer"}
                      sx={{ 
                        width: 60, 
                        height: 60,
                        border: '2px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Box>
                )}
                
                <Stack spacing={1.5}>
                  {ppData.organizer.name && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body2">
                        {ppData.organizer.name}
                      </Typography>
                    </Box>
                  )}
                  
                  {ppData.organizer.companyName && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Company
                      </Typography>
                      <Typography variant="body2">
                        {ppData.organizer.companyName}
                      </Typography>
                    </Box>
                  )}
                </Stack>
                  </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Status */}
          {/* <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Status
              </Typography>
              <Chip
                label={ppData.isActive ? "Active" : "Inactive"}
                color={ppData.isActive ? "success" : "default"}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card> */}
        </Grid>
      </Grid>
    </Container>
  );
}