import Card from '@mui/material/Card'; // CUSTOM COMPONENTS
import Box from '@mui/material/Box';
import MoreButton from '@/components/more-button';
import { H6, Paragraph } from '@/components/typography';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { Avatar, Typography } from '@mui/material';

export default function Summery({allDataOfSingleUser}) {
const hasTargets=allDataOfSingleUser?.targets && Array.isArray(allDataOfSingleUser.targets) &&allDataOfSingleUser.targets.length >0;


  return <Card className="p-3">
      <FlexBetween>
        <H6 fontSize={16}>Target</H6>
      </FlexBetween>

      <Box mt={2}>
        {hasTargets? (
        allDataOfSingleUser?.targets?.map((item) => (
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
        ))

        ):(
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="150px"
            flexDirection="column"
          >
            <Typography variant="h6" color="text.secondary" mb={1}>
              No Targets
            </Typography>
            <Typography variant="body2" color="text.disabled">
              No targets available at the moment
            </Typography>
          </Box>
        )}
      </Box>
    </Card>;
}