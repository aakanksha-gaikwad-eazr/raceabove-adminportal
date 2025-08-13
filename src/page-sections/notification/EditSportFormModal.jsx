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
import { useState, useEffect } from "react";
import CameraAlt from "@mui/icons-material/CameraAlt";
import toast from "react-hot-toast";
import { getSports, updateSports } from "@/store/apps/sports";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import { FlexBox } from "@/components/flexbox";

export default function EditSportsFormModal({ open, handleClose, sportId }) {
  const dispatch = useDispatch();
  const { sports } = useSelector((state) => state.sports);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sportsData, setSportsData] = useState(null);

  useEffect(() => {
    if (open && sportId?.id) {
      const sportsDetails = sports.find((type) => type.id === sportId.id);
      if (sportsDetails) {
        setSportsData(sportsDetails);
        setSelectedImage(sportsDetails.icon);
      }
    }
  }, [open, sportId?.id, sports]);

  const formik = useFormik({
    initialValues: {
      name: sportsData?.name || "",
      iconFile: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Sports name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Append name
        formData.append('name', values.name);
        
        // Only append iconFile if a new file was selected
        if (values.iconFile) {
          formData.append('iconFile', values.iconFile);
        }

        const response = await dispatch(
          updateSports({ id: sportId?.id, data: formData })
        );
        
        if (
          response?.payload?.status === 200 ||
          response?.meta?.requestStatus === "fulfilled"
        ) {
          toast.success("Sports updated successfully!");
          dispatch(getSports());
          handleClose();
          formik.resetForm();
          setSelectedImage(null);
        } else {
          toast.error("Failed to update sports.");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update sports. Please try again.");
      }
    },
  });

  const handleCloseModal = () => {
    handleClose();
    formik.resetForm();
    setSelectedImage(null);
    setSportsData(null);
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        px: 3, 
        pt: 3 
      }}>
        <IconWrapper>
          <SportsBaseballIcon
            sx={{
              color: "primary.main",
              fontSize: 24
            }}
          />
        </IconWrapper>
        <DialogTitle sx={{ p: 0, flex: 1 }}>
          Edit Sports
        </DialogTitle>
      </Box>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Sports Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
            />
            
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedImage}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: "grey.100",
                    border: '2px solid',
                    borderColor: 'divider'
                  }}
                >
                  {!selectedImage && <SportsBaseballIcon sx={{ fontSize: 40, color: 'grey.500' }} />}
                </Avatar>
                
                <Box>
                  <label htmlFor="iconFile">
                    <input
                      id="iconFile"
                      name="iconFile"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          // Validate file size (e.g., max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            formik.setFieldError('iconFile', 'File size must be less than 5MB');
                            return;
                          }
                          
                          // Validate file type
                          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                          if (!allowedTypes.includes(file.type)) {
                            formik.setFieldError('iconFile', 'Only JPG, PNG, and GIF files are allowed');
                            return;
                          }
                          
                          formik.setFieldValue("iconFile", file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSelectedImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CameraAlt />}
                      size="small"
                    >
                      Change Icon
                    </Button>
                  </label>
                  
                  {selectedImage && selectedImage !== sportsData?.icon && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedImage(sportsData?.icon || null);
                        formik.setFieldValue('iconFile', null);
                      }}
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Reset to Original
                    </Button>
                  )}
                </Box>
              </Box>
              
              {formik.touched.iconFile && formik.errors.iconFile && (
                <Box sx={{ color: "error.main", fontSize: 12, mt: 1 }}>
                  {formik.errors.iconFile}
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined" 
            color="secondary"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}