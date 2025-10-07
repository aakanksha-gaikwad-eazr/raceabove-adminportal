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
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { createAppPrivacyPolicy } from "@/store/apps/appprivacypolicy";

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

export default function AddNewAppPrivacyPolicyPageView() {

  //store
  const dispatch = useDispatch();

  const {privacypolicies} = useSelector((state) => state.privacypolicy);
  console.log("privacypolicies", privacypolicies);

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

  async function handleFormSubmit(values) {
    try {
      console.log("Values", values)
      const response = await dispatch(createAppPrivacyPolicy(values)).unwrap();
      console.log("res privacy policies", response);
      if (response?.status === 201) {
        toast.success("Privacy Policies created successfully!");
        navigate("/appprivacy-policy-list-2");
      } else {
        console.log("response", response);
        toast.error(response?.message || "Failed to create Privacy Policies");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  }

  


  return (
    <div className="pt-2 pb-4">
             <FlexBox mb={2} alignItems="center">
              <IconWrapper>
                <GroupSenior sx={{ color: "primary.main" }} />
              </IconWrapper>
              <Paragraph fontSize={18} fontWeight="bold">
                Add New App Privacy Policies
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
                    minRows={4}
                      fullWidth
                      name="content"
                      label="App Privacy Policies Content"
                      value={values.content}
                      onChange={handleChange}
                      helperText={touched.content && errors.content}
                      error={Boolean(touched.content && errors.content)}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FlexBox alignItems="center" gap={2}>
                      <Button type="submit" variant="contained">
                        Create App Privacy Policies
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/appprivacy-policy-list-2")}
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
