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
    datewisefilter,
    challenges,
    filters,
    // FILTERED_PROJECTS,
    openModal,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useChallenge();

  console.log("challenges here",challenges)

  const { pastChallenges, upcomingChallenges, all } = challenges
    ? datewisefilter(challenges)
    : { pastChallenges: [], upcomingChallenges: [], all: [] };

  return (
    <div className="pt-2 pb-4">
      {/* Challenge FILTER BY STATUS */}
      <StatusFilter
        challenges={challenges}
        datewisefilter={datewisefilter}
        value={filters.date}
        handleChange={(value) => handleChangeFilter("startDate", value)}
      />

      {/* SEARCH INPUT AND CREATE BUTTON */}
      <SearchFilter
        handleOpenModal={handleOpenModal}
        handleChange={(value) => handleChangeFilter("searchValue", value)}
      />

      {/* Challenge CREATION MODAL */}
      <ProjectForm open={openModal} handleClose={handleCloseModal} />

      {/* PROJECT CARDS */}

      {/* <Grid container spacing={3}>
        {challenges.map((challenge) => (
          <Grid
            size={{
              lg: 4,
              sm: 6,
              xs: 12,
            }}
            key={challenge.id}
          >
            <ChallengeCard3 key={challenge.id} challenges={challenge} />
          </Grid>
        ))}
      </Grid> */}

      <Grid container spacing={3}>
        {(filters.startDate === "all"
          ? all
          : filters.startDate === "upcoming"
            ? upcomingChallenges
            : pastChallenges
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
