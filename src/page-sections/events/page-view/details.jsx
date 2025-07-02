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

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getEventsById } from "../../../store/apps/events";
import { toast } from "react-hot-toast";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import { CardHeader } from "@mui/material";

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

export default function EventsDetailsPageView() {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);

  const [eventsData, setEventsData] = useState({});
  const [loading, setLoading] = useState(true);

  const getEventsID = localStorage.getItem("eventsId");

  const navigate = useNavigate();

  function getCouponStatus(coupon) {
    const today = new Date();
    const start = new Date(coupon?.startDate);
    const end = new Date(coupon?.endDate);
  
    let statusText = "";
    let statusColor = "text.secondary";
    let style = {};
  
    if (today < start) {
      statusText = `Applicable from: ${start.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    } else if (today > end) {
      statusText = "Expired";
      statusColor = "text.disabled";
      style = { opacity: 0.5 };
    } else {
      statusText = `Expiring on: ${end.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }
  
    return { statusText, statusColor, style };
  }
  

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

  const handleClickonSlots = (slotId) => {
    console.log("click here", slotId);
    // navigate("/events/eventticketdetails")
    navigate(`/events/eventticket-details/${slotId}`, {
      state: {
        event: eventsData
      }
    });
  };

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* left */}
        <Grid
          size={{
            md: 8,
            xs: 12,
          }}
        >
          <Card>
            <Div>
              <H6 fontSize={18} mb={2}>
                {eventsData?.title?.toUpperCase()}
              </H6>

              <div
                style={{
                  textAlign: "center",
                  paddingY: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={eventsData?.banner}
                  alt="Project Thumbnail"
                  style={{
                    borderRadius: "15px",
                    height: "200px",
                    maxWidth: "660px",
                    objectFit: "fill",
                    width:'500px'
                  }}
                />
              </div>
              {/* <Divider /> */}

              <Paragraph
                fontSize={18}
                lineHeight={2}
                color="text.primary"
                // dangerouslySetInnerHTML={{ __html: eventsData?.description }}
              />

              <Paragraph lineHeight={1.75} color="text.secondary">
                <b>Start Time:</b> {eventsData?.startTime}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                <b> End Time:</b> {eventsData?.endTime}
              </Paragraph>
              {/* <Paragraph lineHeight={1.75} color="text.secondary">
                <b>Active Status:</b> {eventsData?.isActive ? "true" : "false"}
              </Paragraph> */}
              <Paragraph lineHeight={1.75} color="text.secondary">
                <b> Price: </b>₹{eventsData?.price || 0}
              </Paragraph>
            </Div>

            {/* SLOT DETAILS */}
            <Div>
              <h4 style={{ marginBottom: "15px" }}>
                Event Slots & Participations
              </h4>

              {eventsData?.slots?.length > 0 ? (
                eventsData.slots.map((slot, index) => (
                  <Box
                    key={slot.id}
                    mb={3}
                    p={2}
                    border="1px solid #ddd"
                    borderRadius={2}
                    width={500}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClickonSlots(slot.id)}
                  >
                    <Paragraph fontWeight={500} mb={1}>
                      Slot {index + 1}: {slot.startTime} - {slot.endTime}
                    </Paragraph>
                    
                  </Box>
                ))
              ) : (
                <Paragraph fontSize={13} color="text.secondary">
                  No slots available.
                </Paragraph>
              )}
            </Div>
              
                {/* policy DETAILS */}
            <Div>
              <h4 style={{ marginBottom: "15px" }}>
                Policy Slots & Participations
              </h4>

              {eventsData?.slots?.length > 0 ? (
                eventsData.slots.map((slot, index) => (
                  <Box
                    key={slot.id}
                    mb={3}
                    p={2}
                    border="1px solid #ddd"
                    borderRadius={2}
                    width={500}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClickonSlots(slot.id)}
                  >
                    <Paragraph fontWeight={500} mb={1}>
                      Slot {index + 1}: {slot.startTime} - {slot.endTime}
                    </Paragraph>
                    
                  </Box>
                ))
              ) : (
                <Paragraph fontSize={13} color="text.secondary">
                  No slots available.
                </Paragraph>
              )}
            </Div>
          </Card>
        </Grid>

        <Grid
          size={{
            md: 4,
            xs: 12,
          }}
        >
          <RightContentWrapper>
            {/* PROJECT TOOLS */}
            <Card>
              <Paragraph fontWeight={600}>Organizer Details</Paragraph>

              {eventsData?.organizer ? (
                <FlexBox
                  alignItems="center"
                  gap={1.5}
                  mt={2}
                  key={eventsData?.organizer.id}
                >
                  <StyledAvatar
                    alt="Logo"
                    src={eventsData?.organizer?.companyLogo}
                  />

                  <div>
                    <Paragraph fontWeight={500}>
                      {eventsData?.organizer?.companyName || "Unknown Company"}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {eventsData?.organizer?.phoneNumber}
                    </Paragraph>
                    <Paragraph fontSize={12} mt="2px" color="text.secondary">
                      {eventsData?.organizer?.email}
                    </Paragraph>
                  </div>
                </FlexBox>
              ) : (
                <Paragraph fontSize={14} color="text.secondary">
                  No Organizer details available
                </Paragraph>
              )}
            </Card>

            {/* Location STACKS */}
            <Card>
              <Paragraph fontWeight={600}>Location</Paragraph>

              <FlexBox
                alignItems="center"
                gap={1.5}
                mt={2}
                key={eventsData?.id}
              >
                <div>
                  <Paragraph fontWeight={500}>
                    {eventsData?.location?.address}
                  </Paragraph>
                </div>
              </FlexBox>
            </Card>

            {/* addOns STACKS */}
            <Card>
              <Paragraph fontWeight={600}>Add Ons</Paragraph>

              <FlexBox
                alignItems="center"
                gap={1.5}
                mt={2}
                key={eventsData?.id}
              >
                {eventsData?.addOns?.length > 0 ? (
                  eventsData.addOns.map((addon, idx) => (
                    <div key={addon?.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      {addon?.product?.image && (
                        <img
                          src={addon?.product?.image}
                          alt={addon?.name || 'Add On'}
                          style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#f5f5f5' }}
                        />
                      )}
                      <div>
                        <Paragraph fontWeight={500}>
                          {addon?.product?.name}
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          {addon?.product?.price}
                        </Paragraph>
                        <Paragraph fontSize={13} color="text.secondary">
                          {addon?.product?.category?.name}
                        </Paragraph>
                      </div>
                    </div>
                  ))
                ) : (
                  <Paragraph fontSize={14} color="text.secondary">
                    No Add Ons available
                  </Paragraph>
                )}
              </FlexBox>
            </Card>
            {/* Coupons STACKS */}
            <Card>
              <Paragraph fontWeight={600}>Coupons</Paragraph>

              <FlexBox
                alignItems="center"
                gap={1.5}
                mt={2}
                key={eventsData?.id}
              >
                {eventsData?.coupons?.length > 0 ? (
                  eventsData.coupons.map((coupon, idx) => {
                    const { statusText, statusColor, style } = getCouponStatus(coupon);
                    return (
                      <div key={coupon?.id || idx} style={{  marginBottom: '1rem', ...style}}>
                          <Paragraph fontWeight={500}>
                            {coupon?.code}
                          </Paragraph>
                          <Paragraph fontWeight={500}>
                            {coupon?.description}
                          </Paragraph>
                          <Paragraph fontSize={13} color="text.secondary">
                            {coupon?.discountValue}
                          </Paragraph>
                          <Paragraph fontSize={13} color={statusColor}>
                            {statusText}
                          </Paragraph>
                      </div>
                    );
                  })
                ) : (
                  <Paragraph fontSize={14} color="text.secondary">
                    No Coupons available
                  </Paragraph>
                )}
              </FlexBox>
            </Card>
          </RightContentWrapper>
        </Grid>
      </Grid>
    </div>
  );
}
