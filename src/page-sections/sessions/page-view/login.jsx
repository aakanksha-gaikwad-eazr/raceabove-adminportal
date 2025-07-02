import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik"; // MUI

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT

import useAuth from "@/hooks/useAuth"; // CUSTOM LAYOUT COMPONENT

import Layout from "../Layout"; // CUSTOM COMPONENTS

import Link from "@/components/link";
import { H5, H6, Paragraph } from "@/components/typography";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // CUSTOM ICON COMPONENTS
import { useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import toast from "react-hot-toast";

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  padding: 12,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
}));
export default function LoginPageView() {
  const { sendOTP } = useAuth();

  const navigate = useNavigate();

  const initialValues = {
    phoneNumber: "",
  };
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
  });

  const {
    errors,
    values,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form Submitted With:", values); 
      try {
        await sendOTP(navigate, values.phoneNumber);
        toast.success("OTP Sent succesfully")
      } catch (error) {
        toast.error("error in otp sending")
      }
    },
  });

  return (
    <Layout login>
      <Box maxWidth={550} p={4}>
        <H5
          fontSize={{
            sm: 30,
            xs: 25,
          }}
          py={2}
        >
          Sign In
        </H5>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <H6 fontSize={16} mb={1.5}>
                Login with your Phone number
              </H6>

              <TextField
                fullWidth
                placeholder="Enter your phone number"
                name="phoneNumber"
                onBlur={handleBlur}
                value={values.phoneNumber}
                onChange={handleChange}
                helperText={touched.phoneNumber && errors.phoneNumber}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              />
            </Grid>
            <Grid size={12}>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
                fullWidth
              >
                Send Otp
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}
