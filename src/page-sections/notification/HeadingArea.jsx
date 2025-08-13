import { useNavigate } from 'react-router-dom'; 

import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import styled from '@mui/material/styles/styled'; 

import IconWrapper from '@/components/icon-wrapper';
import { Paragraph } from '@/components/typography';
import { FlexBetween, FlexBox } from '@/components/flexbox';

import Add from '@/icons/Add'; 
import NotificationsIcon from '@mui/icons-material/Notifications';



const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
})); // ===================================================================

export default function HeadingArea({
  value,
  changeTab
}) {
  const navigate = useNavigate();
  return (
    <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <NotificationsIcon
            sx={{
              color: "primary.main",
            }}
          />
        </IconWrapper>

        <Paragraph fontSize={20} fontWeight="bold">
          Notifications
        </Paragraph>
      </FlexBox>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/add-notification')}>
        Add New Notification 
      </Button>
    </FlexBetween>
  );
}