import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT

import PhotoCamera from "@mui/icons-material/PhotoCamera";

import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS

import { Paragraph, Small } from "@/components/typography"; // CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material";
import { getTargets } from "@/store/apps/target";
import { FlexBox } from "@/components/flexbox";
import { Wallet } from "@mui/icons-material";
import { updateOrganizer } from "@/store/apps/organisers";
import { getOrganizers } from "@/store/apps/organisers";
import { getSingleOrganizers } from "@/store/apps/organisers";

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

export default function EditOrganizerPageView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/static/avatar/001-man.svg"); // Default fallback image
  
  //store
  const dispatch = useDispatch();
  const { organisers } = useSelector((state) => state.organisers);
  const { singleOrganizer } = useSelector((state) => state.organisers);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getSingleOrganizers(id));
    }
  }, [id, dispatch]);

  // Update selectedImage when singleOrganizer data is loaded
  useEffect(() => {
    if (singleOrganizer?.profilePhoto) {
      setSelectedImage(singleOrganizer.profilePhoto);
    } else if (singleOrganizer?.companyLogo) {
      // In case the image field name is different
      setSelectedImage(singleOrganizer.companyLogo);
    } else {
      // Reset to default if no image
      setSelectedImage("/static/avatar/001-man.svg");
    }
  }, [singleOrganizer]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    // Validate file size (3.1 MB limit)
    const maxSize = 3.1 * 1024 * 1024; // 3.1 MB in bytes
    if (file.size > maxSize) {
      toast.error("File size exceeds 3.1 MB limit!");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, JPG, PNG, and GIF files are allowed!");
      return;
    }

    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    toast.success("Image uploaded successfully!");
  };

  const initialValues = {
    name: singleOrganizer?.name || "",
    email: singleOrganizer?.email || "",
    phoneNumber: singleOrganizer?.phoneNumber?.replace(/^\+91/, "") || "",
    companyName: singleOrganizer?.companyName || "",
    commission: singleOrganizer?.commission || "",
    companyLogoFile: null,
    isActive: singleOrganizer?.isActive ?? true,
    approvalStatus: singleOrganizer?.approvalStatus || "pending",
    reviewReason: singleOrganizer?.reviewReason || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Must be greater than 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone Number must be 10 digits")
      .required("Phone Number is required"),
    companyName: Yup.string().required("Company Name is Required!"),
    commission: Yup.number().required("Commission is Required!"),
  });

  const handleUpdateOrganizer = async (values, setSubmitting) => {
    console.log("clicked", values);
    console.log("Organizer ID:", id); // Debug the ID

    if (!id) {
      toast.error("Organizer ID is missing!");
      setSubmitting(false);
      return;
    }
    
    try {
      // If there's a new image file, you might want to handle it here
      let payload = {
        name: values.name,
        email: values.email,
        phoneNumber: `+91${values.phoneNumber}`, // backend expects full number
        companyName: values.companyName,
        commission: Number(values.commission),
        isActive: values.isActive ?? true, // bind this to your Switch
        approvalStatus: values.approvalStatus === true ? "approved" : "pending", // Convert boolean to string
        reviewReason: values.reviewReason || "N/A",
      };

      // If there's a new image file, handle it appropriately
      if (selectedFile) {
        // You might need to upload the image first or include it in FormData
        // This depends on your backend implementation
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
          formData.append(key, payload[key]);
        });
        formData.append('profilePhoto', selectedFile);
        // Use formData instead of payload if your backend expects FormData
      }

      const response = await dispatch(updateOrganizer({ id, data: payload }));

      if (response?.payload?.status === 200) {
        toast.success("Organizer updated successfully!");
        dispatch(getOrganizers());
        navigate("/organiser-list-2");
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update Organizer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleUpdateOrganizer(values, setSubmitting);
    },
  });

  // Debug: Log the current image URL
  console.log("Current selectedImage:", selectedImage);
  console.log("singleOrganizer profilePhoto:", singleOrganizer?.profilePhoto);

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
                Edit Organizer
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
              
              <Box
                mt={2}
                width={150}
                height={150}
                borderRadius="50%"
                overflow="hidden"
                sx={{
                  border: '2px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              >
                <img
                  src={selectedImage}
                  alt="Organizer Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.log("Image failed to load:", selectedImage);
                    e.target.src = "/static/avatar/001-man.svg"; // Fallback image
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", selectedImage);
                  }}
                />
              </Box>

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
                      name="name"
                      label="Full Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      name="email"
                      label="Email Address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      InputProps={{
                        startAdornment: (
                          <span style={{ marginRight: "8px" }}>+91</span>
                        ),
                      }}
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
                      onBlur={handleBlur}
                      helperText={touched.companyName && errors.companyName}
                      error={Boolean(touched.companyName && errors.companyName)}
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
                      label="Commission (%)"
                      type="number"
                      value={values.commission}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.commission && errors.commission ? errors.commission : "Enter commission percentage (0-100)"}
                      error={Boolean(touched.commission && errors.commission)}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 100,
                          step: 0.1
                        },
                        endAdornment: <span style={{ marginLeft: "8px", color: "#666" }}>%</span>
                      }}
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
                      name="reviewReason"
                      label="Review Reason"
                      value={values.reviewReason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.reviewReason && errors.reviewReason}
                      error={Boolean(
                        touched.reviewReason && errors.reviewReason
                      )}
                    />
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <SwitchWrapper>
                      <Paragraph display="block" fontWeight={600}>
                        Approval Status
                      </Paragraph>

                      <Switch
                        checked={values.approvalStatus === "approved" || values.approvalStatus === true}
                        onChange={(e) =>
                          setFieldValue("approvalStatus", e.target.checked ? "approved" : "pending")
                        }
                      />
                    </SwitchWrapper>
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <SwitchWrapper>
                      <Paragraph display="block" fontWeight={600}>
                        Is Active
                      </Paragraph>

                      <Switch 
                        checked={values.isActive}
                        onChange={(e) => setFieldValue("isActive", e.target.checked)}
                      />
                    </SwitchWrapper>
                  </Grid>
                  <Grid size={12}>
                    <Button type="submit" variant="contained">
                      Update Organizer
                    </Button>
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