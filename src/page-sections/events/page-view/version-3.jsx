import Grid from "@mui/material/Grid2"; // CUSTOM COMPONENTS
import StatusFilter from "../StatusFilter";
import SearchFilter from "../SearchFilter";
import useEvents from "../useEvents";
import EventsForm from "../events-form";
import EventsCard3 from "../events-card-3";


export default function EventsVersionThreePageView() {
  const {
    datewisefilter,
    events,
    filters,
    openModal,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useEvents();

  const { pastEvents, upcomingEvents, all } = events
    ? datewisefilter(events)
    : { pastEvents: [], upcomingEvents: [], all: [] };

  // console.log("eventssee", events)

  return (
    <div className="pt-2 pb-4">
      {/* EVENTS FILTER BY date */}

      <StatusFilter
        events={events}
        datewisefilter={datewisefilter}
        value={filters.date}
        handleChange={(value) => handleChangeFilter("date", value)}
      />

      {/* SEARCH INPUT AND CREATE BUTTON */}
      {/* <SearchFilter
        handleOpenModal={handleOpenModal}
        handleChange={(value) =>
          handleChangeFilter("searchValue", value)
        }
      /> */}

      {/* Event CREATION MODAL */}
      {/* <EventsForm open={openModal} handleClose={handleCloseModal} /> */}

      {/* EVENTS CARDS */}
      <Grid container spacing={3}>
        {(filters.date === "all"
          ? all
          : filters.date === "upcoming"
            ? upcomingEvents
            : pastEvents
        )
          .filter((event) =>
            event?.title
              ?.toLowerCase()
              .includes(filters.searchValue.toLowerCase())
          )
          .map((events) => (
            <Grid
              size={{
                lg: 4,
                sm: 6,
                xs: 12,
              }}
              key={events.id}
            >
              <EventsCard3 allEventsarr={events} />
            </Grid>
          ))}
      </Grid>

      {/* <Grid container spacing={3}>
        {events.map((events) => (
          <Grid
            size={{
              lg: 4,
              sm: 6,
              xs: 12,
            }}
            key={events.id}
          >
            <EventsCard3 events={events} />
          </Grid>
        ))}
      </Grid> */}
    </div>
  );
}
