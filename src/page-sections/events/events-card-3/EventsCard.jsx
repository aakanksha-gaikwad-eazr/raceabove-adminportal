import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, H5, Paragraph } from "@/components/typography";

import { StyledRoot } from "./styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventsById } from "../../../store/apps/events";
import { useContext, useEffect, useState } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import MoreEventButtontwo from "@/components/more-event-button-two";
import { Switch } from "@mui/material";

export default function EventsCard3({ allEventsarr=[] }) {
  const [isActive, setIsActive] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  // console.log("/??allEventsarr", allEventsarr)
  // console.log("allevents", allEvents)

  const navigate = useNavigate();

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
          {/* <Avatar alt="Remy Sharp" src={allEvents?.badge} /> */}
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
      </div>
    </StyledRoot>
  );
}
