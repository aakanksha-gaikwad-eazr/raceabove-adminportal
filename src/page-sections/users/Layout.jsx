import { Fragment } from "react";
import { Outlet } from "react-router-dom"; // MUI

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENTS

import CameraAlt from "@mui/icons-material/CameraAlt";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete"; // CUSTOM COMPONENTS

import BoxItem from "./BoxItem";
import ListItem from "./ListItem";
import { H6 } from "@/components/typography";
import AvatarBadge from "@/components/avatar-badge";
import AvatarLoading from "@/components/avatar-loading";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // ICON COMPONENTS

import DateRange from "@/icons/DateRange";
import Bratislava from "@/icons/Bratislava";
import MapMarkerIcon from "@/icons/MapMarkerIcon"; // CUSTOM UTILS METHOD

import { currency } from "@/utils/currency"; // STYLED COMPONENTS
import { Avatar } from "@mui/material";

const ContentWrapper = styled("div")({
  zIndex: 1,
  padding: 24,
  marginTop: 55,
  position: "relative",
});
const CoverPicWrapper = styled("div")({
  top: 0,
  left: 0,
  height: 125,
  width: "100%",
  overflow: "hidden",
  position: "absolute",
});
const StyledFlexBetween = styled(FlexBetween)({
  margin: "auto",
  flexWrap: "wrap",
});
const StyledTabList = styled(TabList)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: 16,
  paddingRight: 16,
  [theme.breakpoints.up("sm")]: {
    "& .MuiTabs-flexContainer": {
      justifyContent: "center",
    },
  },
}));

// =======================================================================

// =======================================================================
export default function Layout({
  children,
  handleTabList,
  allDataOfSingleUser,
}) {
  const joinedDate = new Date(allDataOfSingleUser?.createdAt);

  const formattedDate = joinedDate.toLocaleDateString("en-US", {
    // weekday: 'long',
    // year: 'numeric',
    month: "long",
    day: "numeric",
  });


  return (
    <Fragment>
      <Card
        sx={{
          position: "relative",
        }}
      >
        {/* <CoverPicWrapper>
          <img
            width="100%"
            height="100%"
            alt="Team Member"
            src="/static/cover/user-cover-pic.png"
            style={{
              objectFit: "cover",
            }}
          />
        </CoverPicWrapper> */}

        <ContentWrapper sx={{p:0}}>
          <FlexBox justifyContent="center" sx={{p:0}}>


                <Avatar src={allDataOfSingleUser?.profilePhoto}  sx={{
                  width: 100,
                  height: 100,
                }}/>
          </FlexBox>

          <Box mt={2}>
            <FlexBox justifyContent="center" alignItems="center" gap={1}>
              <H6 fontSize={18} textAlign="center">
                {allDataOfSingleUser?.name}
              </H6>
              {/* <IconButton size="small" onClick={handleEdit}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDelete}>
                <Delete fontSize="small" />
              </IconButton> */}
            </FlexBox>

            {/* <StyledFlexBetween paddingTop={1} maxWidth={340}>
              <ListItem title="Developer" Icon={Bratislava} />
              <ListItem title="New York" Icon={MapMarkerIcon} />
              <ListItem title={`Joined ${formattedDate}`} Icon={DateRange} />
            </StyledFlexBetween> */}
          </Box>

          <StyledFlexBetween paddingTop={4} maxWidth={600}>
            <BoxItem
              amount={`${allDataOfSingleUser?.wallet?.balance ?? "N/A"}`}
              title="Balance"
              color="primary.main"
            />
            <BoxItem
              amount={`${allDataOfSingleUser?.wallet?.totalCoinsEarned ?? "N/A"}`}
              title="Total Coins Earned"
              color="success.600"
            />
            <BoxItem
              amount={`${allDataOfSingleUser?.wallet?.totalCoinsUsed ?? "N/A"}`}
              title="Total Coins Used"
              color="warning.600"
            />
          </StyledFlexBetween>
        </ContentWrapper>

        <StyledTabList variant="scrollable" onChange={handleTabList}>
          <Tab disableRipple label="Overview" value="1" />
          <Tab disableRipple label="Challenge" value="2" />
          <Tab disableRipple label="Events" value="3" />
          {/* <Tab disableRipple label="Documents" value="4" /> */}
          <Tab disableRipple label="Wallet" value="5" />
          <Tab disableRipple label="Targets" value="6" />
        </StyledTabList>
      </Card>

      {children || <Outlet />}
    </Fragment>
  );
}
