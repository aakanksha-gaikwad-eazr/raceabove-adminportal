import MuiModal from "@mui/material/Modal"; // STYLED COMPONENT

import { StyledScrollbar, Wrapper } from "./styles"; // ===========================================================================
import { Box, Button, IconButton, Typography } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

// ===========================================================================
export default function DeleteModal({
  children,
  open,
  showCloseButton = true,
  handleClose,
  title,
  actions,
  message,
  handleConfirm,
  ...props
}) {
  return (
    <MuiModal open={open} onClose={handleClose}>
      <Wrapper {...props}>
        {/* MODAL HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2.5}
          py={1.5}
          sx={{
            borderBottom: '1px solid #e1e5e9',
            backgroundColor: 'white'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              color: '#1a1a1a',
              fontSize: '12px'
            }}
          >
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton 
              onClick={handleClose}
              size="small"
              sx={{ 
                color: '#6b7280',
                '&:hover': { 
                  backgroundColor: '#f3f4f6',
                  color: '#374151'
                } 
              }}
            >
              <GridCloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" p={1}>
          <Typography color="black">{message}</Typography> 
        </Box>
        <StyledScrollbar>{children}</StyledScrollbar>
        {actions && (
          <Box display="flex" justifyContent="flex-end" p={1} gap={1}>
            {actions.map((action, index) => (
              <Button key={index} {...action.props}>
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Wrapper>
    </MuiModal>
  );
}