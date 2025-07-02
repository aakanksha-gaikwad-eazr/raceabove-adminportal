import { useEffect, useState } from 'react'; // CUSTOM DATA

import { PROJECTS } from '@/__fakeData__/projects';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../../store/apps/events';

export default function useBookings() {
  const [openModal, setOpenModal] = useState(false);
    const [filters, setFilters] = useState({
    date: 'all',
    searchValue: ''
  });

  const dispatch = useDispatch();
  const { events, isLoading } = useSelector(state => state.events);
  console.log("events", events)
  
  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChangeFilter = (key, value) => {
    setFilters(state => ({ ...state,
      [key]: value
    }));
  };
  
    // Utility function to filter events
    const datewisefilter = (events=[]) => {
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

  
      return { pastEvents, upcomingEvents,all };
    };


  // console.log("datewisefilter", datewisefilter(events))
  // console.log("events", events)

  const FILTERED_PROJECTS = events.filter(item => filters.date === 'all' || item.date === filters.date).filter(pro => pro?.title?.toLowerCase().includes(filters.searchValue.toLowerCase()));
  
  return {
    datewisefilter,
    events,
   FILTERED_PROJECTS,
    filters,
    openModal,
    isLoading,
    handleOpenModal,
    handleCloseModal,
    handleChangeFilter
  };
}