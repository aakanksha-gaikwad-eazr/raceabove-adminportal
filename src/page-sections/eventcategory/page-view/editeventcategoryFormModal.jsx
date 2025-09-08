// components/EditEventCategoryFormModal.js
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getEventCategory, updateEventCategory } from "@/store/apps/eventscategory";

export default function EditEventCategoryFormModal({ open, handleClose, data }) {
  const dispatch = useDispatch();
  const { eventCategory } = useSelector((state) => state.eventCategories);
  const [eventCategoryData, setEventCategoryData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && data?.id) {
      const eventCategories = eventCategory.find(type => type.id === data.id);
      if (eventCategories) {
        setEventCategoryData(eventCategories);
      }
    }
  }, [open, data?.id, eventCategory]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setEventCategoryData(null);
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      name: eventCategoryData?.name || "",
      description: eventCategoryData?.description || "",
      isActive: eventCategoryData?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Event Category name is required"),
      description: Yup.string().required("Description is required"),
      isActive: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      if (isSubmitting) return; // Prevent double submission
      
      setIsSubmitting(true);
      
      try {
        // Send JSON payload instead of FormData
        const payload = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        };

        console.log("Submitting update for event Category:", data?.id);
        console.log("Update payload:", payload);
        
        const response = await dispatch(updateEventCategory({ 
          id: data?.id, 
          data: payload 
        }));
        
        console.log("Update response:", response);
        
        // Check if the action was fulfilled (successful)
        if (response.meta.requestStatus === "fulfilled") {
          console.log("Event Category updated successfully");
          toast.success("Event Category updated successfully!");
          
          // Force refresh the event categories list
          await dispatch(getEventCategory()).unwrap();
          
          // Reset form and close modal
          formik.resetForm();
          handleClose();
        } else {
          // Handle rejected case
          console.error("Update failed:", response);
          const errorMessage = response.payload?.message || response.error?.message || "Failed to update Event Category.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update Event Category. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleModalClose = () => {
    if (!isSubmitting) {
      formik.resetForm();
      handleClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleModalClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle>Edit Event Category</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Event Category Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
              disabled={isSubmitting}
            />
            
            <TextField
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              multiline
              rows={3}
              fullWidth
              disabled={isSubmitting}
            />

            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  disabled={isSubmitting}
                />
              }
              label="Active"
            />

            {/* Icon upload removed - API doesn't support icons */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleModalClose} 
            variant="outlined" 
            color="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}