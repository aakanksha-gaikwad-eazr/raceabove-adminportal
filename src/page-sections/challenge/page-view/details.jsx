import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import AvatarGroup from "@mui/material/AvatarGroup";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT
import CircularProgress from "@mui/material/CircularProgress"; // Import Loader
import MoreHoriz from "@mui/icons-material/MoreHoriz"; // CUSTOM COMPONENTS
import MoreButton from "@/components/more-button";
import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox"; // CUSTOM DATA
import CircleIcon from "@mui/icons-material/Circle";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getChallengesById } from "../../../store/apps/challenges";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import Tooltip from "@mui/material/Tooltip";

const StyledAvatar = styled(Avatar)({
  width: 34,
  height: 34,
});
const Div = styled("div")({
  padding: "1.5rem",
});
const RightContentWrapper = styled("div")({
  gap: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "& .MuiPaper-root": {
    padding: "1.5rem",
  },
});
const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  width: "100%",
  paddingBottom: "1rem",
  alignItems: "flex-start",
  "& .MuiRadio-root": {
    padding: 0,
    paddingRight: 10,
  },
  "&:last-child": {
    paddingBottom: 0,
  },
});
export default function ProjectDetails() {
  // const { selectedChallengeId } = useContext(UserContext);

  const dispatch = useDispatch();
  const { challenges } = useSelector((state) => state.challenges);
  console.log("details see", challenges);

  const [challengeData, setChallengeData] = useState({
    participants: [],
    qualifyingSports: [],
  });
  const [loading, setLoading] = useState(true); // Track loading state

  const getChallengeID = localStorage.getItem("challengeId");
  console.log("getChallengeID>>>>", getChallengeID);

  //getChallenges

  console.log("challengeData", challengeData);

  useEffect(() => {
    if (getChallengeID) {
      setLoading(true);
      dispatch(getChallengesById(getChallengeID))
        .then((response) => {
          if (response?.payload) {
            setChallengeData(response?.payload);
          }
        })
        .catch((error) => console.error("Error fetching challenge:", error))
        .finally(() => setLoading(false));
    }
  }, [dispatch, getChallengeID]);

  console.log("data chalene", challengeData);

  // Show Loader while fetching data
  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid
          size={{
            md: 8,
            xs: 12,
          }}
        >
          <Card>
            <Div>
              <FlexBetween>
                <H6 fontSize={18} mb={1}>
                  {challengeData?.title?.toUpperCase()}
                </H6>

                <MoreButton Icon={MoreHoriz} />
              </FlexBetween>

              <Paragraph lineHeight={1.75} color="text.secondary" dangerouslySetInnerHTML={{ __html: challengeData?.description }}/>
                {/* {challengeData?.description}
              </Paragraph> */}
              <Paragraph lineHeight={1.75} color="text.secondary">
                Start Date: {challengeData?.startDate}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                End Date: {challengeData?.endDate}
              </Paragraph>
            </Div>

            <Divider />
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
                alt="Project Thumbnail"
                style={{ height: "400px" }}
              />
            </div>
            <Divider />

            <Div>
              <Grid container spacing={3}>
                {/* TASKS */}
                <Grid
                  size={{
                    sm: 7,
                    xs: 12,
                  }}
                >
                  <Paragraph fontWeight={600} mb={2}>
                    Tasks
                  </Paragraph>

                  {challengeData?.qualifyingSports?.map((task) => (
                    <div
                      key={task.id}
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
                        {task.name}
                      </Paragraph>

                      <Avatar
                        src={task.icon}
                        alt={task.title}
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

                {/* TEAMS */}
                <Grid
                  size={{
                    sm: 5,
                    xs: 12,
                  }}
                >
                  <Paragraph fontWeight={600} mb={2}>
                    Participants
                  </Paragraph>

                  <AvatarGroup max={4}>
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

                  {/* <FlexBetween mb={1.5} mt={3}>
                    <Paragraph fontWeight={600}>Project Progress</Paragraph>
                    <Paragraph fontWeight={600}>32%</Paragraph>
                  </FlexBetween> */}

                  {/* <LinearProgress variant="determinate" value={32} /> */}
                </Grid>
              </Grid>
            </Div>

            <Divider />

            {/* FILE ATTACHMENTS */}
            {/* <Div>
              <Paragraph fontWeight={600} mb={2}>
                File Attachment
              </Paragraph>

              <Grid container spacing={3}>
                {PROJECT_FILES.map((item) => (
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                    key={item.id}
                  >
                    <FlexBetween>
                      <FlexBox alignItems="center" gap={1}>
                        <Box height={40} width={40}>
                          <img src={item.image} alt="File Type" width="100%" />
                        </Box>

                        <div>
                          <Paragraph fontWeight={500}>{item.title}</Paragraph>

                          <FlexBox alignItems="center" gap={1}>
                            <Paragraph color="text.secondary" fontSize={12}>
                              3mb
                            </Paragraph>

                            <Box
                              width={4}
                              height={4}
                              borderRadius={1}
                              bgcolor="text.secondary"
                            />

                            <Paragraph color="text.secondary" fontSize={12}>
                              5 days ago
                            </Paragraph>
                          </FlexBox>
                        </div>
                      </FlexBox>

                      <MoreButton Icon={MoreHoriz} />
                    </FlexBetween>
                  </Grid>
                ))}
              </Grid>
            </Div> */}
          </Card>
        </Grid>

        <Grid
          size={{
            md: 4,
            xs: 12,
          }}
        >
          <RightContentWrapper>
            {/* PROJECT TOOLS */}
            <Card>
              <Paragraph fontWeight={600}>Author Details</Paragraph>

              {challengeData?.author ? (
                <FlexBox
                  alignItems="center"
                  gap={1.5}
                  mt={2}
                  key={challengeData.author.id}
                >
                  <StyledAvatar
                    alt="Logo"
                    src={challengeData.author.companyLogo}
                  />

                  <div>
                    <Paragraph fontWeight={500}>
                      {challengeData.author.name}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {challengeData.author.companyName || "Unknown Company"}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {challengeData.author.phoneNumber}
                    </Paragraph>
                    <Paragraph fontSize={12} mt="2px" color="text.secondary">
                      {challengeData.author.email}
                    </Paragraph>
                  </div>
                </FlexBox>
              ) : (
                <Paragraph fontSize={14} color="text.secondary">
                  No author details available
                </Paragraph>
              )}
            </Card>

            {/* PROJECT STACKS */}
            <Card>
              <Paragraph fontWeight={600}>Project Stack</Paragraph>

              <FlexBox
                alignItems="center"
                gap={1.5}
                mt={2}
                key={challengeData?.id}
              >
                {/* <StyledAvatar alt="Logo" src={item.image} /> */}

                <div>
                  <Paragraph fontWeight={500}>
                    Target Value : {challengeData.targetValue}
                  </Paragraph>
                  <Paragraph
                    fontSize={12}
                    mt="2px"
                    color="text.secondary"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);

                      if (value === "steps") {
                        const walkingSport = sports.find(
                          (s) => s.name.toLowerCase() === "walking"
                        );
                        if (walkingSport) {
                          setFieldValue("qualifyingSports", [walkingSport.id]);
                        }
                      }
                    }}
                  >
                    Target Unit : {challengeData.targetUnit}
                  </Paragraph>
                </div>
              </FlexBox>
            </Card>
          </RightContentWrapper>
        </Grid>
      </Grid>
    </div>
  );
}
