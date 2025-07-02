import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT
import CircularProgress from "@mui/material/CircularProgress"; // Import Loader
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox"; // CUSTOM DATA
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getEventsById } from "../../../store/apps/events";
import { toast } from "react-hot-toast";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

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

export default function BookingsDetailsPageView() {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);

  const [eventsData, setEventsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getEventsID = localStorage.getItem("eventsId");

  const navigate = useNavigate();

  useEffect(() => {
    if (getEventsID) {
      setLoading(true);
      dispatch(getEventsById(getEventsID))
        .then((response) => {
          if (response?.payload) {
            setEventsData(response?.payload);
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          toast.error("Failed to fetch event details");
        })
        .finally(() => setLoading(false));
    } else {
      console.error("No event ID found in localStorage");
      toast.error("No event selected");
      navigate("/events"); // Redirect to events list if no ID is found
    }
  }, [dispatch, getEventsID, navigate]);

  console.log("data events", eventsData);

  // Show Loader while fetching data
  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  const handleSlotBtnClick = (eventId, slotId)=>{

    navigate(`/bookings/slot-details/${eventId}/${slotId}`, { state: {  eventId,slotId } })
  }

  return (

    <Card style={{ marginTop: "20px", padding: "1.5rem" }}>
      <H6 fontSize={18} mb={2}>
        Slot-wise Participation Details
      </H6>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        {eventsData?.slots?.map((slot, index) => (
          <Chip
            key={slot.id}
            label={`Slot ${index + 1}: ${slot.startTime} - ${slot.endTime}`}
            clickable
            color="primary"
            onClick={()=>handleSlotBtnClick(eventsData?.id,slot?.id)}
            sx={{ mb: 2 }}
          />
        ))}
      </Stack>
    </Card>
  );
}
