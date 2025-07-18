import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Box, IconButton, Divider } from "@mui/material";
import { AccessTime, LocationOn, AttachMoney, CalendarToday, CheckCircle, Cancel, Schedule } from "@mui/icons-material";

import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, H5, Paragraph } from "@/components/typography";

import { StyledRoot } from "./styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, getEventsById, updateEvents } from "../../../store/apps/events";
import { useContext, useEffect, useState } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import MoreEventButtontwo from "@/components/more-event-button-two";
import { Switch } from "@mui/material";
import toast from "react-hot-toast";

export default function EventsCard3({ allEventsarr = [] }) {
  const [isActive, setIsActive] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (allEventsarr?.id) {
      setAllEvents(allEventsarr);
    }
  }, []);

    const handleToggleActive =async(event, eventId, currentStatus) => {
      console.log("clicked");
          event.stopPropagation();
          try {
            const updateData = {
              isActive: !currentStatus,
            };
            await dispatch(updateEvents({ id: eventId, data: updateData }));
            toast.success(
              `Event ${!currentStatus ? "activated" : "deactivated"} successfully`
            );
            dispatch(getEvents());
          } catch (error) {
            toast.error("Failed to update Event status");
            console.error("Error updating Event:", error);
          }
    };
  

  const handleToggleStatus = () => {
    // setIsActive((prev) => !prev);
  };

  const handleEventsDetailsClick = (id) => {
    // if (!id) {
    //   console.error("Event ID is undefined!");
    //   return;
    // }
    localStorage.setItem("eventsId", id);
    navigate("/events/details");
  };

  function getDaysLeftUntil(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return NaN;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffMs = targetDate - now;

    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  function formatTimeLeft(dateStr) {
    const daysLeft = getDaysLeftUntil(dateStr);

    if (isNaN(daysLeft)) return "Invalid date";
    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "1 day left";

    return `${daysLeft} days left`;
  }

  // Function to get approved status chip properties
  const getApprovedStatusChip = (approvedStatus) => {
    switch (approvedStatus?.toLowerCase()) {
      case 'approved':
        return {
          label: 'Approved',
          color: 'success',
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          bgcolor: 'rgba(76, 175, 80, 0.9)'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'error',
          icon: <Cancel sx={{ fontSize: 16 }} />,
          bgcolor: 'rgba(244, 67, 54, 0.9)'
        };
      case 'pending':
      default:
        return {
          label: 'Pending',
          color: 'warning',
          icon: <Schedule sx={{ fontSize: 16 }} />,
          bgcolor: 'rgba(255, 152, 0, 0.9)'
        };
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Paragraph color="text.secondary" sx={{ fontSize: "0.875rem" }}>
        <strong>{label}:</strong> {value || "N/A"}
      </Paragraph>
    </Box>
  );

  return (
    <StyledRoot 
      style={{ 
        height: "100%", 
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)"
        }
      }}
    >
      {/* Image Section */}
      <div className="img-wrapper" style={{ position: "relative" }}>
        <img 
          src={allEvents?.banner} 
          alt="Event Thumbnail" 
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover"
          }}
        />
        
        {/* Status Badges Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}
        >
          {/* Time Status Chip */}
          <Chip
            label={formatTimeLeft(allEvents?.date)}
            color={getDaysLeftUntil(allEvents?.date) < 0 ? "error" : "primary"}
            size="small"
            sx={{
              bgcolor: getDaysLeftUntil(allEvents?.date) < 0 ? "rgba(244, 67, 54, 0.9)" : "rgba(33, 150, 243, 0.9)",
              color: "white",
              backdropFilter: "blur(4px)",
              fontWeight: 600
            }}
          />
          
          {/* Approved Status Chip */}
          {(() => {
            const statusChip = getApprovedStatusChip(allEvents?.approvalStatus);
            return (
              <Chip
                label={statusChip.label}
                icon={statusChip.icon}
                size="small"
                sx={{
                  bgcolor: statusChip.bgcolor,
                  color: "white",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color: "white"
                  }
                }}
              />
            );
          })()}
        </Box>
      </div>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <FlexBetween mb={2}>
          <Link
            href="/events/details"
            onClick={() => handleEventsDetailsClick(allEvents?.id)}
            style={{ textDecoration: "none", flex: 1 }}
          >
            <H6
              fontSize={18}
              color="text.primary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: 600,
                lineHeight: 1.3,
                "&:hover": {
                  color: "primary.main"
                }
              }}
            >
              {allEvents?.title
                ? (allEvents?.title?.length > 35
                    ? allEvents?.title.slice(0, 35) + "..."
                    : allEvents?.title
                  ).replace(/^./, (char) => char?.toUpperCase())
                : "No Title"}
            </H6>
          </Link>
          <MoreEventButtontwo Icon={MoreHoriz} eventsId={allEvents?.id} />
        </FlexBetween>

        {/* Event Details */}
        <Box sx={{ mb: 3 }}>
          <InfoItem 
            icon={<LocationOn sx={{ fontSize: 18, color: "text.secondary" }} />}
            label="Location"
            value={allEvents?.location?.address}
          />
          
          <InfoItem 
            icon={<CalendarToday sx={{ fontSize: 18, color: "text.secondary" }} />}
            label="Date"
            value={allEvents?.date}
          />
          
          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <InfoItem 
              icon={<AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />}
              label="Start"
              value={allEvents?.startTime}
            />
            <InfoItem 
              icon={<AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />}
              label="End"
              value={allEvents?.endTime}
            />
          </Box>
          
          <InfoItem 
            icon={<AttachMoney sx={{ fontSize: 18, color: "text.secondary" }} />}
            label="Price"
            value={allEvents?.price}
          />
        </Box>

        {/* Footer */}
        <FlexBetween>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Paragraph color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              Active: 
            </Paragraph>
            <Switch
              checked={allEvents?.isActive || false}
              color="primary"
              size="small"
              onChange={(e) =>
              handleToggleActive(e,allEvents.id,allEvents.isActive)}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Approved Status Chip in Footer (Alternative placement) */}
            {(() => {
              const statusChip = getApprovedStatusChip(allEvents?.approvalStatus);
              return (
                <Chip
                  label={statusChip.label}
                  icon={statusChip.icon}
                  size="small"
                  color={statusChip.color}
                  variant="outlined"
                  sx={{
                    fontSize: "0.75rem",
                    height: "24px"
                  }}
                />
              );
            })()}
            
            {allEvents?.badge && (
              <Avatar 
                alt="Event Badge" 
                src={allEvents.badge} 
                sx={{ width: 32, height: 32 }}
              />
            )}
          </Box>
        </FlexBetween>
      </Box>
    </StyledRoot>
  );
}