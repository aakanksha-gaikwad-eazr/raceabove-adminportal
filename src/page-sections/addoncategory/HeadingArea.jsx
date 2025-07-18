import { useNavigate } from 'react-router-dom'; // MUI

import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import styled from '@mui/material/styles/styled'; // CUSTOM COMPONENTS

import IconWrapper from '@/components/icon-wrapper';
import { Paragraph } from '@/components/typography';
import { FlexBetween, FlexBox } from '@/components/flexbox'; // CUSTOM ICON COMPONENTS
import StorefrontIcon from '@mui/icons-material/Storefront';


const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
})); // ===================================================================

// ===================================================================
export default function HeadingArea({
  value,
  changeTab
}) {
  const navigate = useNavigate();
  return <FlexBetween flexWrap="wrap" gap={1} mb={"2rem"}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <StorefrontIcon sx={{
          color: 'primary.main'
        }} />
        </IconWrapper>

        <Paragraph fontSize={16} style={{fontWeight:"bold"}} >Product Categories</Paragraph>
      </FlexBox>

      {/* <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label="All Users" value="" />
          <Tab disableRipple label="Editor" value="editor" />
          <Tab disableRipple label="Contributor" value="contributor" />
          <Tab disableRipple label="Administrator" value="administrator" />
          <Tab disableRipple label="Subscriber" value="subscriber" />
        </TabListWrapper>
      </TabContext> */}

      {/* <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/add-addoncategory')}>
        Add New Product Category
      </Button> */}
    </FlexBetween>;
}