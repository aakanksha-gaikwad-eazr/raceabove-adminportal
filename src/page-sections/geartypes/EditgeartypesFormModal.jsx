// components/CreateSportFormModal.js
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Avatar,
  } from "@mui/material";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { useDispatch, useSelector } from "react-redux";
  import { updateGearTypes, getGearTypes } from "../../store/apps/geartypes";
  import { useState, useEffect } from "react";
  import CameraAlt from "@mui/icons-material/CameraAlt";
  import toast from "react-hot-toast";
  
  export default function EditGearTypesFormModal({ open, handleClose, data }) {
    const dispatch = useDispatch();
    const { gearTypes } = useSelector((state) => state.geartypes);
    const [selectedImage, setSelectedImage] = useState(null);
    const [gearTypeData, setGearTypeData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      if (open && data?.id) {
        const gearType = gearTypes.find(type => type.id === data.id);
        if (gearType) {
          setGearTypeData(gearType);
          setSelectedImage(gearType.icon);
        }
      }
    }, [open, data?.id, gearTypes]);

    // Reset form and image when modal closes
    useEffect(() => {
      if (!open) {
        setSelectedImage(null);
        setGearTypeData(null);
      }
    }, [open]);
  
    const formik = useFormik({
      initialValues: {
        name: gearTypeData?.name || "",
        iconFile: null,
      },
      enableReinitialize: true,
      validationSchema: Yup.object({
        name: Yup.string().required("Gear type name is required"),
      }),
      onSubmit: async (values) => {
        if (isSubmitting) return; // Prevent double submission
        
        setIsSubmitting(true);
        
        try {
          const formData = new FormData();
          
          // Append all form values
          Object.keys(values).forEach((key) => {
            if (values[key] !== null && values[key] !== undefined) {
              formData.append(key, values[key]);
            }
          });

          console.log("Submitting update for gear type:", data?.id);
          const response = await dispatch(updateGearTypes({ id: data?.id, data: formData }));
          console.log("Update response:", response);
          
          // Check if the action was fulfilled (successful)
          if (response.meta.requestStatus === "fulfilled") {
            console.log("Gear type updated successfully");
            toast.success("Gear type updated successfully!");
            
            // Force refresh the gear types list
            await dispatch(getGearTypes()).unwrap();
            
            // Reset form and close modal
            formik.resetForm();
            setSelectedImage(null);
            handleClose();
          } else {
            // Handle rejected case
            console.error("Update failed:", response);
            const errorMessage = response.payload?.message || response.error?.message || "Failed to update gear type.";
            toast.error(errorMessage);
          }
        } catch (error) {
          console.error("Update error:", error);
          toast.error("Failed to update gear type. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    const handleModalClose = () => {
      if (!isSubmitting) {
        formik.resetForm();
        setSelectedImage(null);
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
        <DialogTitle>Edit Gear Type</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Gear Type Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                disabled={isSubmitting}
              />
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={selectedImage}
                  sx={{ width: 64, height: 64, bgcolor: "grey.100" }}
                />
                <label htmlFor="iconFile">
                  <input
                    id="iconFile"
                    name="iconFile"
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={isSubmitting}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        formik.setFieldValue("iconFile", file);
                        setSelectedImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    component="span" 
                    startIcon={<CameraAlt />}
                    disabled={isSubmitting}
                  >
                    Upload Image
                  </Button>
                </label>
              </Box>
              {formik.touched.iconFile && formik.errors.iconFile && (
                <Box sx={{ color: "error.main", fontSize: 13 }}>
                  {formik.errors.iconFile}
                </Box>
              )}
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