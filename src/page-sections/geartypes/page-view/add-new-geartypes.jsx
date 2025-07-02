import { Box, Button, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import { FlexBox } from "@/components/flexbox";

import { Paragraph, Small } from "@/components/typography"; // CUSTOM UTILS METHOD
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import Card from "@mui/material/Card";

import {
  createGearTypes,
  getGearTypes,
} from "@/store/apps/geartypes";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateGearTypesFormModal({ handleClose }) {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (formValues) => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("iconFile", formValues.iconFile);

        const response = await dispatch(
          createGearTypes(formData)
        ).unwrap();

        if (response?.status === 200 || response?.status === 201) {
          toast.success("Gear type created successfully!");
          dispatch(getGearTypes());
          navigate("/geartypes-grid-2");
        } else {
          toast.error(
            response?.message || "Failed to create gear type."
          );
        }
      } catch (error) {
        toast.error(
          error?.message ||
            "An error occurred while creating the gear type."
        );
      } finally {
        setUploading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("iconFile", file);
    }
  };

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ p: 3, width: "60%" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <FlexBox alignItems="center">
                <IconWrapper>
                  <GroupSenior sx={{ color: "primary.main" }} />
                </IconWrapper>
                <Paragraph fontSize={18} fontWeight="bold">
                  Add New Gear Types
                </Paragraph>
              </FlexBox>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Stack spacing={2} mb={2}>
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
                          {uploading
                            ? "Uploading..."
                            : "Upload SVG Icon"}
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
                </Grid>

                <Grid item xs={8}>
                  <FlexBox justifyContent="space-around">
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={uploading}
                    >
                      Create
                    </Button>
                  </FlexBox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Card>
    </div>
  );
}
