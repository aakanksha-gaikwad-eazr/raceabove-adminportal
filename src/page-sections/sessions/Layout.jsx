import { Fragment } from 'react'; // MUI

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider'; // CUSTOM COMPONENTS

import { H3, H6, Paragraph } from '@/components/typography';
import FlexRowAlign from '@/components/flexbox/FlexRowAlign'; // =========================================================================
import { H4 } from '@/components/typography';

// =========================================================================
export default function Layout({
  children,
  login
}) {
  return <Grid container height="100%">
      <Grid size={{
      md: 6,
      xs: 12
    }}>
        <FlexRowAlign bgcolor="primary.main" height="100%">
          <Box p={6} maxWidth={700} width={600} color="white">
            {login ? <Box sx={{
            display: 'flex',
            flexDirection: "column",
            alignItems: 'start'
          }}>
                <H4 fontWeight={600} p={2}>Welcome to Admin Portal!</H4>
                <img src="/raceabove.png" alt="footer" style={{
              objectFit: 'contain',
              height: 150, width:400,
             
            }} />
              </Box> : <Fragment>
              </Fragment>}
          </Box>
        </FlexRowAlign>
      </Grid>

      <Grid size={{
      md: 6,
      xs: 12
    }}>
        <FlexRowAlign bgcolor="background.paper" height="100%">
          {children}
        </FlexRowAlign>
      </Grid>
    </Grid>;
}