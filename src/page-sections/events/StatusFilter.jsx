import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography"; // CUSTOM DATA

import GroupSenior from "@/icons/GroupSenior";

import IconWrapper from "@/components/icon-wrapper";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // CUSTOM ICON COMPONENTS

import SearchInput from "@/components/search-input"; // STYLED COMPONENTS
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Add from "@/icons/Add";

const StyledRoot = styled(Card)({
  paddingTop: "1.5rem",
  paddingInline: "2rem",
  marginBottom: "1rem",
  "& .MuiTabs-root": {
    borderBottom: "none",
  },
}); // ==============================================================

const SearchAction = styled("div")(({ theme }) => ({
  gap: 8,
  display: "flex",
  flexWrap: "wrap",
  paddingBlock: "2rem",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    "& > *": {
      width: "100%",
      maxWidth: "100%",
    },
  },
}));

export default function StatusFilter({
  value,
  handleChange,
  events,
  datewisefilter,
}) {
  const { pastEvents, upcomingEvents, all } = events
    ? datewisefilter(events)
    : { pastEvents: [], upcomingEvents: [], all: [] };
  const tabOptions = [
    { title: "All Events", value: "all", amount: all.length },
    {
      title: "Active Events",
      value: "upcoming",
      amount: upcomingEvents.length,
    },
    {
      title: "Past Events",
      value: "expired",
      amount: pastEvents.length,
    },
  ];

  const navigate = useNavigate();

  return (
    <StyledRoot>
      <FlexBetween
        flexWrap="wrap"
        gap={1}
        style={{ marginBottom: "6px" }}
      >
        <FlexBox alignItems="center">
          <IconWrapper>
            <GroupSenior
              sx={{
                color: "primary.main",
              }}
            />
          </IconWrapper>

          <Paragraph fontSize={20} fontWeight="bold">
            Event
          </Paragraph>
        </FlexBox>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/events/team-member")}
        >
          Create Event
        </Button>
      </FlexBetween>
      <SearchAction>
        <SearchInput
          placeholder="Find Events"
          onChange={(e) => handleChange(e.target.value)}
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </SearchAction>

      <TabContext value={value}>
        <TabList
          variant="scrollable"
          onChange={(_, value) => handleChange(value)}
        >
          {tabOptions.map(({ amount, title, value }) => (
            <Tab
              disableRipple
              key={title}
              value={value}
              label={
                <Paragraph>
                  {title} ({amount})
                </Paragraph>
              }
            />
          ))}
        </TabList>
      </TabContext>
    </StyledRoot>
  );
}
