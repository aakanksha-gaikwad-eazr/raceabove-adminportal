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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
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
  Star
} from "@mui/icons-material";

// CUSTOM COMPONENTS
import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, H5, Paragraph } from "@/components/typography";
import MoreButtontwo from "@/components/more-button-two";

// STYLED COMPONENTS
import { reviewChallenges } from "@/store/apps/challenges";

// Enhanced Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  height: 480, // Fixed height for all cards
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    zIndex: 1,
  }
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 160, // Reduced height to accommodate more content
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0, // Prevent shrinking
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.3))',
  }
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
  backdropFilter: 'blur(10px)',
  backgroundColor: status === 'approved' ? 'rgba(76, 175, 80, 0.9)' : 
                   status === 'rejected' ? 'rgba(244, 67, 54, 0.9)' : 
                   'rgba(255, 152, 0, 0.9)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  }
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: 12,
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
  }
}));

export default function ApproveChallengeForm({ challenges, isAdmin = false }) {
  const navigate = useNavigate();
  const [allChallenges, setAllChallenges] = useState([]);
  const [isApprovalStatus, setIsApprovalStatus] = useState(challenges?.approvalStatus);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(""); // 'approve' or 'reject'
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

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setReviewReason("");
    setReviewAction("");
  };

  const handleReviewActionChange = (event) => {
    setReviewAction(event.target.value);
    setReviewReason("");
  };

  const handleConfirmReview = async () => {
    try {
      setIsProcessing(true);
      
      if (!reviewAction || !reviewReason.trim()) {
        console.error("Review action and reason are required");
        return;
      }

      const requestBody = {
        approvalStatus: reviewAction === "approve" ? "approved" : "rejected",
        reviewReason: reviewReason.trim()
      };
      
      const result = await dispatch(reviewChallenges({
        challengeId: allChallenges?.id,
        body: requestBody
      })).unwrap();
      
      setIsApprovalStatus(reviewAction === "approve" ? "approved" : "rejected");
      console.log(`Challenge ${reviewAction}ed successfully`);
      
      handleCloseReviewModal();
    } catch (error) {
      console.error("Error updating challenge status:", error);
    } finally {
      setIsProcessing(false);
    }
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
      return { text: date.toLocaleDateString(), color: "default", icon: <CalendarToday /> };
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
      pending: { label: "Pending Review", color: "warning", icon: <Schedule /> }
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

  const startDateInfo = formatSmartDate(allChallenges?.startDate);
  const endDateInfo = formatSmartDate(allChallenges?.endDate);
  const progress = getChallengeProgress();

  return (
    <StyledCard>
      {/* Status Badge */}
      {getStatusChip()}

      {/* Challenge Image */}
      <StyledCardMedia
        image={allChallenges?.banner || "/api/placeholder/400/200"}
        title={allChallenges?.title}
      />

      <CardContent sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, // Take remaining space
        justifyContent: 'space-between' // Distribute content evenly
      }}>
        {/* Top Section - Title and Description */}
        <Box sx={{ flex: '0 0 auto' }}>
          {/* Title */}
          <Link
            href="/challenges/details"
            onClick={() => handleChallengeDetailsClick(allChallenges?.id)}
            style={{ textDecoration: 'none' }}
          >
            <Tooltip title={allChallenges?.title || "No title"}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'text.primary',
                  height: '3.2em', // Fixed height for 2 lines
                  lineHeight: 1.6,
                  '&:hover': {
                    color: 'primary.main',
                  }
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
              display: '-webkit-box',
              WebkitLineClamp: 2, // Reduced to 2 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.6,
              height: '3.2em', // Fixed height for 2 lines
            }}
            dangerouslySetInnerHTML={{ __html: allChallenges?.description || "No description available" }}
          />
        </Box>

        {/* Middle Section - Progress and Dates */}
        <Box sx={{ flex: '0 0 auto', my: 1 }}>
          {/* Progress Section */}
          <ProgressSection>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, position: 'relative', zIndex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                Challenge Progress
              </Typography>
              <Typography variant="body2" color="primary" fontWeight={600}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                },
                position: 'relative',
                zIndex: 1,
              }}
            />
          </ProgressSection>

          {/* Date Information */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
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
        </Box>

        {/* Bottom Section - Action Button and Footer */}
        <Box sx={{ flex: '0 0 auto', mt: 'auto' }}>
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
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                }
              }}
              disabled={isProcessing}
              fullWidth
            >
              Review Challenge
            </Button>
          )}

          {/* Bottom Section */}
          <FlexBetween sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, border: '2px solid white' } }}>
                <Avatar alt="Challenge Badge" src={allChallenges?.badge} />
                <Avatar sx={{ bgcolor: 'primary.main', fontSize: '0.8rem' }}>+5</Avatar>
              </AvatarGroup>
              <Typography variant="caption" color="text.secondary">
                participants
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ color: 'gold', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                4.8 (124)
              </Typography>
            </Box>
          </FlexBetween>
        </Box>
      </CardContent>
    </StyledCard>
  );
}