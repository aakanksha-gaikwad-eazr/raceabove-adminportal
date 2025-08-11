import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2'; // CUSTOM COMPONENT
import Typography from '@mui/material/Typography';

import ProjectCard from './ProjectCard'; // CUSTOM DUMMY DATA

import { PROJECT_LIST } from './data';
export default function Projects({allDataOfSingleUser}) {
  if (!allDataOfSingleUser) {
    return (
      <Box py={3} mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          User data not available
        </Typography>
      </Box>
    );
  }

  const allChallengesParticipations = allDataOfSingleUser?.challengeParticipations;
  console.log("allChallengesParticipations", allChallengesParticipations);

  if (!allChallengesParticipations || !Array.isArray(allChallengesParticipations) || allChallengesParticipations.length === 0) {
    return (
      <Box mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          No Challenges available
        </Typography>
      </Box>
    );
  }

  return (
    <Box py={3}>
      <Grid container spacing={3}>
        {allChallengesParticipations.map(item => (
          <Grid 
            size={{
              md: 4,
              sm: 6,
              xs: 12
            }} 
            key={item?.id || Math.random()}
          >
            <ProjectCard item={item}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}