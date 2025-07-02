import { useState } from "react";
import OtpInput from "react-otp-input"; // MUI
import { useFormik } from "formik"; // MUI

import Button from "@mui/material/Button";
import Container from "@mui/material/Container"; // MUI ICON COMPONENT

import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded"; // CUSTOM COMPONENTS

import { Paragraph, Span } from "@/components/typography";
import GradientBackground from "@/components/gradient-background"; // STYLED COMPONENTS
import useAuth from "@/hooks/useAuth"; // CUSTOM LAYOUT COMPONENT

import { MainContent, OtpInputField } from "./styles";
import { useNavigate } from "react-router-dom";
export default function VerifyCodePageView() {
  const setphoneNumber = localStorage.getItem("phoneNumber");
  const setRole = localStorage.getItem("role");

  const [otp, setOtp] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const initialValues = {
    phoneNumber: setphoneNumber,
    otp: otp,
    role:setRole
  };

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

    onSubmit: async (values) => {
      try {
        await login(navigate, setphoneNumber, otp, setRole);
      } catch (error) {
        console.log(error);
      }
    },
  });

  console.log("phone", setphoneNumber);
  console.log("role", setRole);
  console.log("otp", otp);

  return (
    <GradientBackground>
      <Container>
        <MainContent>
          <div className="img-wrapper">
            <img src="/static/pages/email.svg" alt="email" width="100%" />
          </div>

          <h6 className="title">Check your Phone!</h6>

          <p className="description">
            Please check your phone for a 4-digit verification code we have sent
            to your registered phone number. Enter the code in the field below
            to confirm your phone number and complete the verification process.
          </p>

          <form className="form-wrapper" onSubmit={handleSubmit}>
            <OtpInput
              value={otp}
              numInputs={4}
              onChange={setOtp}
              placeholder="----"
              renderInput={(props) => <OtpInputField {...props} />}
              containerStyle={{
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "3rem",
              }}
            />

            <Button size="large" type="submit" fullWidth>
              Verify
            </Button>
          </form>

          {/* <Paragraph mt={4} mb={1} fontSize={16}>
            Don’t have a code?{' '}
            <Span className="resend" onClick={() => {}}>
              Resend code
            </Span>
          </Paragraph> */}

          {/* <Button variant="text" disableRipple startIcon={<ChevronLeftRounded />}>
            Return to sign in
          </Button> */}
        </MainContent>
      </Container>
    </GradientBackground>
  );
}
