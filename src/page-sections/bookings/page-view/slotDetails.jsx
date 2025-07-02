import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Paragraph } from "@/components/typography";
import { Card, CircularProgress, Divider, Typography } from "@mui/material";
import { getEventsById } from "@/store/apps/events";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function BookingsSlotsDetailsPageView() {
  const { singleEvents } = useSelector((state) => state.events); // Assuming all events are stored here
  // console.log(">>>0poi", singleEvents);
  const [slot, setSlot] = useState(null);
  const { eventId, slotId } = useParams();
  const [loading, setLoading] = useState(true);

  const [expandedAccordion, setExpandedAccordion] = useState(null);

const handleAccordionChange = (panel) => (event, isExpanded) => {
  setExpandedAccordion(isExpanded ? panel : null);
};

  const dispatch = useDispatch();
  // Fetch event by ID
  useEffect(() => {
    if (eventId) {
      dispatch(getEventsById(eventId)).finally(() => {
        setLoading(false);
      });
    }
  }, [dispatch, eventId]);

  // Update slot state when singleEvents changes
  useEffect(() => {
    if (singleEvents?.slots?.length) {
      const matchedSlot = singleEvents.slots.find((s) => s.id === slotId);
      setSlot(matchedSlot || null);
    }
  }, [singleEvents, slotId]);

  if (loading || !singleEvents) return <CircularProgress />;

  console.log("slot", slot);
  return (
    <div style={{ padding: "2rem" }}>
      <Card sx={{ p: 3 }}>
        <h2>slots</h2>
      </Card>

      {/* {!slot ? (
  <Typography>No slot found with ID: {slotId}</Typography>
) : (
  <>
    <Card
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6" gutterBottom>
        📅 Slot Info
      </Typography>
      <Paragraph>
        <strong>Time:</strong> {slot.startTime} - {slot.endTime}
      </Paragraph>
      <Paragraph>
        <strong>Capacity:</strong> {slot.capacity}
      </Paragraph>
      <Paragraph>
        <strong>Booked:</strong> {slot.bookedCount}
      </Paragraph>
    </Card>

    <Typography variant="h6" mt={4} gutterBottom>
      👥 Participants
    </Typography>

    {slot.participations?.length > 0 ? (
      slot.participations.map((p) => (
        <Card
          key={p.id}
          sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}
        >
          <Typography fontWeight={600} mb={1}>
            👤 User Details
          </Typography>
          <Paragraph><strong>Name:</strong> {p.user?.name}</Paragraph>
          <Paragraph><strong>Email:</strong> {p.user?.email}</Paragraph>
          <Paragraph><strong>Phone:</strong> {p.user?.phoneNumber}</Paragraph>
          <Paragraph><strong>Status:</strong> {p.participationStatus}</Paragraph>

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={600} mb={1}>
            💳 Payment Details
          </Typography>
          {p.payment ? (
            <>
              <Paragraph><strong>Amount Paid:</strong> ₹{p.payment.amountPaid}</Paragraph>
              <Paragraph><strong>Payment Method:</strong> {p.payment.paymentMethod}</Paragraph>
              <Paragraph><strong>Status:</strong> {p.payment.paymentStatus}</Paragraph>
              <Paragraph><strong>Provider:</strong> {p.payment.provider}</Paragraph>
              <Paragraph><strong>Order ID:</strong> {p.payment.orderId}</Paragraph>
              <Paragraph><strong>Payment ID:</strong> {p.payment.paymentId}</Paragraph>
              <Paragraph><strong>Bank Ref:</strong> {p.payment.bankReference}</Paragraph>
            </>
          ) : (
            <Paragraph color="text.secondary">No payment info available.</Paragraph>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={600} mb={1}>
            🎟 Tickets
          </Typography>
          {p.tickets?.length > 0 ? (
            p.tickets.map((ticket) => (
              <Card
                key={ticket.id}
                variant="outlined"
                sx={{ mb: 1, p: 1.5, borderRadius: 2 }}
              >
                <Paragraph><strong>Name:</strong> {ticket.name}</Paragraph>
                <Paragraph><strong>Age:</strong> {ticket.age}</Paragraph>
                <Paragraph><strong>Gender:</strong> {ticket.gender}</Paragraph>
                <Paragraph>
                  <strong>Checked In:</strong> {ticket.isCheckedIn ? "Yes" : "No"}
                </Paragraph>
              </Card>
            ))
          ) : (
            <Paragraph>No tickets found.</Paragraph>
          )}
        </Card>
      ))
    ) : (
      <Paragraph color="text.secondary">
        No participants for this slot.
      </Paragraph>
    )}
  </>
)} */}
{slot.participations?.length > 0 ? (
  slot.participations.map((p, index) => (
    <Accordion
      key={p.id}
      expanded={expandedAccordion === p.id}
      onChange={handleAccordionChange(p.id)}
      sx={{ mt: 2, backgroundColor: "#fefefe" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {p.user?.name || "Unnamed User"} — {p.participationStatus ?? "No Status"}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography fontWeight={600} mb={1}>
          User Info
        </Typography>
        <Paragraph><strong>Email:</strong> {p.user?.email}</Paragraph>
        <Paragraph><strong>Phone:</strong> {p.user?.phoneNumber}</Paragraph>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={600} mb={1}>
          💳 Payment Details
        </Typography>
        {p.payment ? (
          <>
            <Paragraph><strong>Amount Paid:</strong> ₹{p.payment.amountPaid}</Paragraph>
            <Paragraph><strong>Method:</strong> {p.payment.paymentMethod}</Paragraph>
            <Paragraph><strong>Status:</strong> {p.payment.paymentStatus}</Paragraph>
            <Paragraph><strong>Provider:</strong> {p.payment.provider}</Paragraph>
            <Paragraph><strong>Order ID:</strong> {p.payment.orderId}</Paragraph>
            <Paragraph><strong>Payment ID:</strong> {p.payment.paymentId}</Paragraph>
            <Paragraph><strong>Bank Ref:</strong> {p.payment.bankReference}</Paragraph>
          </>
        ) : (
          <Paragraph>No payment info.</Paragraph>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={600} mb={1}>
          🎟 Tickets
        </Typography>
        {p.tickets?.length > 0 ? (
          p.tickets.map((ticket) => (
            <Card
              key={ticket.id}
              variant="outlined"
              sx={{ mb: 1, p: 1.5, borderRadius: 2 }}
            >
              <Paragraph><strong>Name:</strong> {ticket.name}</Paragraph>
              <Paragraph><strong>Age:</strong> {ticket.age}</Paragraph>
              <Paragraph><strong>Gender:</strong> {ticket.gender}</Paragraph>
              <Paragraph><strong>Checked In:</strong> {ticket.isCheckedIn ? "Yes" : "No"}</Paragraph>
            </Card>
          ))
        ) : (
          <Paragraph>No tickets found.</Paragraph>
        )}
      </AccordionDetails>
    </Accordion>
  ))
) : (
  <Paragraph color="text.secondary">No participants for this slot.</Paragraph>
)}


    </div>
  );
}
