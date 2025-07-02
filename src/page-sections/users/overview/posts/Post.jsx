import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button"; // MUI ICON COMPONENT

import Add from "@mui/icons-material/Add"; // CUSTOM COMPONENTS

import PostItem from "./PostItem";
import { H6 } from "@/components/typography";
import FlexBetween from "@/components/flexbox/FlexBetween";
export default function Post({ allDataOfSingleUser }) {
  const data = allDataOfSingleUser?.eventParticipations || [];
  return (
    <Card className="p-3">
      <FlexBetween flexWrap="wrap" gap={1}>
        <H6 fontSize={16}>Events Participated</H6>

        {/* <Button color="secondary" variant="outlined" startIcon={<Add />}>
          Create a post
        </Button> */}
      </FlexBetween>

      {data.map((item) => {
        const event = item?.slot?.event;
        if (!event) return null;

        return (
          <Stack spacing={3} mt={2} key={item.id}>
            <PostItem
              category={item?.slot?.event?.location?.address}
              date={item?.slot?.event?.date}
              imgLink={item?.slot?.event?.banner}
              title={item?.slot?.event?.title}
            />

            {/* <PostItem category="Environment" date="Aug 21, 2021" imgLink="/static/post/2.png" title="Global Warming Conclusion" />

        <PostItem category="Environment" date="Jun 21, 2021" imgLink="/static/post/3.png" title="Crypto is the future" /> */}
          </Stack>
        );
      })}
    </Card>
  );
}
