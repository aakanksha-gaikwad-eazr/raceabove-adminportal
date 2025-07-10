import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FlexBox } from "@/components/flexbox";
import "react-datepicker/dist/react-datepicker.css";
import styled from "@mui/material/styles/styled";
// import { getSingleTnc, getTnc, updateTnc } from "@/store/apps/tnc";
// import { getSinglePrivacyPolicies, updatePrivacyPolicies } from "@/store/apps/privacypolicy";


const categoryOptions = [
  { value: "events", label: "Events" },
  { value: "challenges", label: "Challenges" },
];
// Add this styled component at the top of your file with other styled components
const StyledDatePickerWrapper = styled("div")(({ theme, error }) => ({
  "& .react-datepicker-wrapper": {
    width: "100%",
  },
  "& .react-datepicker__input-container": {
    width: "100%",
  },
  "& .date-picker-input": {
    width: "100%",
    padding: "10px 14px",
    fontSize: "1rem",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 400,
    lineHeight: "1.4375em",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${error ? theme.palette.error.main : theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)"}`,
    // borderRadius: theme.shape.borderRadius,
    borderRadius: "7px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus": {
      outline: "none",
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
      // padding: "15.5px 13px",
    },
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
  "& .date-picker-label": {
    position: "absolute",
    left: 14,
    top: -9,
    padding: "0 4px",
    backgroundColor: theme.palette.background.paper,
    color: error ? theme.palette.error.main : theme.palette.text.secondary,
    fontSize: "0.75rem",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 400,
    lineHeight: 1,
    zIndex: 1,
  },
  "& .date-picker-label.focused": {
    color: error ? theme.palette.error.main : theme.palette.primary.main,
  },
  "& .date-picker-helper-text": {
    color: theme.palette.error.main,
    margin: "3px 14px 0",
    fontSize: "0.75rem",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 400,
    lineHeight: 1.66,
  },
}));

export default function EditPrivacyPolicyPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singlePrivacypolicy } = useSelector((state) => state.privacypolicy);
  console.log("singlePrivacypolicy",singlePrivacypolicy)

  const initialValues = {
    content: "",
  };

  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {content: values.content}

        const res = await dispatch(
          // updatePrivacyPolicies({ id: id, data: payload })
        );

        if (res?.payload?.status === 200) {
          toast.success("Privacy Policy updated successfully");
          dispatch(getTnc());
          navigate("/privacy-policy-list-2");
        } else {
          toast.error("Privacy Policy Update failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getSinglePrivacyPolicies(id));
    }
  }, [id]);

  useEffect(() => {
    if (singlePrivacypolicy?.id === id) {
      setValues({
        ...initialValues,
        ...singlePrivacypolicy,
      });
    }
  }, [singlePrivacypolicy]);

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Privacy Policy
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Text Fields */}
            <Grid item xs={12}>
              <TextField
              multiline
                label="Privacy Policy Content"
                name="content"
                fullWidth
                value={values.content}
                onChange={handleChange}
                error={touched.content && Boolean(errors.content)}
                helperText={touched.content && errors.content}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/privacy-policy-list-2")}
                >
                  Cancel
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
