import Grid from "@mui/material/Grid2"; // CUSTOM COMPONENTS

import StatusFilter from "../StatusFilter";
import SearchFilter from "../SearchFilter";
import ProjectForm from "../bookings-form";
import ProjectCard3 from "../bookings-card-3"; // CUSTOM DEFINED HOOK

import useBookings from "../useBookings";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventsForm from "../bookings-form";
import {  getEvents } from "../../../store/apps/events";
import EventsCard3 from "../bookings-card-3";
import BookingsCard3 from "../bookings-card-3";

export default function BookingsVersionThreePageView() {
  const {
    datewisefilter,
    events,
    filters,
    openModal,
    FILTERED_PROJECTS,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useBookings();

  console.log("events are here", events);

  const { pastEvents, upcomingEvents, all } = events
    ? datewisefilter(events)
    : { pastEvents: [], upcomingEvents: [], all: [] };


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
      <SearchFilter
        handleOpenModal={handleOpenModal}
        handleChange={(value) => handleChangeFilter("searchValue", value)}
      />

      {/* Event CREATION MODAL */}
      <EventsForm open={openModal} handleClose={handleCloseModal} />

      {/* EVENTS CARDS */}
      <Grid container spacing={3}>
        {FILTERED_PROJECTS.length > 0 ? (
          FILTERED_PROJECTS.map((events) => (
            <Grid
              size={{
                lg: 4,
                sm: 6,
                xs: 12,
              }}
              key={events.id}
            >
              <BookingsCard3 events={events} />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <p
              style={{ textAlign: "center", width: "100%", marginTop: "1rem" }}
            >
              No events have been added yet!
            </p>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
