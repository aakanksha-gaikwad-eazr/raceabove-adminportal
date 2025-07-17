import { Card, CardContent, Typography } from "@mui/material";

export default function EventSummaryCard({ title, value, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}