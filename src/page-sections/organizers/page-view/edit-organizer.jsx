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
import { createUser, updateUser } from "../../../store/apps/user";
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
  //store
  const dispatch = useDispatch();
  const { organisers } = useSelector((state) => state.organisers);
  const { singleOrganizer } = useSelector((state) => state.organisers);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getSingleOrganizers(id));
    }
  }, [id, dispatch]);

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

  //handle edit user
  // const handleUpdateOrganizer = async (values, setSubmitting) => {
  //   console.log("clciked", values);
  //   try {
  //     // const formData = new FormData();

  //     // Append all form values
  //     Object.keys(values).forEach((key) => {
  //       if (key === "profilePhoto" && values[key] instanceof File) {
  //         formData.append("profilePhoto", values[key]);
  //       } else if (key === "phoneNumber") {
  //         // Prepend +91 before submitting
  //         formData.append("phoneNumber", `+91${values[key]}`);
  //       } else {
  //         formData.append(key, values[key]);
  //       }
  //     });

  //     console.log("formdata", formData);

  //     dispatch(updateOrganizer({ id: data?.id, data: formData })).then(
  //       (response) => {
  //         if (response?.payload?.status === 200) {
  //           toast.success("Organizer updated successfully!");
  //           dispatch(getOrganizers());
  //           setUpdate();
  //           localStorage.setItem("update", JSON.stringify({ updatekey: true }));
  //         } else {
  //           toast.error(response?.message || "Something went wrong.");
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     toast.error("Failed to update Organizer. Please try again.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleUpdateOrganizer = async (values, setSubmitting) => {
    console.log("clicked", values);
    try {
      // ✅ Construct plain JSON instead of FormData
      const payload = {
        name: values.name,
        email: values.email,
        phoneNumber: `+91${values.phoneNumber}`, // backend expects full number
        companyName: values.companyName,
        commission: Number(values.commission),
        isActive: values.isActive ?? true, // bind this to your Switch
        approvalStatus: "pending", // default or from form
        reviewReason: values.reviewReason || "N/A",
      };

      console.log("payload", payload)

      dispatch(updateOrganizer({ id, data: payload })).then((response) => {
        if (response?.payload?.status === 200) {
          toast.success("Organizer updated successfully!");
          dispatch(getOrganizers());
          navigate('/organiser-list-2')
          localStorage.setItem("update", JSON.stringify({ updatekey: true }));
        } else {
          toast.error(response?.message || "Something went wrong.");
        }
      });
    } catch (error) {
      toast.error("Failed to update Organizer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [edImage, selectedImage, setSelectedImage] = useState(
    singleOrganizer?.profilePhoto || "/static/avatar/001-man.svg"
  );

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

  const navigate = useNavigate();

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
                      label="Commission"
                      value={values.commission}
                      onChange={handleChange}
                      helperText={touched.commission && errors.commission}
                      error={Boolean(touched.commission && errors.commission)}
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
                      label="reviewReason"
                      value={values.reviewReason}
                      onChange={handleChange}
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
                      checked={values.approvalStatus}
                      onChange={(e) =>
                        setFieldValue("approvalStatus", e.target.checked)
                      }/>
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

                      <Switch defaultChecked />
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
