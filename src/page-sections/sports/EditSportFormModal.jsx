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
import { getSports } from "@/store/apps/sports";
import { updateSports } from "@/store/apps/sports";

export default function EditSportsFormModal({ open, handleClose, data }) {
  const dispatch = useDispatch();
  const {singleSports}  = useSelector((state) => state.sports);
  const {sports}  = useSelector((state) => state.sports);
  // console.log("singleSports", singleSports)
  const [selectedImage, setSelectedImage] = useState(null);
  const [sportsData, setSportsData] = useState(null);

  useEffect(() => {
    if (open && data?.id) {
      const sportsDetails = sports.find(type => type.id === data.id);
      if (sportsDetails) {
        setSportsData(sportsDetails);
        setSelectedImage(sportsDetails.icon);
      }
    }
  }, [open, data?.id, sports]);

  const formik = useFormik({
    initialValues: {
      name: sportsData?.name || "",
      iconFile: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("sports name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        
        // Append all form values
        Object.keys(values).forEach((key) => {
        
            formData.append(key, values[key]);
          
        });

        const response = await dispatch(updateSports({ id: data?.id, data: formData }));

        if (response?.payload?.status === 200 || response?.meta?.requestStatus === 'fulfilled') {
          toast.success("sports updated successfully!");
          await dispatch(getSports());
          handleClose();
          formik.resetForm();
        } else {
          toast.error("Failed to update sports type.");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update sports type. Please try again.");
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Sports</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Sports Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
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
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    if (file) {
                      formik.setFieldValue("iconFile", file);
                      setSelectedImage(URL.createObjectURL(file));
                    }
                  }}
                />
                <Button variant="outlined" component="span" startIcon={<CameraAlt />}>
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
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
