import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Timeline from '@mui/lab/Timeline'; // CUSTOM COMPONENTS

import Scrollbar from '@/components/scrollbar';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { H6, Span } from '@/components/typography'; // CUSTOM SECTION COMPONENTS

import PinItem from './PinItem';
import ChatItem from './chat-item';
import EditItem from './edit-item';
import FileItem from './file-item';
import LayerItem from './LayerItem';
import ActivityItem from './activityItem';
// import ActivityItem from './ActivityItem'; // You create this generic item

export default function Activity({allDataOfSingleUser}) {
    const activities = allDataOfSingleUser?.activities || [];
    console.log("activities", activities)

  return <Box py={3}>
   
      <Card>
        <FlexBetween flexWrap="wrap" p={3}>
          <H6 fontSize={16}>
            My Activities{' '}
            <Span fontSize={14} fontWeight={400} color="text.secondary">
              ({activities.length} activities)
            </Span>
          </H6>

          {/* <Select defaultValue="today" size="small">
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select> */}
        </FlexBetween>

        <Divider />

        <Box my={2}>
          <Scrollbar autoHide={false}>
            {/* <Timeline>
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))} */}

              {/* Static fallback items (optional) */}
             {activities.map((activity) => ( <ChatItem key={activity.id} activity={activity} /> ))}
              {/* <PinItem /> */}
              {/* <FileItem /> */}
              {/* <LayerItem /> */}
            {/* </Timeline> */}
          </Scrollbar>
        </Box>
      </Card>
    
      {/* <Card>
        <FlexBetween flexWrap="wrap" p={3}>
          <H6 fontSize={16}>
            My Connections{' '}
            <Span fontSize={14} fontWeight={400} color="text.secondary">
              (100+ Resources)
            </Span>
          </H6>

          <Select defaultValue="today" size="small">
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FlexBetween>

        <Divider />

        <Box my={2}>
          <Scrollbar autoHide={false}>
            <Timeline>
              <ChatItem />
              <PinItem />
              <FileItem />
              <LayerItem />
              <EditItem />
            </Timeline>
          </Scrollbar>
        </Box>
      </Card> */}
    </Box>;
}