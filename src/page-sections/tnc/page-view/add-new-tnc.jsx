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

export default function AddNewTncPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store actual file

  //store
  const dispatch = useDispatch();
  const { allTnc } = useSelector((state) => state.tnc);
  console.log("allTnc", allTnc)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    setSelectedFile(file); 
    setSelectedImage(URL.createObjectURL(file));
    toast.success("Image uploaded successfully!");
  };

  const initialValues = {
    content: "",
  };

  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
  });

  const { values, errors, handleChange, handleSubmit, touched, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: handleFormSubmit,
    });

  const navigate = useNavigate();

  // async function handleFormSubmit(values) {
  //   try {
  //     console.log("Values", values)
  //     const response = await dispatch(createTnc(values)).unwrap();
  //     console.log("res TNC", response);
  //     if (response?.status === 201) {
  //       toast.success("tnc created successfully!");
  //       navigate("/tnc-list-2");
  //     } else {
  //       console.log("response", response);
  //       toast.error(response?.message || "Failed to create Terms and Conditions");
  //     }
  //   } catch (error) {
  //     console.error("❌ Error:", error);
  //     toast.error(error?.message || "Something went wrong");
  //   }
  // }

  


  return (
    <div className="pt-2 pb-4">
             <FlexBox mb={2} alignItems="center">
              <IconWrapper>
                <GroupSenior sx={{ color: "primary.main" }} />
              </IconWrapper>
              <Paragraph fontSize={18} fontWeight="bold">
                Add New Terms and Conditions
              </Paragraph>
            </FlexBox>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
     
          </Grid>

          <Grid
            size={{
              xs: 12
            }}
            sx={{ margin: "auto" }}
          >
          
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid
                    size={{
                      xs: 12
                    }}
                  >
                    <TextField
                    multiline
                      fullWidth
                      name="content"
                      label="Terms and Conditions Content"
                      value={values.content}
                      onChange={handleChange}
                      helperText={touched.content && errors.content}
                      error={Boolean(touched.content && errors.content)}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FlexBox alignItems="center" gap={2}>
                      <Button type="submit" variant="contained">
                        Create Terms and Conditions
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
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
