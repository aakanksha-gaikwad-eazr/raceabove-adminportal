// components/CreateGearTypesFormModal.js
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { createGears, getGears } from "../../store/apps/gears";
import { getGearTypes } from "../../store/apps/geartypes";
import { getSports } from "../../store/apps/sports";

export default function CreateGearsFormModal({ open, handleClose }) {
  const [uploading, setUploading] = useState(false);
  const [photoFilenew, setPhotoFileNew] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { gears } = useSelector((state) => state.gears);

  console.log(photoFilenew, "photoFilenew");

  // Fetch gear types and sports on component mount
  useState(() => {
    dispatch(getGears());
  }, [dispatch]);

  const initialValues = {
    typeId: "",
    sportId: "",
    brand: "",
    model: "",
    weight: "",
    photoFile: null,
  };

  const validationSchema = Yup.object({
    typeId: Yup.string().required("typeId is required"),
    sportId: Yup.string().required("sportId is required"),
    brand: Yup.string().required("brand is required"),
    model: Yup.string().required("model is required"),
    photoFile: Yup.mixed().required("photo is required"),
    weight: Yup.number()
      .required("Weight is required")
      .positive("Weight must be positive")
      .typeError("Weight must be a number"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
    
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'photoFile' && value instanceof File) {
          formData.append('photoFile', value);
        } else {
          formData.append(key, value);
        }
      });
    
      console.log('📦 Submitting FormData:', formData);
    
      try {
        const response = await dispatch(createGears(formData)); // ✅ Fixed this line
        console.log('📤 Response:', response);
    
        if (response?.payload?.status === 200 || response?.meta?.requestStatus === 'fulfilled') {
          handleClose();
          toast.success('Gear created successfully!');
          dispatch(getGears());
        } else {
          toast.error('Failed to create gear.');
        }
      } catch (error) {
        toast.error('An error occurred while creating the gear.');
      } finally {
        setUploading(false);
      }
    }
    
  });

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPhotoFile(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFieldValue("photo", file);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFileNew(file);
      setFieldValue("photoFile", file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Gear</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              select
              label="Gear Type"
              name="typeId"
              value={values.typeId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.typeId && Boolean(errors.typeId)}
              helperText={touched.typeId && errors.typeId}
              fullWidth
            >
              {gears.map((gear) => (
                <MenuItem key={gear.id} value={gear.id}>
                  {gear?.type?.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sport"
              name="sportId"
              value={values.sportId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.sportId && Boolean(errors.sportId)}
              helperText={touched.sportId && errors.sportId}
              fullWidth
            >
              {gears.map((gear) => (
                <MenuItem key={gear.id} value={gear.id}>
                  {gear?.sport?.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Brand"
              name="brand"
              value={values.brand}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.brand && Boolean(errors.brand)}
              helperText={touched.brand && errors.brand}
              fullWidth
            />

            <TextField
              label="Model"
              name="model"
              value={values.model}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.model && Boolean(errors.model)}
              helperText={touched.model && errors.model}
              fullWidth
            />

            <TextField
              label="Weight (g)"
              name="weight"
              value={values.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.weight && Boolean(errors.weight)}
              helperText={touched.weight && errors.weight}
              fullWidth
            />

            <Box>
              <input
                accept="image/*"
                id="icon-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="icon-upload">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </label>

              {touched.photoFile && errors.photoFile && (
                <Box color="error.main" mt={1} fontSize={12}>
                  {errors.photoFile}
                </Box>
              )}

              {values.photoFile && (
                <Box mt={1}>
                  <img
                    // src={values.photo}
                    src={URL.createObjectURL(values.photoFile)}
                    alt="Photo preview"
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={uploading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
