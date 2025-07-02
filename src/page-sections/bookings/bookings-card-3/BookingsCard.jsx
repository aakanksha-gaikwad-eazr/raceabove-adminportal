import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, Paragraph } from "@/components/typography";
import { StyledRoot } from "./styles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { date } from "yup";

export default function BookingsCard3({ events }) {
  const [selectedEventsId, setSelectedEventsId] = useState(null);
  const [isActive, setIsActive] = useState(events?.isActive || false);
  const navigate = useNavigate();

  const handleToggleStatus = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    if (events?.id) {
      localStorage.setItem("eventsId", events?.id);
      setSelectedEventsId(events?.id);
    }
  }, [events?.id]);

  const handleEventsDetailsClick = (id) => {
    if (!id) {
      console.error("Event ID is undefined!");
      return;
    }

    localStorage.removeItem("eventsId");
    localStorage.setItem("eventsId", id);
    setSelectedEventsId(id);
    // navigate("/bookings/details");
    navigate(`/bookings/details/${id}`);

  };

  function formattedDate(dateStr){
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"
  })
  }

  return (
    <StyledRoot style={{ height: "100%", cursor: "pointer" }}  onClick={() => handleEventsDetailsClick(events?.id)} >
      <div className="img-wrapper">
        <img src={events?.banner} alt="events Thumbnail" />
      </div>
      <div className="content">
        <FlexBetween justifyContent="space-between" alignItems="center">
          {/* <Link
            href="/bookings/details"
              href={`/bookings/details/${events?.id}`}
            onClick={() => handleEventsDetailsClick(events?.id)}
          > */}
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
              {events?.title
                ? (events?.title?.length > 30
                    ? events?.title.slice(0, 30) + "..."
                    : events?.title
                  ).replace(/^./, (char) => char?.toUpperCase())
                : "No Title"}
            </H6>
          {/* </Link> */}
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
          {events?.location?.address}
        </Paragraph>
        <Paragraph
          color="text.secondary"
          sx={{fontSize:"10px"}}
        >
         {formattedDate(events?.date)}
        </Paragraph>
      </div>
    </StyledRoot>
  );
}
