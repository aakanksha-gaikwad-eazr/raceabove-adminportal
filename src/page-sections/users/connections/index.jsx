import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { H6 } from '@/components/typography';

export default function WalletDetails({ wallet }) {
  const hasData =
    wallet &&
    (wallet.balance !== undefined ||
      wallet.totalCoinsEarned !== undefined ||
      wallet.totalCoinsUsed !== undefined);

  if (!hasData) {
    return (
      <Box py={2}>
        <H6 fontSize={16} mb={2}>
          Wallet Details
        </H6>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box py={2}>
      <H6 fontSize={16} mb={2}>
        Wallet Details
      </H6>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Balance
          </Typography>
          <Typography variant="h6">{wallet.balance} Coins</Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Total Coins Earned
          </Typography>
          <Typography variant="h6" color="success.main">
            {wallet.totalCoinsEarned} Coins
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Total Coins Used
          </Typography>
          <Typography variant="h6" color="error.main">
            {wallet.totalCoinsUsed} Coins
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
