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
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getSportsById, updateSports, getSports } from "../../store/apps/sports";
import toast from "react-hot-toast";

export default function EditSportFormModal({ open, handleClose, sportsId }) {
  console.log("sportsId",sportsId)
  const [previewUrl, setPreviewUrl] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const dispatch = useDispatch();
  const { singleSports } = useSelector((state) => state.sports);

  const initialValues = {
    name: "",
    iconFile: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Sport name is required"),
    iconFile: Yup.mixed(),
  });

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (iconFile) {
        console.log("iconFile", iconFile);
        formData.append("iconFile", iconFile);
      }

      try {
        const response = await dispatch(updateSports({ id: sportsId, data: formData }));
        if (response?.payload?.data) {
          console.log("form", response);
          toast.success("Sport updated successfully");
          await dispatch(getSports());
          // await dispatch(getSportsById(sportsId));
          handleClose();    
          resetForm();
          setIconFile(null);  
          setPreviewUrl(null);
        } else {
          toast.error("Failed to update sport");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error occurred while updating sport");
      }
    },
  });

  useEffect(() => {
    if (sportsId && open) {
      dispatch(getSportsById(sportsId));
    }
  }, [sportsId, open, dispatch]);

  // Update form when singleSports changes
  useEffect(() => {
    if (singleSports) {
      setFieldValue("name", singleSports?.name || "");
      if (singleSports?.icon) {
        setPreviewUrl(singleSports.icon || singleSports?.iconUrl);
      }
    }
  }, [singleSports, setFieldValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setFieldValue("iconFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Sport</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Sport Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              fullWidth
            />
            <Box display="flex" alignItems="center" gap={2}>
              {previewUrl && (
                <Avatar
                  src={previewUrl} alt="sports icon"
                  sx={{ width: 64, height: 64, bgcolor: "grey.100" }}
                  onError={() => console.error("Image failed to load:", previewUrl)}
                />
              )}
              {/* {previewUrl && (
  <img src={previewUrl} alt="Preview" style={{ width: 64, height: 64 }} />
)} */}
              <Box>
                <input
                  accept="image/*"
                  id="icon-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="icon-upload">
                  <Button variant="outlined" component="span">
                    Upload Icon
                  </Button>
                </label>
                {touched.iconFile && errors.iconFile && (
                  <Box color="error.main" mt={1} fontSize={12}>
                    {errors.iconFile}
                  </Box>
                )}
              </Box>
            </Box>
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
