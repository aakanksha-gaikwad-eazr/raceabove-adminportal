import { useState } from "react";
import MuiModal from "@mui/material/Modal";
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio 
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

// STYLED COMPONENT
import { StyledScrollbar, Wrapper } from "./styles";

// ===========================================================================

export default function ApprovalModal({
  open,
  handleClose,
  title = "Approval Review",
  initialData = { approvalStatus: "", reviewReason: "" },
  showCloseButton = true,
  onSubmit,
  ...props
}) {
  const [formData, setFormData] = useState({
    approvalStatus: initialData.approvalStatus || "",
    reviewReason: initialData.reviewReason || ""
  });

  const [errors, setErrors] = useState({});

  const handleStatusChange = (event) => {
    setFormData({
      ...formData,
      approvalStatus: event.target.value
    });
    // Clear error when user selects a status
    if (errors.approvalStatus) {
      setErrors({ ...errors, approvalStatus: "" });
    }
  };

  const handleReasonChange = (event) => {
    setFormData({
      ...formData,
      reviewReason: event.target.value
    });
    // Clear error when user types
    if (errors.reviewReason) {
      setErrors({ ...errors, reviewReason: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate approval status
    if (!formData.approvalStatus) {
      newErrors.approvalStatus = "approvalStatus should not be empty";
    } else if (!["pending", "approved", "rejected"].includes(formData.approvalStatus)) {
      newErrors.approvalStatus = "approvalStatus must be one of the following values: pending, approved, rejected";
    }
    
    // Validate review reason
    if (!formData.reviewReason) {
      newErrors.reviewReason = "reviewReason should not be empty";
    } else if (typeof formData.reviewReason !== "string") {
      newErrors.reviewReason = "reviewReason must be a string";
    } else if (!formData.reviewReason.trim()) {
      newErrors.reviewReason = "reviewReason should not be empty";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("formdata", formData)
      onSubmit(formData);
      handleClose();
      setFormData({
        approvalStatus: "",
        reviewReason: ""
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    handleClose();
    // Reset form on cancel
    setFormData({
      approvalStatus: initialData.approvalStatus || "",
      reviewReason: initialData.reviewReason || ""
    });
    setErrors({});
  };

  return (
    <MuiModal open={open} onClose={handleCancel}>
      <Wrapper {...props}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          borderBottom="1px solid #e0e0e0"
        >
          <Typography variant="h6" color="black">
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton onClick={handleCancel}>
              <GridCloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Form Content */}
        <StyledScrollbar>
          <Box p={3}>
            {/* Approval Status */}
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend" sx={{ color: "black", fontWeight: "bold" }}>
                Approval Status *
              </FormLabel>
              <RadioGroup
                value={formData.approvalStatus}
                onChange={handleStatusChange}
                row
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="approved"
                  control={<Radio />}
                  label="Approved"
                />
                <FormControlLabel
                  value="rejected"
                  control={<Radio />}
                  label="Rejected"
                />
              </RadioGroup>
              {errors.approvalStatus && (
                <Typography color="error" variant="caption">
                  {errors.approvalStatus}
                </Typography>
              )}
            </FormControl>

            {/* Review Reason */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Review Reason"
              placeholder="Please provide a reason for your decision..."
              value={formData.reviewReason}
              onChange={handleReasonChange}
              error={!!errors.reviewReason}
              helperText={errors.reviewReason}
              sx={{ mt: 2 }}
              required
            />
          </Box>
        </StyledScrollbar>

        {/* Actions */}
        <Box 
          display="flex" 
          justifyContent="flex-end" 
          p={2} 
          gap={1}
          borderTop="1px solid #e0e0e0"
        >
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ minWidth: 100 }}
          >
            Submit
          </Button>
        </Box>
      </Wrapper>
    </MuiModal>
  );
}