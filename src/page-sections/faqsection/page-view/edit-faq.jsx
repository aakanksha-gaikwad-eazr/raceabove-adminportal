import { Box, Button, Card, TextField, Typography } from "@mui/material";
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
import { getFaq, getSingleFaq, } from "@/store/apps/faq";

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

export default function EditFaqPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleFaq } = useSelector((state) => state.faq);
  console.log("singleFaq", singleFaq);

  const initialValues = {
    answer: "",
    question: "",
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("question is required"),
    answer: Yup.string().required("Answer is required"),
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
        const payload = { question: values.question, answer: values.answer };

        const res = await dispatch(updateFaq({ id: id, data: payload }));

        if (res?.payload?.status === 200) {
          toast.success("FAQ updated successfully");
          dispatch(getFaq());
          navigate("/faq-list-2");
        } else {
          toast.error("Update failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getSingleFaq(id));
    }
  }, [id]);

  useEffect(() => {
    if (singleFaq?.id === id) {
      setValues({
        ...initialValues,
        ...singleFaq,
      });
    }
  }, [singleFaq]);

  return (
    <Box className="pt-2 pb-4">
        <Typography variant="h6" fontWeight={600} mb={2}>
          Update Frequently Asked Questions
        </Typography>
      <Card sx={{ p: 3 }}>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Text Fields */}
            <Grid item xs={12} >
              <TextField
                label="Question"
                name="question"
                fullWidth
                value={values.question}
                onChange={handleChange}
                error={touched.question && Boolean(errors.question)}
                helperText={touched.question && errors.question}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                name="answer"
                label="Answer"
                value={values.answer}
                onChange={handleChange}
                helperText={touched.answer && errors.answer}
                error={Boolean(touched.answer && errors.answer)}
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
                  onClick={() => navigate("/faq-list-2")}
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
