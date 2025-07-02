import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack"; // CUSTOM COMPONENTS

import ListItem from "./ListItem";
import { H6 } from "@/components/typography";
import { Typography } from "@mui/material";

export default function MyConnections({ allDataOfSingleUser }) {
    const preferences = allDataOfSingleUser?.notificationPreferences;

  return (
    <Card className="p-3">
      <H6 fontSize={14}>My Notification Preferences</H6>

      <Stack spacing={3} mt={3}>
       {preferences && preferences.length > 0 ? (
          preferences.map((type) => (
            <div key={type.id}>
              <ListItem
                name={type.type}
                position="Developer"
                imageUrl="/static/user/"
              />
            </div>
          ))
        ) : (
          <Typography color="text.secondary">
            No preferences set by user.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
