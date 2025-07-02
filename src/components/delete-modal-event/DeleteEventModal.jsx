import MuiModal from "@mui/material/Modal"; // STYLED COMPONENT

import { StyledScrollbar, Wrapper } from "./styles"; // ===========================================================================
import { Box, Button, IconButton, Typography } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

// ===========================================================================
export default function DeleteEventModal({
  children,
  open,
  showCloseButton = true,
  handleClose,
  title,
  actions,
  message,
  ...props
}) {
  return (
    <MuiModal open={open} onClose={handleClose}>
      <Wrapper {...props}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6" color="black">{title}</Typography>
          {showCloseButton && (
            <IconButton onClick={handleClose}>
              <GridCloseIcon />
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
