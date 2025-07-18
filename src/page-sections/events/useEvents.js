import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/apps/events";

export default function useEvents() {
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    date: "all",
    searchValue: "",
  });

  const dispatch = useDispatch();
  const {allEvents}  = useSelector((state) => state.events);
  console.log("events", allEvents)

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const handleOpenModal = useCallback(() => setOpenModal(true), []);
  const handleCloseModal = useCallback(() => setOpenModal(false));

  const handleChangeFilter = useCallback((key, value) => {
    setFilters((state) => ({ ...state, [key]: value }));
  });

  // Utility function to filter events
  const datewisefilter = useMemo(() => {
    return (events = []) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pastEvents = [];
      const upcomingEvents = [];

      events.forEach((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate < today) {
          pastEvents.push(event);
        } else {
          upcomingEvents.push(event);
        }
      });

      const all = [...pastEvents, ...upcomingEvents];

      return { pastEvents, upcomingEvents, all };
    };
  }, []);

  //status wise filter
  const statusFilter = useMemo(() => {
    return (allEvents = []) => {
      const activeEvents = allEvents.filter((event) => event.isActive === true);
      const inActiveEvents = allEvents.filter((event) => event.isActive === false);
      const all = [...activeEvents, ...inActiveEvents];

      return { activeEvents, inActiveEvents, all };
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) {
      return {
        all: [],
        upcoming: [],
        past: [],
        active: [],
        inactive: [],
      };
    }

    const {
      pastEvents,
      upcomingEvents,
      all: allDateEvents,
    } = datewisefilter(allEvents);
    const {
      activeEvents,
      inActiveEvents,
      all: allStatusEvents,
    } = statusFilter(allEvents);
    return {
      all: allDateEvents,
      upcoming: upcomingEvents,
      past: pastEvents,
      active: activeEvents,
      inactive: inActiveEvents,
    };
  }, [allEvents, datewisefilter, statusFilter]);

// search filtering
  const searchFilteredEvents = useMemo(() => {
    const eventsToFilter = filteredEvents[filters.date] || [];
    
    if (!filters.searchValue) {
      return eventsToFilter;
    }

    return eventsToFilter.filter(event =>
      event?.title?.toLowerCase().includes(filters.searchValue.toLowerCase())
    );
  }, [filteredEvents, filters.date, filters.searchValue]);

  const tabCounts = useMemo(() => ({
    all: filteredEvents.all.length,
    upcoming: filteredEvents.upcoming.length,
    past: filteredEvents.past.length,
    active: filteredEvents.active.length,
    inactive: filteredEvents.inactive.length
  }), [filteredEvents]);

  return {
    datewisefilter,
    statusFilter,
    allEvents,
    filteredEvents,
    searchFilteredEvents,
    tabCounts,
    filters,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleChangeFilter,
  };
}
