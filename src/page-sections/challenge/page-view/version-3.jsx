import Grid from "@mui/material/Grid2";
// CUSTOM COMPONENTS
import StatusFilter from "../StatusFilter";
import SearchFilter from "../SearchFilter";
import ProjectForm from "../project-form";
import useChallenge from "../useChallenge";
import ChallengeCard3 from "../project-card-3";

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

  // Add safety check and ensure challenges is an array
  const challengesArray = Array.isArray(challenges) ? challenges : [];
  
  const { approved, pending, rejected, all } = challengesArray.length > 0
    ? statusFilter(challengesArray)
    : { approved: [], pending: [], rejected: [], all: [] };

  // Get the filtered challenges based on status
  const getFilteredChallenges = () => {
    let selectedChallenges = [];
    
    switch (filters.approvalStatus) {
      case "approved":
        selectedChallenges = approved;
        break;
      case "pending":
        selectedChallenges = pending;
        break;
      case "rejected":
        selectedChallenges = rejected;
        break;
      case "all":
      default:
        selectedChallenges = all;
        break;
    }

    // Apply search filter
    if (filters.searchValue) {
      return selectedChallenges.filter(challenge =>
        challenge.title?.toLowerCase().includes(filters.searchValue.toLowerCase()) ||
        challenge.description?.toLowerCase().includes(filters.searchValue.toLowerCase())
      );
    }

    return selectedChallenges;
  };

  const filteredChallenges = getFilteredChallenges();

  console.log("Debug info:", {
    challenges: challengesArray,
    filters,
    approved,
    pending,
    rejected,
    all,
    filteredChallenges
  });

  return (
    <div className="pt-2 pb-4">
      {/* Challenge FILTER BY STATUS */}
      <StatusFilter
        challenges={challengesArray}
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
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <Grid
              size={{
                lg: 4,
                sm: 6,
                xs: 12,
              }}
              key={challenge.id}
            >
              <ChallengeCard3 challenges={challenge} />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#666'
            }}>
              {challengesArray.length === 0 
                ? "Loading challenges..." 
                : "No challenges found matching your criteria."
              }
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
}