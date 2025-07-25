import { useNavigate } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import styled from '@mui/material/styles/styled'; 
import IconWrapper from '@/components/icon-wrapper';
import { Paragraph } from '@/components/typography';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';



const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
}));

// ===================================================================
export default function HeadingAreaFAQ({
  value,
  changeTab
}) {
  const navigate = useNavigate();
  return (
    <FlexBetween flexWrap="wrap" gap={1} mb={"2rem"}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <LiveHelpIcon
            sx={{
              color: "primary.main",
            }}
          />
        </IconWrapper>

        <Paragraph fontSize={20} fontWeight="bold">
         Frequently Asked Questions
        </Paragraph>
      </FlexBox>

    </FlexBetween>
  );
}