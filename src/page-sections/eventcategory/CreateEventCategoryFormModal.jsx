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
} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { createGearTypes, getGearTypes } from "../../store/apps/geartypes";
import toast from "react-hot-toast";

export default function CreateEventCategoryFormModal({ open, handleClose }) {
  const [uploading, setUploading] = useState(false);
  const [iconnewFile, setIconnewFile] = useState(null);

  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    iconFile: null, 
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Gear Type name is required"),
    iconFile: Yup.mixed().required("Icon is required"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
    
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'iconFile' && value instanceof File) {
          formData.append('iconFile', value);
        } else {
          formData.append(key, value);
        }
      });
      console.log("formData", formData)

      try {
        setUploading(true);
        const response = await dispatch(createGearTypes( formData ) );
        console.log("geartypes", response)

        if (response?.payload?.status === 200 || response?.meta?.requestStatus === 'fulfilled') {
          toast.success("Gear type created successfully!");
          dispatch(getGearTypes());
          handleClose();
        } else {
          toast.error("Failed to create gear type.");
        }
      } catch (error) {
        toast.error("An error occurred while creating the gear type.");
      } finally {
        setUploading(false);
      }
    },
  });



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconnewFile(file);
      setFieldValue("iconFile", file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Gear Type</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Gear Type Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              fullWidth
            />

            <Box>
              <input
                accept=".svg"
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
                  {uploading ? "Uploading..." : "Upload SVG Icon"}
                </Button>
              </label>

              {touched.iconFile && errors.iconFile && (
                <Box color="error.main" mt={1} fontSize={12}>
                  {errors.iconFile}
                </Box>
              )}

              {values.iconFile && (
                <Box mt={1}>
                  <img
                    // src={values.iconFile}
                    src={URL.createObjectURL(values.iconFile)}
                    alt="Icon preview"
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
