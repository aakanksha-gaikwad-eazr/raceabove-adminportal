import { useNavigate } from 'react-router-dom'; // MUI

import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import styled from '@mui/material/styles/styled'; // CUSTOM COMPONENTS

import IconWrapper from '@/components/icon-wrapper';
import { Paragraph } from '@/components/typography';
import { FlexBetween, FlexBox } from '@/components/flexbox'; // CUSTOM ICON COMPONENTS
import DiscountIcon from '@mui/icons-material/Discount';

const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
})); // ===================================================================

// ===================================================================
export default function HeadingAreaCoupon({
  value,
  changeTab
}) {
  const navigate = useNavigate();
  return (
    <FlexBetween flexWrap="wrap" gap={1} mb={"2rem"}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <DiscountIcon
            sx={{
              color: "primary.main",
            }}
          />
        </IconWrapper>

        <Paragraph fontSize={20} fontWeight="bold">
          Coupons
        </Paragraph>
      </FlexBox>


      {/* <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate("/add-coupons")}
      >
        Add New Coupon
      </Button> */}
    </FlexBetween>
  );
}