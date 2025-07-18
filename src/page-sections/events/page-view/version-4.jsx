import Grid from "@mui/material/Grid2"; // CUSTOM COMPONENTS
import StatusFilter from "../StatusFilter";
import useEvents from "../useEvents";
import EventsCard3 from "../events-card-3";
import HeadingArea from "../HeadingArea";
import { useMemo } from "react";

export default function EventsVersionFourPageView() {
  const {
    filteredEvents,
    searchFilteredEvents,
    tabCounts,
    filters,
    openModal,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useEvents();

  const eventsToRender = useMemo(() => {
    return searchFilteredEvents;
  }, [searchFilteredEvents]);

  return (
    <div className="pt-2 pb-4">
      {/* EVENTS FILTER BY date */}
      <HeadingArea />

      <StatusFilter
        tabCounts={tabCounts}
        value={filters.date}
        handleChange={handleChangeFilter}
        gridRoute="/events/event-grid"
        listRoute="/events/event-list"
      />

      {/* EVENTS CARDS */}
      <Grid container spacing={3}>
        {eventsToRender.map((event) => (
          <Grid
            size={{
              lg: 4,
              sm: 6,
              xs: 12,
            }}
            key={event.id}
          >
            <EventsCard3 allEventsarr={event} />
          </Grid>
        ))}
      </Grid>
      {eventsToRender.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "text.secondary",
          }}
        >
          No events found matching your criteria.
        </div>
      )}
    </div>
  );
}
