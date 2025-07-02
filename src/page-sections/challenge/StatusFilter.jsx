import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography"; // CUSTOM DATA

import { PROJECT_STATUS } from "@/__fakeData__/projects"; // STYLED COMPONENTS

const StyledRoot = styled(Card)({
  paddingTop: "1.5rem",
  paddingInline: "2rem",
  "& .MuiTabs-root": {
    borderBottom: "none",
  },
}); // ==============================================================

// ==============================================================
export default function StatusFilter({
  value,
  handleChange,
  challenges,
  datewisefilter,
}) {
  const { pastChallenges, upcomingChallenges, all } = challenges
    ? datewisefilter(challenges)
    : { pastChallenges: [], upcomingChallenges: [], all: [] };
  const tabOptions = [
    { title: "All", value: "all", amount: all.length },
    { title: "Upcoming", value: "upcoming", amount: upcomingChallenges.length },
    { title: "Expired", value: "expired", amount: pastChallenges.length },
  ];
  const validValues = ["all", "upcoming", "expired"];
  const safeValue = validValues.includes(value) ? value : "all";
  return (
    <StyledRoot>
      <H6 fontSize={20} mb={2}>
        Challenges
      </H6>

      <TabContext value={safeValue}>
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
