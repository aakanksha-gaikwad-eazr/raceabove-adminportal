import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack"; // CUSTOM COMPONENTS
import Typography from "@mui/material/Typography";

import Posts from "./posts";
import Teams from "./teams";
import Skills from "./skills";
import Hobbies from "./Hobbies";
import Summery from "./Summery";
import Portfolio from "./portfolios";
import MyConnections from "./my-connection";
import AdditionalDetails from "./additional-details";

export default function Overview({ allDataOfSingleUser }) {
  if (!allDataOfSingleUser) {
    return (
      <Box mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={3}>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 9,
            md: 8,
            xs: 12,
          }}
        >
          <Stack spacing={3}>
            {allDataOfSingleUser?.targets?(
              <Summery allDataOfSingleUser={allDataOfSingleUser} />):(<Box mt={3} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          No data available
        </Typography>
      </Box>)}
            {/* <Skills /> */}
            {/* <Teams allDataOfSingleUser={allDataOfSingleUser}/> */}
            {/* <Hobbies /> */}

            {/* <Posts allDataOfSingleUser={allDataOfSingleUser} /> */}
            {/* <Portfolio /> */}
          </Stack>
        </Grid>

        <Grid
          size={{
            lg: 3,
            md: 4,
            xs: 12,
          }}
        >
          <Stack spacing={3}>
            <MyConnections allDataOfSingleUser={allDataOfSingleUser} />
            {/* <AdditionalDetails allDataOfSingleUser={allDataOfSingleUser} /> */}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
