import { useNavigate } from 'react-router-dom'; // MUI

import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import styled from '@mui/material/styles/styled'; // CUSTOM COMPONENTS

import IconWrapper from '@/components/icon-wrapper';
import { Paragraph } from '@/components/typography';
import { FlexBetween, FlexBox } from '@/components/flexbox'; // CUSTOM ICON COMPONENTS

import Add from '@/icons/Add'; // STYLED COMPONENT
import EngineeringIcon from '@mui/icons-material/Engineering';

const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
})); // ===================================================================

// ===================================================================
export default function HeadingArea({ value, changeTab }) {
  const navigate = useNavigate();
  return (
    <FlexBetween
      flexWrap="wrap"
      gap={1}
      style={{ marginBottom: "15px" }}
    >
      <FlexBox alignItems="center">
        <IconWrapper>
          <EngineeringIcon
            sx={{
              color: "primary.main",
            }}
          />
        </IconWrapper>

        <Paragraph fontSize={20} fontWeight="bold">
          Event Category
        </Paragraph>
      </FlexBox>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate("/add-gearstype")}
      >
        Add Event Category
      </Button>
    </FlexBetween>
  );
}