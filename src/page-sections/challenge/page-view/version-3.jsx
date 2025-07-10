import Grid from "@mui/material/Grid2"; // CUSTOM COMPONENTS

import StatusFilter from "../StatusFilter";
import SearchFilter from "../SearchFilter";
import ProjectForm from "../project-form";
import ProjectCard3 from "../project-card-3"; // CUSTOM DEFINED HOOK
import useChallenge from "../useChallenge";
import ChallengeCard3 from "../project-card-3";
import { Typography } from "@mui/material";

export default function ChallengeVersionThreePageView() {
  const {
    statusFilter,
    challenges,
    filters,
    openModal,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useChallenge();

  const { approved, pending, rejected, all } = challenges
    ? statusFilter(challenges)
    : { approved: [], pending: [], rejected: [], all: [] };

  return (
    <div className="pt-2 pb-4">
      {/* Challenge FILTER BY STATUS */}
      <StatusFilter
        challenges={challenges}
        statusFilter={statusFilter}
        value={filters.approvalStatus}
        handleChange={(value) => handleChangeFilter("approvalStatus", value)}
      />

      {/* SEARCH INPUT AND CREATE BUTTON */}
      <SearchFilter
        handleOpenModal={handleOpenModal}
        handleChange={(value) => handleChangeFilter("searchValue", value)}
      />

      {/* Challenge CREATION MODAL */}
      <ProjectForm open={openModal} handleClose={handleCloseModal} />

      {/* PROJECT CARDS */}

      <Grid container spacing={3}>
        {(filters.approvalStatus === "all"
          ? all
          : filters.approvalStatus === "approved"
          ? approved
          : filters.approvalStatus === "pending"
          ? pending
          : rejected
        )
        .filter(challenge => 
          challenge.title.toLowerCase().includes(filters.searchValue.toLowerCase()) ||
          challenge.description.toLowerCase().includes(filters.searchValue.toLowerCase())
        )
        .map((challenges) => (
          <Grid
            size={{
              lg: 4,
              sm: 6,
              xs: 12,
            }}
            key={challenges.id}
          >
            <ChallengeCard3 challenges={challenges} />
          </Grid>
        ))}
      </Grid>
    </div> 
  );
}
