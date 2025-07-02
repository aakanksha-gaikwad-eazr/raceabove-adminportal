import Grid from '@mui/material/Grid2'; // CUSTOM COMPONENTS

import StatusFilter from '../StatusFilter';
import SearchFilter from '../SearchFilter';
import ProjectForm from '../bookings-form';
import ProjectCard1 from '../bookings-card-1'; // CUSTOM DEFINED HOOK

import useBookings from '../useBookings';
import BookingsCard1 from '../bookings-card-1';
import LoaderWithLogo from '../../../components/loader/LoaderWithLogo';

export default function BookingsVersionOnePageView() {
  const {
    filters,
    openModal,
    FILTERED_PROJECTS,
    isLoading,
    handleChangeFilter, 
    handleCloseModal,
    handleOpenModal
  } = useBookings();

  if (isLoading) {
    return <LoaderWithLogo />;
  }
  
  return <div className="pt-2 pb-4">
      {
      /* PROJECT FILTER BY STATUS */
    }
      <StatusFilter value={filters.status} handleChange={value => handleChangeFilter('status', value)} />

      {
      /* SEARCH INPUT AND CREATE BUTTON */
    }
      <SearchFilter handleOpenModal={handleOpenModal} handleChange={value => handleChangeFilter('searchValue', value)} />

      {
      /* PROJECT CREATION MODAL */
    }
      <ProjectForm open={openModal} handleClose={handleCloseModal} />

      {
      /* PROJECT CARDS */
    }
      <Grid container spacing={3}>
        {FILTERED_PROJECTS.map(project => <Grid size={{
        lg: 4,
        sm: 6,
        xs: 12
      }} key={project.id}>
            <BookingsCard1 project={project} />
          </Grid>)}
      </Grid>
    </div>;
}