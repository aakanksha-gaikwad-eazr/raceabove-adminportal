import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
} from "@mui/material";
import Grid from '@mui/material/Grid'
import styled from "@mui/material/styles/styled";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getSingleAdmin, updateAdmin } from "@/store/apps/admins";
import { Paragraph } from "@/components/typography";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { isDark } from "@/utils/constants";

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

export default function EditAdminPageView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { admins } = useSelector((state) => state.admins);

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyLogo: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Invalid Indian phone number format")
      .required("Phone number is required"),
    companyName: Yup.string().required("Company name is required"),
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    dispatch(getSingleAdmin(id)).then((res) => {
      const data = res?.payload;
      if (data) {
        setValues({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber?.replace("+91", "") || "",
          companyName: data.companyName || "",
          companyLogo: data.companyLogo || "",
        });
        setSelectedImage(data.companyLogo);
      } else {
        toast.error("Failed to fetch admin details");
      }
    });
  }, [id, dispatch]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  async function handleFormSubmit(values) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phoneNumber", `+91${values.phoneNumber}`);
    formData.append("companyName", values.companyName);

    if (selectedFile) {
      formData.append("companyLogoFile", selectedFile);
    }

    try {
      const response = await dispatch(
        updateAdmin({ editId: id, changedData: formData })
      ).unwrap();
      if (response?.status === 200) {
        toast.success("Admin updated successfully!");
        navigate("/admin-list-2");
      } else {
        toast.error(response?.message || "Failed to update admin");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    }
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconWrapper>
                  <GroupSenior sx={{ color: "primary.main" }} />
                </IconWrapper>
                <Paragraph fontSize={18} fontWeight="bold">
                  Edit Admin
                </Paragraph>
              </Box>
            </Grid>

            {/* Image Section */}
            <Grid  md={4} xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
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

                {selectedImage && (
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
                )}
              </Box>
            </Grid>

            {/* Form Fields */}
            <Grid item md={8} xs={12}>
              <Card className="p-3">
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Full Name"
                      value={values.name}
                      onChange={handleChange}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email Address"
                      value={values.email}
                      onChange={handleChange}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      label="Phone Number"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      error={Boolean(
                        touched.phoneNumber && errors.phoneNumber
                      )}
                      helperText={
                        touched.phoneNumber && errors.phoneNumber
                      }
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="companyName"
                      label="Company Name"
                      value={values.companyName}
                      onChange={handleChange}
                      error={Boolean(
                        touched.companyName && errors.companyName
                      )}
                      helperText={
                        touched.companyName && errors.companyName
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Update Admin
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
