import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createSports, getSports } from "../../../store/apps/sports"; // Update import path
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar"; // Add this import
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import { Paragraph } from "@/components/typography";

// MUI-styled wrapper for the switch label and control
const SwitchWrapper = styled(Box)({
  width: "100%",
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export default function AddNewSportsPageView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [iconFile, setIconFile] = useState(null); // Add this state

  const initialValues = {
    name: "",
    iconFile: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Sport name is required"),
    iconFile: Yup.mixed().required("Icon is required"),
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
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (iconFile) {
        formData.append("iconFile", iconFile);
      }

      try {
        const response = await dispatch(createSports(formData)).unwrap();
        
        if (response?.status === 201 || response?.success) {
          toast.success("Sport created successfully");
          // Refresh sports list
          dispatch(getSports());
          // Reset form
          resetForm();
          setIconFile(null);
          setPreviewUrl(null);
          // Navigate to sports list
          navigate("/sports-list-2");
        } else {
          toast.error(response?.message || "Failed to create sport");
        }
      } catch (error) {
        console.error("Error creating sport:", error);
        toast.error(error?.message || "Error occurred while creating sport");
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, or SVG)");
        return;
      }
      
      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size should not exceed 5MB");
        return;
      }

      setIconFile(file);
      setFieldValue("iconFile", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FlexBox alignItems="center" gap={2}>
              <IconWrapper>
                <GroupSenior
                  sx={{
                    color: "primary.main",
                  }}
                />
              </IconWrapper>

              <Paragraph fontSize={20} fontWeight="bold">
                Add New Sport
              </Paragraph>
            </FlexBox>
          </Grid>
          
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Sport Name"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {previewUrl && (
                      <Avatar
                        src={previewUrl}
                        sx={{ width: 64, height: 64, bgcolor: "grey.100" }}
                      />
                    )}
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
                          color={touched.iconFile && errors.iconFile ? "error" : "primary"}
                        >
                          {previewUrl ? "Change Icon" : "Upload Icon"}
                        </Button>
                      </label>
                      {touched.iconFile && errors.iconFile && (
                        <Typography 
                          variant="caption" 
                          color="error" 
                          display="block" 
                          mt={1}
                        >
                          {errors.iconFile}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!values.name || !iconFile}
                    >
                      Create Sport
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate("/sports-list-2")}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}