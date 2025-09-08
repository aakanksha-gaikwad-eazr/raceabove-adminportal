import { Box, Button, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import { FlexBox } from "@/components/flexbox";

import { Paragraph, Small } from "@/components/typography";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import Card from "@mui/material/Card";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createEventCategory, getEventCategory } from "@/store/apps/eventscategory";

export default function CreateEventCategoriesFormModal({ handleClose }) {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    isActive: true,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Event Category name is required"),
    description: Yup.string().required("Description is required"),
    isActive: Yup.boolean(),
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
                const payload = {
          name: formValues.name,
          description: formValues.description,
          isActive: formValues.isActive,
        };

        console.log("payload", payload);
        const response = await dispatch(
          createEventCategory(payload)
        ).unwrap();

        if (response?.status === 200 || response?.status === 201) {
          toast.success("Event Category created successfully!");
          dispatch(getEventCategory());
          navigate("/eventcategory-list-2");
        } else {
          toast.error(
            response?.message || "Failed to create Event Category."
          );
        }
      } catch (error) {
        toast.error(
          error?.message ||
            "An error occurred while creating the Event Category."
        );
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ p: 3, width:"60%" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <FlexBox alignItems="center">
                <IconWrapper>
                  <GroupSenior sx={{ color: "primary.main" }} />
                </IconWrapper>
                <Paragraph fontSize={18} fontWeight="bold">
                  Add New Event Category
                </Paragraph>
              </FlexBox>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Stack spacing={2} mb={2}>
                    <TextField
                      label="Event Category Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      fullWidth
                    />

                    <TextField
                      label="Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                      multiline
                      rows={3}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                <Grid item xs={4}>
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