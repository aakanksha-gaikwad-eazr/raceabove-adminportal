import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import AvatarGroup from "@mui/material/AvatarGroup";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT
import CircularProgress from "@mui/material/CircularProgress"; // Import Loader
import MoreHoriz from "@mui/icons-material/MoreHoriz"; // CUSTOM COMPONENTS
import MoreButton from "@/components/more-button";
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox"; // CUSTOM DATA
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getEventsById } from "../../../store/apps/events";
import { toast } from "react-hot-toast";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import { CardContent, CardHeader, Typography } from "@mui/material";
import { StyledRoot } from "@/components/gradient-background/styles";
import Link from "@/icons/Link";

const StyledAvatar = styled(Avatar)({
  width: 34,
  height: 34,
});
const Div = styled("div")({
  padding: "1.5rem",
});
const RightContentWrapper = styled("div")({
  gap: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "& .MuiPaper-root": {
    padding: "1.5rem",
  },
});
const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  width: "100%",
  paddingBottom: "1rem",
  alignItems: "flex-start",
  "& .MuiRadio-root": {
    padding: 0,
    paddingRight: 10,
  },
  "&:last-child": {
    paddingBottom: 0,
  },
});

export default function EventTicketDetails() {
  const { slotId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [event, setEvent] = useState(location.state?.event || null);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(!event);

  useEffect(() => {
    const findSlotDetails = (eventData) => {
      const foundSlot = eventData?.slots?.find(
        (s) => String(s.id) === String(slotId)
      );

      if (foundSlot) {
        setSlot(foundSlot);
        setEvent(eventData); // Ensure event state is also set
      } else {
        toast.error("Slot details not found.");
        navigate(-1); // Go back if slot is not found
      }
    };

    if (event) {
      findSlotDetails(event);
      setLoading(false);
    } else {
      // Fallback: If event data is not in state (e.g., page refresh), fetch it.
      const eventId = localStorage.getItem("eventsId");
      if (eventId) {
        dispatch(getEventsById(eventId))
          .then((response) => {
            if (response?.payload) {
              console.log("res getbyid", response);
              findSlotDetails(response.payload);
            } else {
              toast.error("Failed to fetch event details.");
              navigate("/events");
            }
          })
          .catch(() => {
            toast.error("An error occurred while fetching event details.");
            navigate("/events");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        toast.error("No event selected.");
        navigate("/events");
      }
    }
  }, [slotId, event, navigate, dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!slot) {
    return <Paragraph>Slot not found.</Paragraph>;
  }

  console.log("slot here data", slot);

  return (
    <Box pt={2} pb={4}>
      <Card
        sx={{
          padding: "2rem",
        }}
      >
        <H6 fontSize={18} mb={1}>
          Event: {event?.title?.toUpperCase()}
        </H6>
        <Paragraph color="text.secondary" mb={3}>
          Details for your selected slot
        </Paragraph>

        <Box>
          <Paragraph fontWeight={600}>
            Time: {slot.startTime} - {slot.endTime}
          </Paragraph>
        
        </Box>

        {slot?.eventTickets?.length > 0 && (
          <Box mt={3}>
            <Divider
              sx={{
                my: 2,
              }}
            />
            <H6 fontSize={16}>Available Tickets</H6>
            {slot?.eventTickets?.map((tickets) => (
               <Grid item key={tickets?.id} lg={3} md={6} xs={12}>
               <Card sx={{ p: 2, height: "100%" }}>
                 <CardContent>
                   <Typography
                     variant="subtitle2"
                     color="text.secondary"
                     gutterBottom
                   >
                     Participants Count: {tickets?.participantsCount}
                   </Typography>
       
                   <Typography
                     variant="subtitle2"
                     color="text.secondary"
                     gutterBottom
                   >
                     Name: {tickets?.ticketTemplate?.type?.name || "-"}
                   </Typography>
       
                   <Typography
                     variant="subtitle2"
                     color="text.secondary"
                     gutterBottom
                   >
                     Price: ₹{tickets?.ticketTemplate?.price ?? "N/A"}
                   </Typography>
       
                   <Typography
                     variant="subtitle2"
                     color="text.secondary"
                     gutterBottom
                   >
                     Age Range: {tickets?.ticketTemplate?.minAge} -{" "}
                     {tickets?.ticketTemplate?.maxAge}
                   </Typography>
       
                   <Typography
                     variant="subtitle2"
                     color="text.secondary"
                     gutterBottom
                   >
                     Quantity: {tickets?.ticketTemplate?.quantity}
                   </Typography>
       
                   <Divider sx={{ my: 1 }} />
       
                   <Paragraph>Booked Count: {tickets?.bookedCount}</Paragraph>
                   <Paragraph>
                     Participants: {tickets?.participantsCount}
                   </Paragraph>
                   <Paragraph>
                     Sold Out: {tickets?.isSoldOut ? "Yes" : "No"}
                   </Paragraph>
                 </CardContent>
               </Card>
             </Grid>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
}
