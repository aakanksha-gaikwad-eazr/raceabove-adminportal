import Grid from '@mui/material/Grid2'; // CUSTOM COMPONENTS

import StatusFilter from '../StatusFilter';
import SearchFilter from '../SearchFilter';
import ProjectForm from '../events-form';
import ProjectCard1 from '../events-card-1'; // CUSTOM DEFINED HOOK

import useEvents from '../useEvents';
export default function EventsVersionOnePageView() {
  const {
    filters,
    openModal,
    FILTERED_PROJECTS,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal
  } = useEvents();
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
            <ProjectCard1 project={project} />
          </Grid>)}
      </Grid>
    </div>;
}