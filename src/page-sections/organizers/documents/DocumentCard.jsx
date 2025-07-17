import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { Chip, Stack, Divider, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';
// CUSTOM COMPONENTS
import { H6, Paragraph } from '@/components/typography';
import { FlexBetween } from '@/components/flexbox';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontSize: '0.75rem',
}));

export default function DocumentCard({ item, type, Icon }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActiveStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (price) => {
    return price ? `₹${parseFloat(price).toLocaleString()}` : 'Free';
  };

  return (
    <StyledCard>
      {/* Status Chips */}
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ position: 'absolute', top: 12, right: 12 }}
      >
        <Chip
          label={item?.approvalStatus || 'pending'}
          color={getStatusColor(item?.approvalStatus)}
          size="small"
          variant="outlined"
        />
        <Chip
          label={item?.isActive ? 'Active' : 'Inactive'}
          color={getActiveStatusColor(item?.isActive)}
          size="small"
        />
      </Stack>


      {/* Content */}
      <Box sx={{ flexGrow: 1 }}>
        <H6 
          fontSize={14} 
          textAlign="center" 
          mb={1}
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {item?.title || 'Untitled'}
        </H6>

        <Paragraph 
          color="text.secondary" 
          textAlign="center" 
          fontSize={12}
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 2
          }}
        >
          {item?.description || 'No description'}
        </Paragraph>

        <Divider sx={{ my: 1 }} />

        {/* Type-specific information */}
        <Stack spacing={1}>
          {type === 'template' && (
            <>
              <FlexBetween>
                <Paragraph fontSize={11} color="text.secondary">Price:</Paragraph>
                <Paragraph fontSize={11} fontWeight={500} color="primary.main">
                  {formatPrice(item?.price)}
                </Paragraph>
              </FlexBetween>
              
              <FlexBetween>
                <Paragraph fontSize={11} color="text.secondary">Quantity:</Paragraph>
                <Paragraph fontSize={11} fontWeight={500}>
                  {item?.quantity || 'N/A'}
                </Paragraph>
              </FlexBetween>
              
              <FlexBetween>
                <Paragraph fontSize={11} color="text.secondary">Age Range:</Paragraph>
                <Paragraph fontSize={11} fontWeight={500}>
                  {item?.minAge && item?.maxAge ? `${item.minAge}-${item.maxAge}` : 'N/A'}
                </Paragraph>
              </FlexBetween>
            </>
          )}

          {type === 'type' && (
            <>
              <FlexBetween>
                <Paragraph fontSize={11} color="text.secondary">Type:</Paragraph>
                <Paragraph fontSize={11} fontWeight={500}>
                  {item?.title || 'N/A'}
                </Paragraph>
              </FlexBetween>
            </>
          )}

          <FlexBetween>
            <Paragraph fontSize={11} color="text.secondary">Created:</Paragraph>
            <Paragraph fontSize={11} fontWeight={500}>
              {formatDate(item?.createdAt)}
            </Paragraph>
          </FlexBetween>

          <FlexBetween>
            <Paragraph fontSize={11} color="text.secondary">Updated:</Paragraph>
            <Paragraph fontSize={11} fontWeight={500}>
              {formatDate(item?.updatedAt)}
            </Paragraph>
          </FlexBetween>
        </Stack>
      </Box>

      {/* Footer */}
      <FlexBetween 
        mt={2} 
        pt={1} 
        sx={{ borderTop: 1, borderColor: 'divider' }}
      >
        <Paragraph fontSize={10} color="text.secondary">
          ID: {item?.id?.slice(-8) || 'N/A'}
        </Paragraph>
        <Paragraph fontSize={10} color="text.secondary">
          By: {item?.createdBy || 'Unknown'}
        </Paragraph>
      </FlexBetween>
    </StyledCard>
  );
}