import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT

import { FlexBox } from "@/components/flexbox";

import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS

import { Paragraph, Small } from "@/components/typography"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { createAdmin } from "../../../store/apps/admins";
import { InputAdornment } from "@mui/material";

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

export default function AddNewAdminPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  //store
  const dispatch = useDispatch();
  const { admins } = useSelector((state) => state.admins);
  // console.log("admins", admins);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      toast.error(
        "Only image files (JPEG, PNG, GIF, WebP) are allowed!"
      );
      return;
    }
    setSelectedFile(file);

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
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    phoneNumber: Yup.string()
      .matches(
        /^\+91\d{10}$/,
        "Phone number must start with +91 and be 10 digits long"
      )
      .required("Phone Number is Required!"),
    companyName: Yup.string().required("Company Name is Required!"),
    companyLogoFile: Yup.string().required(
      "Company Logo is Required!"
    ),
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
  } = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: handleFormSubmit,
  });

  const navigate = useNavigate();

  async function handleFormSubmit(values) {
    if (!selectedFile) {
      toast.error("Company logofile is required!");
      return;
    }

    // const payload = {
    //   ...values,
    //    phoneNumber: `+91${values.phoneNumber}`,
    //   companyLogoFile: selectedFile,
    // };

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phoneNumber", `+91${values.phoneNumber}`);
    formData.append("companyName", values.companyName);
    formData.append("companyLogoFile", selectedFile);

    try {
      const response = await dispatch(createAdmin(formData)).unwrap();
      console.log("responseadmin>>", response);

      if (response?.status === 201) {
        toast.success("Admin created successfully!");
        navigate("/admin-list-2");
      } else {
        throw new Error("Failed to create admin");
      }
    } catch (error) {
      console.error("❌ Error in form submission:", error);
      toast.error(error?.message || "Failed to create admin");
    }
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FlexBox alignItems="center">
                <IconWrapper>
                  <GroupSenior sx={{ color: "primary.main" }} />
                </IconWrapper>
                <Paragraph fontSize={18} fontWeight="bold">
                  Add New Admin
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
                        style={{
                          display: "none",
                        }}
                        onChange={handleImageChange}
                      />
                      <IconButton component="span">
                        <PhotoCamera
                          sx={{
                            fontSize: 26,
                            color: "grey.400",
                          }}
                        />
                      </IconButton>
                    </label>
                  </UploadButton>
                </ButtonWrapper>

                {/* Show preview if an image is uploaded */}
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1
                  MB
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
                  {/* full name */}
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
                      onBlur={handleBlur}
                      helperText={touched.name && errors.name}
                      error={Boolean(touched.name && errors.name)}
                    />
                  </Grid>

                  {/* email */}

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
                      onBlur={handleBlur}
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                    />
                  </Grid>

                  {/* phone number */}
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
                      onBlur={handleBlur}
                      helperText={
                        touched.phoneNumber && errors.phoneNumber
                      }
                      error={Boolean(
                        touched.phoneNumber && errors.phoneNumber
                      )}
                    />
                  </Grid>

                  {/* company name */}
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
                      onBlur={handleBlur}
                      helperText={
                        touched.companyName && errors.companyName
                      }
                      error={Boolean(
                        touched.companyName && errors.companyName
                      )}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Button type="submit" variant="contained">
                      Create User
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Card>
    </div>
  );
}
