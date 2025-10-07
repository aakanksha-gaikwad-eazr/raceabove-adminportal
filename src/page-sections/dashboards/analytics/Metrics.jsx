import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";

const EventMetrics = () => {
  const theme = useTheme();

  const metrics = [
    {
      id: 1,
      icon: "📅",
      title: "Total Event",
      value: "32",
      change: "8%",
      changeDirection: "down",
      changeText: "vs last month",
      iconBg: "#E3F2FD",
      iconColor: "#1976D2",
    },
    {
      id: 2,
      icon: "🎫",
      title: "Ticket Sold",
      value: "68",
      change: "8%",
      changeDirection: "down",
      changeText: "vs last month",
      iconBg: "#F3E5F5",
      iconColor: "#7B1FA2",
    },
    {
      id: 3,
      icon: "📆",
      title: "Upcoming Events",
      value: "28",
      change: "8%",
      changeDirection: "down",
      changeText: "vs last month",
      iconBg: "#E8F5E9",
      iconColor: "#388E3C",
    },
    {
      id: 4,
      icon: "💰",
      title: "Total Revenue",
      value: "42K",
      change: "12%",
      changeDirection: "up",
      changeText: "vs last month",
      iconBg: "#FFF3E0",
      iconColor: "#F57C00",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Card
              sx={{
                borderRadius: 2,
                height: "90%",
                border: "1px solid",
                borderColor: "grey.200",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}
                >
                  {metric.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1 }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      ml: 1,
                      color:
                        metric.changeDirection === "up"
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {metric.changeDirection === "up" ? "↑" : "↓"} {metric.change}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {metric.changeText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventMetrics;
