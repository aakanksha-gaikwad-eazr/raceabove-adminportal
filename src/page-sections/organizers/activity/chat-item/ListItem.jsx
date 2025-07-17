import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar"; // CUSTOM COMPONENTS

import { Paragraph } from "@/components/typography"; // CUSTOM ICON COMPONENT

import { StyledAvatarGroup, StyledRoot } from "./styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useState } from "react";
// ======================================================================

// ======================================================================
export default function ListItem({ title, status, activity }) {
    const [open, setOpen] = useState(false);

  function truncateChars(text, maxChars = 160) {
    if (!text) return "";
    return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log("activity", activity)

  return (
    <>
      <StyledRoot>
        <Paragraph
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "200px",
          }}
        >
          {" "}
          {truncateChars(title, 160)}
        </Paragraph>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            label={
              activity?.gear
                ? `${activity.gear.brand ?? "No Brand"} ${activity.gear.model ?? "No Model"}`
                : "No Gear Info"
            }
            color="secondary"
            sx={{
              borderRadius: 4,
            }}
          />

          <StyledAvatarGroup max={4}>
            <Avatar src={activity?.gear?.photo} />
          </StyledAvatarGroup>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            size="small"
            color={activity?.isActive ? "success" : "primary"}
            sx={{
              py: 0.3,
            }}
            onClick={handleOpen}
          >
            {activity?.isActive ? "Active" : "Inactive"}
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="secondary"
            sx={{
              py: 0.3,
            }}
            onClick={handleOpen}
          >
            View
          </Button>
        </Stack>
      </StyledRoot>

      {/* dilaog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{activity?.name ?? "Activity Details"}</DialogTitle>
        {activity  ?(
<> 
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            {activity?.description ?? "N/A"}
          </Typography>

          <Box mb={2}>
            <Typography variant="body2">
              <strong>Distance:</strong> {activity?.distanceInKM} KM
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {activity?.durationInSeconds / 60}{" "}
              minutes
            </Typography>
            <Typography variant="body2">
              <strong>Steps:</strong> {activity?.stepsCount}
            </Typography>
            <Typography variant="body2">
              <strong>Exertion:</strong> {activity?.exertion}
            </Typography>
            <Typography variant="body2">
              <strong>Sport:</strong> {activity?.sport?.name}
            </Typography>
          </Box>

          {activity?.media?.length > 0 && (
            <ImageList cols={3} rowHeight={140}>
              {activity.media.map((url, idx) => (
                <ImageListItem key={idx}>
                  <img src={url} alt={`media-${idx}`} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </DialogContent>
        </>
        ) : (
    <Typography variant="body2" color="error">
      No activity data available.
    </Typography>
  
        )}

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      
    </>
  );
}
