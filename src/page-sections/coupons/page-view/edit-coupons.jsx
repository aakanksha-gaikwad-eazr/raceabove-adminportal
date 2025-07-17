import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCouponsById,
  
  getCoupons,
} from "@/store/apps/coupons";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FlexBox } from "@/components/flexbox";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT


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

export default function EditCouponsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleCoupons } = useSelector((state) => state.coupons);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

  const initialValues = {
    title: "",
    code: "",
    description: "",
    discountType: "",
    discountValue: "",
    maxDiscountValue: "",
    minimumPurchase: "",
    // applicableCategories: [],
    startTimeStamp: "",
    endTimeStamp: "",
    usageLimit: "",
    usageLimitPerUser: "",
    usageCount: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    code: Yup.string().required("Code is required"),
    description: Yup.string().required("Description is required"),
    discountType: Yup.string().required("Discount type is required"),
    discountValue: Yup.number().required("Discount value is required"),
    maxDiscountValue: Yup.number().required("Max discount value is required"),
    minimumPurchase: Yup.number().required("Minimum purchase is required"),
    startTimeStamp: Yup.string().required("Start Time Stamp is required"),
    endTimeStamp: Yup.string().required("End Time Stamp is required"),
    usageLimit: Yup.number().required("Usage limit is required"),
    usageLimitPerUser: Yup.number().required("Usage/user is required"),
    usageCount: Yup.number().required("Usage count is required"),
    // applicableCategories: Yup.array().of(Yup.string()),
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
        const payload = {
          ...values,
          discountValue: Number(values.discountValue),
          maxDiscountValue: Number(values.maxDiscountValue),
          minimumPurchase: Number(values.minimumPurchase),
          usageLimit: Number(values.usageLimit),
          usageLimitPerUser: Number(values.usageLimitPerUser),
          usageCount: Number(values.usageCount),
        };

        const res = await dispatch(
        );

        if (res?.payload?.status === 200) {
          toast.success("Coupon updated successfully");
          dispatch(getCoupons());
          navigate("/coupons-list-2");
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
      dispatch(getCouponsById(id));
    }
  }, [id]);

  useEffect(() => {
    if (singleCoupons?.id === id) {
      setValues({
        ...initialValues,
        ...singleCoupons,
        discountValue: singleCoupons.discountValue ?? "",
        maxDiscountValue: singleCoupons.maxDiscountValue ?? "",
        minimumPurchase: singleCoupons.minimumPurchase ?? "",
        usageLimit: singleCoupons.usageLimit ?? "",
        usageLimitPerUser: singleCoupons.usageLimitPerUser ?? "",
        usageCount: singleCoupons.usageCount ?? "",
        applicableCategories: singleCoupons.applicableCategories || [],
      });
    }
  }, [singleCoupons]);

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Coupon
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Text Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Coupon Code"
                name="code"
                fullWidth
                value={values.code}
                onChange={handleChange}
                error={touched.code && Boolean(errors.code)}
                helperText={touched.code && errors.code}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Discount Type"
                name="discountType"
                fullWidth
                value={values.discountType}
                onChange={handleChange}
                error={touched.discountType && Boolean(errors.discountType)}
                helperText={touched.discountType && errors.discountType}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="flat">Flat</MenuItem>
              </TextField>
            </Grid>

            {[
              { name: "discountValue", label: "Discount Value" },
              {
                name: "maxDiscountValue",
                label: "Max Discount Value",
              },
              { name: "minimumPurchase", label: "Minimum Purchase" },
              { name: "usageLimit", label: "Usage Limit" },
              {
                name: "usageLimitPerUser",
                label: "Usage Limit Per User",
              },
              { name: "usageCount", label: "Usage Count" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  fullWidth
                  type="number"
                  value={values[field.name]}
                  onChange={handleChange}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  helperText={touched[field.name] && errors[field.name]}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              {/* <TextField
                type="date"
                label="Start Time Stamp"
                name="startTimeStamp"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={values.startTimeStamp}
                onChange={handleChange}
                error={touched.startTimeStamp && Boolean(errors.startTimeStamp)}
                helperText={touched.startTimeStamp && errors.startTimeStamp}
              /> */}
              <StyledDatePickerWrapper
                error={Boolean(touched.startTimeStamp && errors.startTimeStamp)}
              >
                <DatePicker
                  selected={
                    values.startTimeStamp
                      ? new Date(values.startTimeStamp)
                      : null
                  }
                  onChange={(date) => {
                    const isoString = date ? date.toISOString() : "";
                    setFieldValue("startTimeStamp", isoString);
                  }}
                  showTimeSelect
                  excludeTimes={[
                    setHours(setMinutes(new Date(), 0), 17),
                    setHours(setMinutes(new Date(), 30), 18),
                    setHours(setMinutes(new Date(), 30), 19),
                    setHours(setMinutes(new Date(), 30), 17),
                  ]}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={
                    <CustomDateInput
                      label="Start Time Stamp"
                      error={Boolean(
                        touched.startTimeStamp && errors.startTimeStamp
                      )}
                      helperText={
                        touched.startTimeStamp && errors.startTimeStamp
                      }
                      placeholder="Select start time"
                    />
                  }
                />
              </StyledDatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* <TextField
                type="date"
                label="End Time Stamp"
                name="endTimeStamp"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={values.endTimeStamp}
                onChange={handleChange}
                error={touched.endTimeStamp && Boolean(errors.endTimeStamp)}
                helperText={touched.endTimeStamp && errors.endTimeStamp}
              /> */}
              <StyledDatePickerWrapper
                error={Boolean(touched.endTimeStamp && errors.endTimeStamp)}
              >
                <DatePicker
                  selected={
                    values.endTimeStamp ? new Date(values.endTimeStamp) : null
                  }
                  onChange={(date) => {
                    const isoString = date ? date.toISOString() : "";
                    setFieldValue("endTimeStamp", isoString);
                  }}
                  showTimeSelect
                  excludeTimes={[
                    setHours(setMinutes(new Date(), 0), 17),
                    setHours(setMinutes(new Date(), 30), 18),
                    setHours(setMinutes(new Date(), 30), 19),
                    setHours(setMinutes(new Date(), 30), 17),
                  ]}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={
                    <CustomDateInput
                      label="End Time Stamp"
                      error={Boolean(
                        touched.endTimeStamp && errors.endTimeStamp
                      )}
                      helperText={touched.endTimeStamp && errors.endTimeStamp}
                      placeholder="Select end time"
                    />
                  }
                />
              </StyledDatePickerWrapper>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={(e) => setCategoryAnchorEl(e.currentTarget)}
              >
                {values.applicableCategories.length > 0
                  ? `Selected (${values.applicableCategories.length})`
                  : "Select Categories"}
              </Button>

              <Menu
                anchorEl={categoryAnchorEl}
                open={Boolean(categoryAnchorEl)}
                onClose={() => setCategoryAnchorEl(null)}
                PaperProps={{ style: { maxHeight: 300, width: 250 } }}
              >
                {categoryOptions.map((cat) => (
                  <MenuItem
                    key={cat.value}
                    onClick={() => {
                      const selected = values.applicableCategories.includes(
                        cat.value
                      )
                        ? values.applicableCategories.filter(
                            (v) => v !== cat.value
                          )
                        : [...values.applicableCategories, cat.value];

                      setFieldValue("applicableCategories", selected);
                    }}
                  >
                    <Checkbox
                      checked={values.applicableCategories.includes(cat.value)}
                    />
                    <ListItemText primary={cat.label} />
                  </MenuItem>
                ))}
              </Menu>

              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {values.applicableCategories.map((cat) => (
                  <Chip key={cat} label={cat} />
                ))}
              </Box>

              {touched.applicableCategories && errors.applicableCategories && (
                <Typography color="error" variant="body2" mt={1}>
                  {errors.applicableCategories}
                </Typography>
              )}
            </Grid> */}

            {/* Submit */}
            <Grid item xs={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/coupons-list-2")}
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
