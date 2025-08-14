import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Tooltip,
  AvatarGroup,
  H6,
  PeopleIcon,
} from "@mui/material";

const ChallengeParticipantsTab = ({ challengeData }) => {
    return (
      <>
    <Box sx={{ mb: 3 }}>
      <H6 fontSize={18} mb={3}>
        Participants
      </H6>
      {challengeData?.participants?.length > 0 ? (
        <Grid container spacing={2}>
          {challengeData.participants.map(
            (participant) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={participant.participantId}
              >
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Avatar
                    src={
                      participant.participantProfilePhoto
                    }
                    alt={participant.participantName}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle2">
                      {participant.participantName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      ID: {participant.participantId}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      ) : (
        <Box textAlign="center" py={5}>
          <PeopleIcon
            sx={{
              fontSize: 60,
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary">
            No participants yet
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            This challenge doesn't have any participants
            at the moment.
          </Typography>
        </Box>
      )}
    </Box>
    <Box sx={{ my: 2 }}>
      <H6 fontSize={18} mb={3}>
        Leaderboard
      </H6>
      {Object.keys(challengeData.leaderboard || {})
        .length > 0 ? (
        <Grid container spacing={2}>
          {Object.entries(challengeData.leaderboard).map(
            ([rank, participant], index) => (
              <Grid item xs={12} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        index === 0
                          ? "gold"
                          : index === 1
                            ? "silver"
                            : index === 2
                              ? "#cd7f32"
                              : "grey",
                      color: "white",
                      fontWeight: "bold",
                      mr: 2,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Avatar
                    src={
                      participant.participantProfilePhoto
                    }
                    alt={participant.participantName}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">
                      {participant.participantName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Score: {participant.score || "N/A"}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      ) : (
        <Box textAlign="center" py={5}>
          {/* <EmojiEventsIcon
            sx={{
              fontSize: 60,
              color: "text.secondary",
              mb: 2,
            }}
          /> */}
          <Typography variant="h6" color="text.secondary">
            No leaderboard data
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Leaderboard will be available once
            participants join the challenge.
          </Typography>
        </Box>
      )}
    </Box>
      </>
  );
};

export default ChallengeParticipantsTab;