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
  } from "@mui/material";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  
  export default function EditGearsFormModal({ open, handleClose }) {
    const formik = useFormik({
      initialValues: {
        sportName: "",
        description: "",
      },
      validationSchema: Yup.object({
        sportName: Yup.string().required("Sport name is required"),
        description: Yup.string().required("Description is required"),
      }),
      onSubmit: (values) => {
        console.log("Creating sport:", values);
        // submit your API call here
        handleClose(); // close modal on success
      },
    });
  
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Sport</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Sport Name"
                name="sportName"
                value={formik.values.sportName}
                onChange={formik.handleChange}
                error={formik.touched.sportName && Boolean(formik.errors.sportName)}
                helperText={formik.touched.sportName && formik.errors.sportName}
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
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
  