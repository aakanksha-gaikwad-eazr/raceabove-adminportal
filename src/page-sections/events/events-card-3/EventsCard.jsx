import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import ReviewIcon from "@mui/icons-material/RateReview";

import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, H5, Paragraph } from "@/components/typography";

import { StyledRoot } from "./styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, getEventsById, reviewEvents } from "../../../store/apps/events";
import { useContext, useEffect, useState } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import MoreEventButtontwo from "@/components/more-event-button-two";
import { Switch } from "@mui/material";
import ApprovalModal from "@/components/approval-modal";
import toast from "react-hot-toast";

export default function EventsCard3({ allEventsarr = [] }) {
  const [isActive, setIsActive] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [eventToReview, setEventToReview] = useState(null);
    
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log("/??allEventsarr", allEventsarr)
  // console.log("allevents", allEvents)

  useEffect(() => {
    if (allEventsarr?.id) {
      setAllEvents(allEventsarr);
    }
  }, []);

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

  const handleReviewClick = (event) => {
    setReviewModalOpen(true);
    setEventToReview(event)
  };

  const handleReviewModalClose = () => {
    setReviewModalOpen(false);
  };

  const handleReviewSubmit = async (formData) => {
    if (eventToReview) {
      try {
        const reviewData = {
          id: eventToReview.id,
          data: {
            approvalStatus: String(formData.approvalStatus)
              .toLowerCase()
              .trim(),
            reviewReason: String(formData.reviewReason).trim(),
          },
        };

        // Additional validation to ensure values are correct
        if (
          !["approved", "rejected"].includes(reviewData?.data?.approvalStatus)
        ) {
          toast.error("Invalid approval status");
          return;
        }
        if (!reviewData?.data?.reviewReason) {
          toast.error("Review reason is required");
          return;
        }
        const result = await dispatch(reviewEvents(reviewData));
        console.log("result", result);
        if (result?.payload?.status === 200) {
          dispatch(getEvents());

          // Show success toast based on approval status
          switch (reviewData?.data?.approvalStatus) {
            case "approved":
              toast.success("Event are approved successfully!");
              break;
            case "rejected":
              toast.success("Event are rejected successfully!");
              break;
            default:
              toast.success("Event are reviewed successfully!");
          }
          // Reset state
          setReviewModalOpen(false);
          setEventToReview(null);
        } else {
          // Handle API error response
          const errorMessage =
            result.payload?.message ||
            result.error?.message ||
            "Failed to review Event";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error reviewing Event:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to review Event. Please try again.";
        toast.error(errorMessage);
      }
    }
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

  return (
    <>
      <StyledRoot style={{ height: "100%", cursor: "pointer" }}>
        <div className="img-wrapper">
          <img src={allEvents?.banner} alt="events Thumbnail" />
        </div>
        <div className="content">
          <FlexBetween justifyContent="space-between" alignItems="center">
            <Link
              href="/events/details"
              onClick={() => handleEventsDetailsClick(allEvents?.id)}
            >
              <H6
                fontSize={18}
                mb={1}
                color="text.primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "100%",
                }}
              >
                {allEvents?.title
                  ? (allEvents?.title?.length > 30
                      ? allEvents?.title.slice(0, 30) + "..."
                      : allEvents?.title
                    ).replace(/^./, (char) => char?.toUpperCase())
                  : "No Title"}
              </H6>
            </Link>
            <MoreEventButtontwo Icon={MoreHoriz} eventsId={allEvents?.id} />
          </FlexBetween>

          <Paragraph
            lineHeight={1.8}
            color="text.secondary"
            sx={{
              height: "25px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              textOverflow: "ellipsis",
            }}
          >
            Location : {allEvents?.location?.address || "N/A"}
          </Paragraph>

          <Paragraph color="text.secondary">
            Start Date : {allEvents?.date || "N/A"}
          </Paragraph>
          <Paragraph color="text.secondary">
            Start Time : {allEvents?.startTime || "N/A"}
          </Paragraph>
          <Paragraph mb={2} color="text.secondary">
            End Time : {allEvents?.endTime || "N/A"}
          </Paragraph>
          <Paragraph mb={2} color="text.secondary">
            Price : {allEvents?.price || "N/A"}
          </Paragraph>

          <Chip
            sx={{
              height: "30px",
              visibility: allEvents?.enduranceLevel ? "visible" : "hidden",
            }}
            label={allEvents?.enduranceLevel || "Placeholder"}
            color="primary"
          />

          <FlexBetween flexWrap="wrap" pt="1rem" gap={1}>
            <Switch
              defaultChecked={allEvents?.isActive || "N/A"}
              onChange={handleToggleStatus}
              color="primary"
            />
            <Chip
              label={formatTimeLeft(allEvents?.date)}
              color={
                getDaysLeftUntil(allEvents?.date) < 0 ? "error" : "secondary"
              }
            />
          </FlexBetween>

          {/* Review Button */}
          <FlexBetween mt={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ReviewIcon />}
              size="small"
              sx={{ minWidth: 100 }}
               onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(allEvents);
                                  }}
            >
              Review
            </Button>
          </FlexBetween>
        </div>
      </StyledRoot>

      {/* Review Modal */}
      <ApprovalModal
        open={reviewModalOpen}
        handleClose={handleReviewModalClose}
        title={`Review Event: ${allEvents?.title || "Event"}`}
        initialData={{
          approvalStatus: allEvents?.approvalStatus || "",
          reviewReason: allEvents?.reviewReason || "",
        }}
        onSubmit={handleReviewSubmit}
      />   
    </>
  );
}
