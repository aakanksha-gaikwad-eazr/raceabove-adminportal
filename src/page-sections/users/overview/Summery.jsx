import Card from '@mui/material/Card'; // CUSTOM COMPONENTS
import Box from '@mui/material/Box';
import MoreButton from '@/components/more-button';
import { H6, Paragraph } from '@/components/typography';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { Avatar } from '@mui/material';

export default function Summery({allDataOfSingleUser}) {
  return <Card className="p-3">
      <FlexBetween>
        <H6 fontSize={16}>Target</H6>
        {/* <MoreButton size="small" /> */}
      </FlexBetween>

      <Box mt={2}>
        {allDataOfSingleUser?.targets?.map((item) => (
          <Box key={item.id} mb={2}>
            <Avatar 
              src={item.banner} 
              alt={item.name}
              style={{ 
                width: '70%', 
                height: '150px',
                borderRadius: '8px',
                marginBottom: '8px'
              }} 
            />
            <Paragraph color="text.secondary" fontWeight={700}>
              {item.name}
            </Paragraph>
          </Box>
        ))}
      </Box>
    </Card>;
}