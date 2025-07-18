import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import styled from "@mui/material/styles/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import Apps from "@mui/icons-material/Apps"; // Added missing import

// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper";
import { FlexBetween, FlexBox } from "@/components/flexbox";
import SearchInput from "@/components/search-input";
import Add from "@/icons/Add";
import FormatBullets from "@/icons/FormatBullets";
import { useCallback, useMemo } from "react";

// STYLED COMPONENTS
const StyledRoot = styled(Card)({
  paddingTop: "1rem",
  paddingInline: "2rem",
  marginBottom: "1rem",
  "& .MuiTabs-root": {
    borderBottom: "none",
  },
});

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
 tabCounts,
  gridRoute,
  listRoute,
}) {
  // Move hooks inside the component
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeColor = useCallback((path) =>    
    pathname === path ? "primary.main" : "grey.400",[pathname])
    
  const tabOptions = useMemo(()=>[
    { title: "All Events", value: "all", amount: tabCounts.all },
    { title: "Upcoming Events", value: "upcoming", amount: tabCounts.all },
    { title: "Past Events", value: "past", amount: tabCounts.past },
    { title: "Active Events", value: "active", amount: tabCounts.active },
    { title: "Inactive Events", value: "inactive", amount: tabCounts.inactive },

  ],[tabCounts])

 const handleListNavigation = useCallback(() => {
    navigate(listRoute);
  }, [navigate, listRoute]);

  const handleGridNavigation = useCallback(() => {
    navigate(gridRoute);
  }, [navigate, gridRoute]);

  return (
    <StyledRoot>

      <FlexBetween
        flexWrap="wrap"
        gap={1}
         sx={{ width: "100%" }}
      >
        <SearchAction >
          <SearchInput
            placeholder="Find Events"
            onChange={(e) => handleChange("searchValue",e.target.value)}
          />
        </SearchAction>

        <Box flexShrink={0} className="actions">
          <IconButton onClick={handleListNavigation}>
            <FormatBullets sx={{
              color: activeColor(listRoute)
            }} />
          </IconButton>

          <IconButton onClick={handleGridNavigation}>
            <Apps sx={{
              color: activeColor(gridRoute)
            }} />
          </IconButton>
        </Box>
      </FlexBetween>

      <TabContext value={value}>
        <TabList
          variant="scrollable"
          onChange={(_, value) => handleChange("date",value)}
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