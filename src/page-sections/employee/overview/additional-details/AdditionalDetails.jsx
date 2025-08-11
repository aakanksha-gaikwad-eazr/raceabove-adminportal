import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme'; // CUSTOM COMPONENTS

import ListItem from './ListItem';
import { H6 } from '@/components/typography';
import MoreButton from '@/components/more-button';
import FlexBetween from '@/components/flexbox/FlexBetween'; // CUSTOM ICON COMPONENTS

import Globe from '@/icons/Globe';
import DateRange from '@/icons/DateRange';
import Education from '@/icons/Education';
import UserOutlined from '@/icons/UserOutlined';
import EmailOutlined from '@/icons/EmailOutlined';
import BriefcaseOutlined from '@/icons/BriefcaseOutlined';
export default function AdditionalDetails({allDataOfSingleUser}) {
  const theme = useTheme();
  return <Card className="p-3">
      <FlexBetween>
        <H6 fontSize={16}>Wallet</H6>
        <MoreButton size="small" />
      </FlexBetween>

      <Stack mt={3} spacing={2}>
        <ListItem title="Total Coins Earned" Icon={EmailOutlined} subTitle={allDataOfSingleUser?.wallet?.totalCoinsEarned} color={theme.palette.grey[400]} />

        <ListItem Icon={Globe} title="Total Coins Used" subTitle={allDataOfSingleUser?.wallet?.totalCoinsUsed} color={theme.palette.primary.main} />

        <ListItem title="Balance" subTitle={allDataOfSingleUser?.wallet?.balance} Icon={UserOutlined} color={theme.palette.warning[600]} />

        {/* <ListItem Icon={DateRange} title="Join Date" subTitle="Aug 15th, 2021" color={theme.palette.success.main} />

        <ListItem title="Work History" subTitle="Theme Forest" Icon={BriefcaseOutlined} color={theme.palette.error.main} />

        <ListItem Icon={Education} title="Education" subTitle="Cambridge University" color={theme.palette.warning.main} /> */}
      </Stack>
    </Card>;
}