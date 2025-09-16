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
import { getSingleTnc } from "@/store/apps/tnc";
// import { getSingleTnc, getTnc, updateTnc } from "@/store/apps/tnc";


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
// Custom Input Component
const CustomDateInput = React.forwardRef(
  (
    { value, onClick, placeholder, label, error, helperText, onFocus, onBlur },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const hasValue = Boolean(value);

    const handleFocus = (e) => {
      setFocused(true);
      onFocus && onFocus(e);
    };

    const handleBlur = (e) => {
      setFocused(false);
      onBlur && onBlur(e);
    };

    const displayValue = value || "";
    const showPlaceholder = !value;
    return (
      <div style={{ position: "relative" }}>
        {label && (
          <label
            className={`date-picker-label ${focused || value ? "focused" : ""}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          value={value}
          onClick={onClick}
          placeholder={showPlaceholder ? placeholder : ""}
          readOnly
          className="date-picker-input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {error && helperText && (
          <div className="date-picker-helper-text">{helperText}</div>
        )}
      </div>
    );
  }
);

export default function AppEditTnc() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleTnc } = useSelector((state) => state.tnc);
  console.log("singleTnc",singleTnc)
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

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
          // updateTnc({ id: id, data: payload })
        );

        if (res?.payload?.status === 200) {
          toast.success("Terms and conditions updated successfully");
          dispatch(getTnc());
          navigate("/tnc-list-2");
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
      dispatch(getSingleTnc(id));
    }
  }, [id]);

  useEffect(() => {
    if (singleTnc?.id === id) {
      setValues({
        ...initialValues,
        ...singleTnc,
      });
    }
  }, [singleTnc]);

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Terms and Conditions
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Text Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
              multiline
                label="Terms and Conditions Content"
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
                  onClick={() => navigate("/tnc-list-2")}
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
