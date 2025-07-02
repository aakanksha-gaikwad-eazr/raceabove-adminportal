import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS
import { Button } from "@mui/material";
import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper";
import { FlexBetween, FlexBox } from "@/components/flexbox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM DATA
import Add from "@/icons/Add";
import SearchInput from "@/components/search-input";

const StyledRoot = styled(Card)({
  paddingTop: "1.5rem",
  paddingInline: "2rem",
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

// ==============================================================
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
    { title: "All", value: "all", amount: all.length },
    {
      title: "Upcoming",
      value: "upcoming",
      amount: upcomingEvents.length || 0,
    },
    {
      title: "Expired",
      value: "expired",
      amount: pastEvents.length || 0,
    },
  ];
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
            All Bookings
          </Paragraph>
        </FlexBox>

        {/* <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/events/team-member")}
        >
          Add Bookig
        </Button> */}
      </FlexBetween>
      <SearchAction>
        <SearchInput
          placeholder="Search Booking"
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
