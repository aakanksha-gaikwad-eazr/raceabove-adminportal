import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";

import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import { FlexBox } from "@/components/flexbox";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import * as Yup from "yup";
import { useFormik } from "formik";

import { Paragraph, Small } from "@/components/typography";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createUser } from "../../../store/apps/user";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@mui/material";
import { createOrganizer } from "../../../store/apps/organisers";

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

export default function AddNewOrganisersPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    if (file.size > 3.1 * 1024 * 1024) {
      toast.error("File size should be less than 3.1 MB");
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload JPEG, JPG, PNG, or GIF."
      );
      return;
    }

    setSelectedFile(file);
    // setSelectedImage(URL.createObjectURL(file));
    // toast.success("Image uploaded successfully!");

    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        setSelectedImage(reader.result);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to load the image.");
      }
    };

    reader.onerror = () => {
      toast.error("Error reading the file.");
    };

    reader.readAsDataURL(file);
  };

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyLogoFile: null,
    commission: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits long")
      .required("Phone Number is Required!"),
    companyName: Yup.string().required("Company Name is Required!"),
    commission: Yup.number().required("Commission is Required!"),
    // companyLogoFile: Yup.string().required("Company Logo is Required!"),
  });

  const { values, errors, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues,
      validationSchema,
      // validateOnChange: true,
      // validateOnBlur: true,
      onSubmit: handleFormSubmit,
    });

  async function handleFormSubmit(values) {
    console.log("clicked");
    if (!selectedFile) {
      toast.error("Company logofile is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phoneNumber", `+91${values.phoneNumber}`);
    formData.append("companyName", values.companyName);
    formData.append("commission", values.commission);
    formData.append("companyLogoFile", selectedFile);

    try {
      const response = await dispatch(
        createOrganizer(formData)
      ).unwrap();
      console.log("response>?????", response);

      if (response?.status === 201) {
        toast.success("Organizer created successfully!");
        navigate("/organiser-list");
      } else {
        console.log("23", response);
        throw new Error(
          response.message || "Failed to create organizer"
        );
      }
    } catch (error) {
      console.error(
        "❌ Error in form submission of organizer:",
        error
      );
      // toast.error(error?.message || "Failed to create organizer.");
    }
  }

  return (
    <div className="pt-2 pb-4">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FlexBox alignItems="center">
              <IconWrapper>
                <GroupSenior sx={{ color: "primary.main" }} />
              </IconWrapper>
              <Paragraph fontSize={18} fontWeight="bold">
                Add New Organisation
              </Paragraph>
            </FlexBox>
          </Grid>
          <Grid
            size={{
              md: 4,
              xs: 12,
            }}
          >
            <StyledCard>
              <ButtonWrapper>
                <UploadButton>
                  <label htmlFor="upload-btn">
                    <input
                      accept="image/*"
                      id="upload-btn"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <IconButton component="span">
                      <PhotoCamera
                        sx={{ fontSize: 26, color: "grey.400" }}
                      />
                    </IconButton>
                  </label>
                </UploadButton>
              </ButtonWrapper>

              {selectedImage ? (
                <Box
                  mt={2}
                  width={150}
                  height={150}
                  borderRadius="50%"
                  overflow="hidden"
                >
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ) : (
                <Paragraph mt={2} color="text.secondary">
                  No image uploaded
                </Paragraph>
              )}

              <Paragraph
                marginTop={2}
                maxWidth={200}
                display="block"
                textAlign="center"
                color="text.secondary"
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
              </Paragraph>
            </StyledCard>
          </Grid>

          <Grid
            size={{
              md: 8,
              xs: 12,
            }}
          >
            <Card className="p-3">
              <Grid container spacing={3}>
                <Grid
                  size={{
                    sm: 6,
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={handleChange}
                    helperText={touched.name && errors.name}
                    error={Boolean(touched.name && errors.name)}
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
                    name="companyName"
                    label="Company Name"
                    value={values.companyName}
                    onChange={handleChange}
                    helperText={
                      touched.companyName && errors.companyName
                    }
                    error={Boolean(
                      touched.companyName && errors.companyName
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
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
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
                    name="phoneNumber"
                    label="Phone Number"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    helperText={
                      touched.phoneNumber && errors.phoneNumber
                    }
                    error={Boolean(
                      touched.phoneNumber && errors.phoneNumber
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
                    name="commission"
                    label="Commission"
                    value={values.commission}
                    onChange={handleChange}
                    helperText={
                      touched.commission && errors.commission
                    }
                    error={Boolean(
                      touched.commission && errors.commission
                    )}
                    type="number"
                  />
                </Grid>

                <Grid size={12}>
                  <Button type="submit" variant="contained">
                    Create Organizer
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
