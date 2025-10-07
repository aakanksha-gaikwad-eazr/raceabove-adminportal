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
import { getSingleAppPrivacyPolicies } from "@/store/apps/appprivacypolicy";
import { updateAppPrivacyPolicy } from "@/store/apps/appprivacypolicy";
import { getAppPrivacyPolicies } from "@/store/apps/appprivacypolicy";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Don't forget to import CSS

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
    borderRadius: "7px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus": {
      outline: "none",
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
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

// Styled Quill Editor Component
const StyledQuillWrapper = styled("div")(({ theme, error }) => ({
  "& .quill": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "7px",
    border: `1px solid ${error ? theme.palette.error.main : theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)"}`,
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus-within": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
  },
  "& .ql-toolbar": {
    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)"}`,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: "7px 7px 0 0",
  },
  "& .ql-container": {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "none",
    borderRadius: "0 0 7px 7px",
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: "200px",
    fontSize: "1rem",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    "&.ql-blank::before": {
      color: theme.palette.text.secondary,
      fontStyle: "normal",
    },
  },
  "& .ql-toolbar .ql-stroke": {
    stroke: theme.palette.text.primary,
  },
  "& .ql-toolbar .ql-fill": {
    fill: theme.palette.text.primary,
  },
  "& .ql-toolbar .ql-picker-label": {
    color: theme.palette.text.primary,
  },
  "& .ql-toolbar button:hover": {
    color: theme.palette.primary.main,
  },
  "& .ql-toolbar button.ql-active": {
    color: theme.palette.primary.main,
  },
}));

// Error text component for Quill
const QuillErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.75rem",
  fontFamily: theme.typography.fontFamily,
  fontWeight: 400,
  lineHeight: 1.66,
  margin: "3px 14px 0",
}));

// Quill Label Component
const QuillLabel = styled(Typography)(({ theme, error, focused }) => ({
  position: "absolute",
  left: 14,
  top: -9,
  padding: "0 4px",
  backgroundColor: theme.palette.background.paper,
  color: error ? theme.palette.error.main : focused ? theme.palette.primary.main : theme.palette.text.secondary,
  fontSize: "0.75rem",
  fontFamily: theme.typography.fontFamily,
  fontWeight: 400,
  lineHeight: 1,
  zIndex: 1,
}));

export default function EditAppPrivacyPolicyPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quillFocused, setQuillFocused] = useState(false);
  
  const { singleAppPrivacypolicies } = useSelector((state) => state.appprivacypolicy);
  console.log("singleAppPrivacypolicies", singleAppPrivacypolicies);

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
        const payload = { content: values.content };

        const res = await dispatch(
          updateAppPrivacyPolicy({ id: id, data: payload })
        );
        console.log("res", res);

        if (res?.payload?.status === 200) {
          toast.success("Privacy Policy updated successfully");
          dispatch(getAppPrivacyPolicies());
          navigate("/appprivacy-policy-details/019951d9-1e6d-f341-898a-0bd36980c6bd");
        } else {
          toast.error("App Privacy Policy Update failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    },
  });

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'align', 'color', 'background'
  ];

  // Handle Quill content change
  const handleQuillChange = (content) => {
    setFieldValue('content', content);
  };

  useEffect(() => {
    if (id) {
      dispatch(getSingleAppPrivacyPolicies(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (singleAppPrivacypolicies?.id === id) {
      setValues({
        ...initialValues,
        ...singleAppPrivacypolicies,
      });
    }
  }, [singleAppPrivacypolicies, id, setValues]);

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Privacy Policy
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Quill Editor */}
            <Grid item xs={12} sm={12}>
              <Box sx={{ position: 'relative' }}>
                <QuillLabel 
                  error={touched.content && Boolean(errors.content)}
                  focused={quillFocused || Boolean(values.content)}
                >
                  Privacy Policy Content *
                </QuillLabel>
                <StyledQuillWrapper error={touched.content && Boolean(errors.content)}>
                  <ReactQuill
                    theme="snow"
                    value={values.content || ''}
                    onChange={handleQuillChange}
                    onFocus={() => setQuillFocused(true)}
                    onBlur={() => setQuillFocused(false)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter your privacy policy content..."
                  />
                </StyledQuillWrapper>
                {touched.content && errors.content && (
                  <QuillErrorText>
                    {errors.content}
                  </QuillErrorText>
                )}
              </Box>
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
                  onClick={() => navigate("/appprivacy-policy-details/019951d9-1e6d-f341-898a-0bd36980c6bd")}
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