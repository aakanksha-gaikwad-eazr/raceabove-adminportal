import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Avatar,
  Paper,
  Chip,
  Grid,
  AvatarGroup,
  

} from "@mui/material";
import { FlexBetween } from "@/components/flexbox";

import { formatDate } from "@/utils/dateFormatter";
import { H6, Paragraph } from "@/components/typography";

const ChallengeOverview = ({ challengeData, getStatusColor, getChallengeTypeColor }) => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <FlexBetween>
            <H6 fontSize={18} mb={1}>
              {challengeData?.title?.toUpperCase()}
            </H6>
            <Chip
              label={
                challengeData.challengeType
                  ? challengeData.challengeType
                      .charAt(0)
                      .toUpperCase() +
                    challengeData.challengeType.slice(1)
                  : "N/A"
              }
              color={getChallengeTypeColor(
                challengeData.challengeType
              )}
              size="small"
            />
          </FlexBetween>
          <Paragraph
            lineHeight={1.75}
            color="text.secondary"
            dangerouslySetInnerHTML={{
              __html: challengeData?.description,
            }}
          />
          <Stack
            direction="row"
            spacing={2}
            mt={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="subtitle2">
                {formatDate(challengeData?.startDate)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="subtitle2">
                {formatDate(challengeData?.endDate)}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Divider />
        {/* Challenge Banner */}
        <div
          className="img-wrapper"
          style={{
            textAlign: "center",
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          <img
            src={challengeData?.banner}
            alt="Challenge Banner"
            style={{
              height: "250px",
              borderRadius: "20px",
              width: "100%",
              padding: "1rem",
              maxWidth: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <Divider />
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* TASKS */}
            <Grid item xs={12} sm={7}>
              <Paragraph fontWeight={600} mb={2}>
                Qualifying Sports
              </Paragraph>
              {challengeData?.qualifyingSports?.map((sport) => (
                <div
                  key={sport.id}
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    width: "100%",
                  }}
                >
                  <Paragraph
                    lineHeight={1}
                    fontWeight={500}
                    style={{ marginRight: "15px" }}
                  >
                    {sport.name}
                  </Paragraph>
                  <Avatar
                    src={sport.icon}
                    alt={sport.name}
                    sx={{
                      width: 24,
                      height: 24,
                      mt: 0.5,
                      backgroundColor: "white",
                    }}
                  />
                </div>
              ))}
            </Grid>
            {/* PARTICIPANTS */}
            <Grid item xs={12} sm={5}>
              <Paragraph fontWeight={600} mb={2}>
                Participants
              </Paragraph>
              <AvatarGroupp max={4}>
                {challengeData?.participants?.length > 0 ? (
                  challengeData.participants.map((participant) => (
                    <Tooltip
                      key={participant?.participantId}
                      title={participant?.participantName}
                      arrow
                      placement="top"
                    >
                      <Avatar
                        alt={participant?.participantName}
                        src={participant?.participantProfilePhoto}
                      />
                    </Tooltip>
                  ))
                ) : (
                  <Paragraph
                    fontSize={14}
                    style={{ width: "90px", border: "none" }}
                    color="text.secondary"
                  >
                    No Participants
                  </Paragraph>
                )}
              </AvatarGroup>
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Participants Count
                </Typography>
                <Typography variant="body2">
                  {challengeData.participantsCount || "0"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Review REASONS */}
        {challengeData.reviewReason && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle2"
                color="primary.500"
                gutterBottom
              >
                Review Reasons
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "warning.lighter",
                  borderColor: "primary.300",
                  borderRadius: "15px",
                  textTransform: "capitalize",
                }}
              >
                <Typography variant="body2">
                  {challengeData.reviewReason}
                </Typography>
              </Paper>
            </Box>
          </>
        )}
        {/* Metadata */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={500}
            gutterBottom
          >
            Information
          </Typography>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Created By
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ textTransform: "capitalize" }}
                  >
                    {challengeData.createdBy || "Unknown"}
                    {challengeData.createdByRole && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        {" "}
                        • {challengeData.createdByRole}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(challengeData.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                {challengeData.updatedBy && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Updated By
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ textTransform: "capitalize" }}
                    >
                      {challengeData.updatedBy}
                      {challengeData.updatedByRole && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {" "}
                          • {challengeData.updatedByRole}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                )}
                {challengeData?.updatedAt && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Updated On
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(challengeData?.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </>
    );
};

export default ChallengeOverview;