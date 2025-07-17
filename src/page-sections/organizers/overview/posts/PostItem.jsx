import Stack from '@mui/material/Stack'; // CUSTOM COMPONENTS

import { FlexBetween, FlexBox } from '@/components/flexbox';
import { H6, Paragraph, Small } from '@/components/typography'; // CUSTOM ICON COMPONENT

import DateRange from '@/icons/DateRange'; // =======================================================================================

// =======================================================================================
export default function PostItem({
  date,
  title,
  imgLink,
  category
}) {
  return <FlexBetween sx={{border:"0.2px solid rgba(0, 0, 0, 0.26)", p:1, borderRadius:"15px"}}>
      <Stack spacing={0.5} >
        <H6 fontSize={14} sx={{textTransform:"capitalize"}}>{title}</H6>
        <Paragraph color="grey.500">{category}</Paragraph>

        <FlexBox gap={0.5} alignItems="center" color="text.secondary">
          <DateRange sx={{
          fontSize: 20
        }} />
          <Small lineHeight={1}>Publish on {date}</Small>
        </FlexBox>
      </Stack>

<FlexBox width={175} height={100} overflow="hidden" borderRadius="4px">
  <img
    src={imgLink}
    alt="Post"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'fill',
      display: 'block',
    }}
  />
</FlexBox>

    </FlexBetween>;
}