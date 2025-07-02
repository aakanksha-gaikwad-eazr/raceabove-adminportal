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

import {
  PROJECT_FILES,
  PROJECT_STACKS,
  PROJECT_TASKS,
  PROJECT_TOOLS,
} from "@/__fakeData__/projects"; // STYLED COMPONENTS
import { useFetcher, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getChallengesById } from "../../../store/apps/challenges";
import { getAllDataOfUser } from "../../../store/apps/user";
import { all } from "axios";

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

export default function UserDetails2() {
  const dispatch = useDispatch();
  const  {allDataOfSingleUser}  = useSelector((state) => state.user);
  console.log("allDataOfSingleUser", allDataOfSingleUser);

  const [loading, setLoading] = useState(true);
  const storedUserId = localStorage.getItem("selectedUserId");



  // const getusersID = "bf9d6cc3-33f6-4fe2-a6cc-1b92c465c8f8";

  useEffect(() => {
    if(storedUserId){
      dispatch(getAllDataOfUser(storedUserId));
    }
  }, [storedUserId]);

  //getChallenges

  // if (loading) {
  //   return (
  //     <div
  //       style={{ display: "flex", justifyContent: "center", padding: "20px" }}
  //     >
  //       <CircularProgress />
  //     </div>
  //   );
  // }

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
            <h1>hello</h1>
            <Div>
              <FlexBetween>
                <H6 fontSize={18} mb={1}>
                  {allDataOfSingleUser?.name?.toUpperCase()}
                </H6>

                <MoreButton Icon={MoreHoriz} />
              </FlexBetween>

              <Paragraph lineHeight={1.75} color="text.secondary">
                {allDataOfSingleUser?.phoneNumber}
              </Paragraph>

              <Paragraph lineHeight={1.75} color="text.secondary">
                {allDataOfSingleUser?.email}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                {allDataOfSingleUser?.height}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                {allDataOfSingleUser?.age}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                {allDataOfSingleUser?.weight}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                {allDataOfSingleUser?.exerciseLevel}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                Start Date:
                {allDataOfSingleUser?.startDate}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                End Date:
                {allDataOfSingleUser?.endDate}
              </Paragraph>
              <Paragraph lineHeight={1.75} color="text.secondary">
                activitiesCount:
                {allDataOfSingleUser?.activitiesCount}
              </Paragraph>
              {/* make a togggle */}
              <Paragraph lineHeight={1.75} color="text.secondary">
                isActive:
                {allDataOfSingleUser?.isActive}
              </Paragraph>
            </Div>

            <Divider />
            <div
              className="img-wrapper"
              // style={{
              //   textAlign: "center",
              //   paddingTop: "15px",
              //   paddingBottom: "15px",
              // }}
            >
              <img
                src={allDataOfSingleUser?.profilePhoto}
                alt="Project Thumbnail"
                style={{ height: "300px" }}
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

                  {/* {allDataOfSingleUser?.map((task) => (
                    <StyledFormControlLabel
                      key={task.id}
                      control={
                        <Radio
                          size="small"
                          disableRipple
                          disableTouchRipple
                          disableFocusRipple
                          checked={task.name === "Completed"}
                        />
                      }
                      label={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                      }
                    />
                  ))} */}
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

              {allDataOfSingleUser ?.eventParticipations? (
                <FlexBox alignItems="center" gap={1.5} mt={2} key={allDataOfSingleUser.id}>
                  {/* <StyledAvatar
                    alt="Logo"
                    src={allDataOfSingleUser.author.companyLogo}
                  /> */}

                  <div>
                    <Paragraph fontWeight={500}>
                      {allDataOfSingleUser?.eventParticipations?.participationStatus}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {allDataOfSingleUser?.eventParticipations?.isActive || "Unknown stauts"}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {allDataOfSingleUser.eventParticipations?.slot?.startTime}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {allDataOfSingleUser.eventParticipations?.slot?.endTime}
                    </Paragraph>
                    <Paragraph fontWeight={500}>
                      {allDataOfSingleUser.eventParticipations?.slot?.capacity}
                    </Paragraph>
                    {/* event associated with user */}
                    <Paragraph fontSize={12} mt="2px" color="text.secondary">
                     {allDataOfSingleUser.eventParticipations?.event?.title}
                    </Paragraph>
                    <Paragraph fontSize={12} mt="2px" color="text.secondary">
                     {allDataOfSingleUser.eventParticipations?.event?.address}
                    </Paragraph>
                    <Paragraph fontSize={12} mt="2px" color="text.secondary">
                     {allDataOfSingleUser.eventParticipations?.tickets?.name}
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

              <FlexBox alignItems="center" gap={1.5} mt={2} key={allDataOfSingleUser?.id}>
                {/* <StyledAvatar alt="Logo" src={item.image} /> */}

                {/* <div>
                  <Paragraph fontWeight={500}>
                    Target Value : {challengeData.targetValue}
                  </Paragraph>
                  <Paragraph fontSize={12} mt="2px" color="text.secondary">
                    Target Unit : {challengeData.targetUnit}
                  </Paragraph>
                </div> */}
              </FlexBox>
            </Card>
          </RightContentWrapper>
        </Grid>
      </Grid>
    </div>
  );
}
