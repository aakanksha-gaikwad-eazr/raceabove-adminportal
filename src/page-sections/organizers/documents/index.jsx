
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { Tabs, Tab, Typography } from '@mui/material';
// CUSTOM ICON COMPONENT
import Folder from '@/icons/Folder';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import CategoryIcon from '@mui/icons-material/Category';
// CUSTOM COMPONENTS
import DocumentCard from './DocumentCard';
import { H6, Span } from '@/components/typography';
import SearchInput from '@/components/search-input';
import { FlexBox, FlexBetween } from '@/components/flexbox';

export default function Documents({ singleOrganizer }) {
  const downMD = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const allTicketTemplatesData = singleOrganizer?.ticketTemplates || [];
  const allTicketTypesData = singleOrganizer?.ticketTypes || [];

  // Filter function
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.filter(item => 
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredTemplates = filterItems(allTicketTemplatesData, searchQuery);
  const filteredTypes = filterItems(allTicketTypesData, searchQuery);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const totalResources = allTicketTemplatesData.length + allTicketTypesData.length;

  return (
    <Box py={3}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <FlexBetween flexWrap="wrap">
            <H6 fontSize={16} mb={1}>
              Ticket Management{' '}
              <Span fontSize={14} fontWeight={500} color="text.secondary">
                ({totalResources} Resources)
              </Span>
            </H6>

            <FlexBox gap={2} flexGrow={1} justifyContent="end" flexWrap="wrap">
              <SearchInput 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  maxWidth: downMD ? '100%' : 250
                }} 
              />

              <Button fullWidth={downMD} variant="contained">
                Manage Tickets
              </Button>
            </FlexBox>
          </FlexBetween>
        </Grid>

        <Grid size={12}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab 
              label={`Ticket Templates (${allTicketTemplatesData.length})`} 
              icon={<TicketIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Ticket Types (${allTicketTypesData.length})`} 
              icon={<CategoryIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Grid>

        {/* Ticket Templates Tab */}
        {activeTab === 0 && (
          <>
            {filteredTemplates.length === 0 ? (
              <Grid size={12}>
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight="200px"
                >
                  <Typography variant="h6" color="text.secondary">
                    {searchQuery ? 'No matching ticket templates found' : 'No ticket templates available'}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredTemplates.map((template) => (
                <Grid size={{ md: 4, sm: 6, xs: 12 }} key={template.id}>
                  <DocumentCard 
                    item={template} 
                    type="template"
                    Icon={TicketIcon}
                  />
                </Grid>
              ))
            )}
          </>
        )}

        {/* Ticket Types Tab */}
        {activeTab === 1 && (
          <>
            {filteredTypes.length === 0 ? (
              <Grid size={12}>
                <Box
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight="200px"
                >
                  <Typography variant="h6" color="text.secondary">
                    {searchQuery ? 'No matching ticket types found' : 'No ticket types available'}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredTypes.map((type) => (
                <Grid size={{ md: 4, sm: 6, xs: 12 }} key={type.id}>
                  <DocumentCard 
                    item={type} 
                    type="type"
                    Icon={CategoryIcon}
                  />
                </Grid>
              ))
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}