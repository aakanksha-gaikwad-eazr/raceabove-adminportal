import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT
import { FlexBox } from "@/components/flexbox";
import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS
import Select from "@mui/material/Select";

import { Paragraph, Small } from "@/components/typography"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Checkbox, ListItemText, Menu, MenuItem } from "@mui/material";
import { createCoupon } from "../../../store/apps/coupons";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

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

       const displayValue = value || '';
    const showPlaceholder = !value;
    return (
      <div style={{ position: "relative" }}>
        {label && (
          <label className={`date-picker-label ${focused || value ? 'focused' : ''}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          value={value}
          onClick={onClick}
          placeholder={showPlaceholder ? placeholder : ''}
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

const SwitchWrapper = styled("div")({
  width: "100%",
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
const StyledCard = styled(Card)({
  padding: 24,
  minHeight: 400,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});
const ButtonWrapper = styled("div")(({ theme }) => ({
  width: 100,
  height: 100,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
}));
const UploadButton = styled("div")(({ theme }) => ({
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[isDark(theme) ? 600 : 200],
  border: `1px solid ${theme.palette.background.paper}`,
}));

export default function AddNewCouponsPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store actual file

  //store
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  // console.log("users", users)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    setSelectedFile(file); // Store actual file
    setSelectedImage(URL.createObjectURL(file));
    // const imageUrl = URL.createObjectURL(file);
    // setSelectedImage(imageUrl);
    toast.success("Image uploaded successfully!");
  };

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
    isActive: true,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    code: Yup.string().required("Code is required"),
    discountType: Yup.string()
      .required("Discount type is required")
      .matches(/^[a-z\s]+$/, "Discount type must be in lowercase letters only")
      .oneOf(
        ["percentage", "flat"],
        "Discount type must be either 'percentage' or 'flat'"
      ),
    discountValue: Yup.number().required("Discount value is required"),
    startTimeStamp: Yup.string().required("Start Time stamp is required"),
    endTimeStamp: Yup.string().required("End time stamp is required"),
    usageLimit: Yup.number().required("Usage limit is required"),
    usageLimitPerUser: Yup.number().required("Usage/user is required"),
    // applicableCategories: Yup.array()
    //   .of(Yup.string())
    //   .required("Applicable categories are required"),
    minimumPurchase: Yup.string().required("Minimum Purchase is required"),
    maxDiscountValue: Yup.string().required("maxDiscountValue is required"),
    description: Yup.string().required("Description is required"),
  });

  const { values, errors, handleChange, handleSubmit, touched, setFieldValue } =
    useFormik({
      initialValues,
      // validationSchema,
      onSubmit: handleFormSubmit,
    });

  const navigate = useNavigate();

  async function handleFormSubmit(values) {
    try {
      const response = await dispatch(createCoupon(values)).unwrap();
      console.log("res coupone", response);
      if (response?.status === 201) {
        toast.success("Coupon created successfully!");
        navigate("/coupons-list-2");
      } else {
        console.log("response", response);
        toast.error(response?.message || "Failed to create coupon");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  }

  const categoryOptions = [
    { value: "events", label: "Events" },
    { value: "challenges", label: "Challenges" },
  ];
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FlexBox alignItems="center">
              <IconWrapper>
                <GroupSenior sx={{ color: "primary.main" }} />
              </IconWrapper>
              <Paragraph fontSize={18} fontWeight="bold">
                Add New Coupon
              </Paragraph>
            </FlexBox>
          </Grid>

          <Grid
            size={{
              md: 8,
              xs: 12,
            }}
            sx={{ margin: "auto" }}
          >
            <Card className="p-3">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="title"
                      label="Coupon Title"
                      value={values.title}
                      onChange={handleChange}
                      helperText={touched.title && errors.title}
                      error={Boolean(touched.title && errors.title)}
                    />
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="code"
                      label="Coupon Code"
                      value={values.code}
                      onChange={handleChange}
                      helperText={touched.code && errors.code}
                      error={Boolean(touched.code && errors.code)}
                    />
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="description"
                      label="Coupon description"
                      value={values.description}
                      onChange={handleChange}
                      helperText={touched.description && errors.description}
                      error={Boolean(touched.description && errors.description)}
                    />
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="discountValue"
                      label="Discount Value"
                      type="number"
                      value={values.discountValue}
                      onChange={handleChange}
                      helperText={touched.discountValue && errors.discountValue}
                      error={Boolean(
                        touched.discountValue && errors.discountValue
                      )}
                    />
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      select
                      name="discountType"
                      label="Discount Type"
                      value={values.discountType}
                      onChange={handleChange}
                      error={Boolean(
                        touched.discountType && errors.discountType
                      )}
                      helperText={touched.discountType && errors.discountType}
                    >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="flat">Flat</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="usageLimit"
                      label="Usage Limit"
                      value={values.usageLimit}
                      onChange={handleChange}
                      helperText={touched.usageLimit && errors.usageLimit}
                      error={Boolean(touched.usageLimit && errors.usageLimit)}
                      type="number"
                    />
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="usageLimitPerUser"
                      label="Usage Limit Per User"
                      value={values.usageLimitPerUser}
                      type="number"
                      onChange={handleChange}
                      helperText={
                        touched.usageLimitPerUser && errors.usageLimitPerUser
                      }
                      error={Boolean(
                        touched.usageLimitPerUser && errors.usageLimitPerUser
                      )}
                    />
                  </Grid>

                  {/* <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={(e) => setCategoryMenuAnchor(e.currentTarget)}
                    >
                      {values.applicableCategories.length > 0
                        ? `Selected (${values.applicableCategories.length})`
                        : "Select Categories"}
                    </Button>

                    <Menu
                      anchorEl={categoryMenuAnchor}
                      open={Boolean(categoryMenuAnchor)}
                      onClose={() => setCategoryMenuAnchor(null)}
                      PaperProps={{
                        style: { maxHeight: 300, width: 250 },
                      }}
                    >
                      {categoryOptions.map((cat) => (
                        <MenuItem
                          key={cat.value}
                          onClick={() => {
                            const selected =
                              values.applicableCategories.includes(cat.value)
                                ? values.applicableCategories.filter(
                                    (v) => v !== cat.value
                                  )
                                : [...values.applicableCategories, cat.value];

                            setFieldValue("applicableCategories", selected);
                          }}
                        >
                          <Checkbox
                            checked={values.applicableCategories.includes(
                              cat.value
                            )}
                          />
                          <ListItemText primary={cat.label} />
                        </MenuItem>
                      ))}
                    </Menu>

                    {touched.applicableCategories &&
                      errors.applicableCategories && (
                        <Small color="error.main" mt={1} display="block">
                          {errors.applicableCategories}
                        </Small>
                      )}
                  </Grid> */}

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="maxDiscountValue"
                      label="Max Discount Value"
                      value={values.maxDiscountValue}
                      onChange={handleChange}
                      helperText={
                        touched.maxDiscountValue && errors.maxDiscountValue
                      }
                      error={Boolean(
                        touched.maxDiscountValue && errors.maxDiscountValue
                      )}
                      type="number"
                    />
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    {/* <TextField
                      fullWidth
                      name="startTimeStamp"
                      label="Start Time Stamp"
                      value={values.startTimeStamp ? values.startTimeStamp.slice(0, 10) : ""}
                      onChange={e => {
                        const isoString = e.target.value ? new Date(e.target.value).toISOString() : "";
                        setFieldValue("startTimeStamp", isoString);
                      }}
                      helperText={touched.startTimeStamp && errors.startTimeStamp}
                      error={Boolean(touched.startTimeStamp && errors.startTimeStamp)}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> */}

                    <StyledDatePickerWrapper
                      error={Boolean(
                        touched.startTimeStamp && errors.startTimeStamp
                      )}
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

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    {/* <TextField
                      fullWidth
                      name="endTimeStamp"
                      label="End Time Stamp"
                      value={
                        values.endTimeStamp
                          ? values.endTimeStamp.slice(0, 10)
                          : ""
                      }
                      onChange={(e) => {
                        const isoString = e.target.value
                          ? new Date(e.target.value).toISOString()
                          : "";
                        setFieldValue("endTimeStamp", isoString);
                      }}
                      helperText={touched.endTimeStamp && errors.endTimeStamp}
                      error={Boolean(
                        touched.endTimeStamp && errors.endTimeStamp
                      )}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> */}
                    <StyledDatePickerWrapper
                      error={Boolean(
                        touched.endTimeStamp && errors.endTimeStamp
                      )}
                    >
                      <DatePicker
                        selected={
                          values.endTimeStamp
                            ? new Date(values.endTimeStamp)
                            : null
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
                            helperText={
                              touched.endTimeStamp && errors.endTimeStamp
                            }
                            placeholder="Select end time"
                          />
                        }
                      />
                    </StyledDatePickerWrapper>
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="minimumPurchase"
                      label="Minimum Purchase"
                      value={values.minimumPurchase}
                      onChange={handleChange}
                      type="number"
                      helperText={
                        touched.minimumPurchase && errors.minimumPurchase
                      }
                      error={Boolean(
                        touched.minimumPurchase && errors.minimumPurchase
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FlexBox alignItems="center" gap={2}>
                      <Button type="submit" variant="contained">
                        Create Coupon
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
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
