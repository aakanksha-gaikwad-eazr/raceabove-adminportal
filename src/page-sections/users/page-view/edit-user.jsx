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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material";
import { getTargets } from "@/store/apps/target";
import { FlexBox } from "@/components/flexbox";
import { Wallet } from "@mui/icons-material";

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

export default function EditUserPageView() {
  const [selectedFile, setSelectedFile] = useState(null);
  //store
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { targets } = useSelector((state) => state.target);

  const { state } = useLocation();
  const data = state?.user;

  useEffect(() => {
    dispatch(getTargets());
  }, [dispatch]);

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
    name: data?.name || "",
    age: data?.age || "",
    email: data?.email || "",
    phoneNumber: data?.phoneNumber?.replace(/^\+91/, "") || "",
    gender: data?.gender || "",
    weight: data?.weight || "",
    height: data?.height || "",
    activitiesCount: data?.activitiesCount || "",
    exerciseLevel: data?.exerciseLevel || "",
    targets: data?.targets || [],
    walletBalance: data?.wallet?.balance || "0.00",
    totalCoinsEarned: data?.wallet?.totalCoinsEarned || "0.00",
    totalCoinsUsed: data?.wallet?.totalCoinsUsed || "0.00",
    profilePhoto: data?.profilePhoto || "",
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
    gender: Yup.string().required("Gender is required"),
    age: Yup.number().positive().integer().required("Age is required"),
    height: Yup.string().required("Height is required"),
    weight: Yup.string().required("Weight is required"),
    targets: Yup.array()
      .min(1, "Select at least one target")
      .required("Targets are required"),
    activitiesCount: Yup.number()
      .min(0, "Must be a positive number")
      .required("Activities Count is required"),
    exerciseLevel: Yup.string().required("Exercise Level is required"),
  });

  //handle edit user
  const handleUpdateUser = async (values, setSubmitting) => {
    console.log("clciked", values);
    try {
      const formData = new FormData();

      // Append all form values
      Object.keys(values).forEach((key) => {
        if (key === "profilePhoto" && values[key] instanceof File) {
          formData.append("profilePhoto", values[key]);
        } else if (key === "phoneNumber") {
          // Prepend +91 before submitting
          formData.append("phoneNumber", `+91${values[key]}`);
        } else if (key === "targets") {
          values.targets.forEach((target, i) => {
            formData.append(`targets[${i}]`, target);
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      console.log("formdat", formData);

      dispatch(updateUser({ id: data?.id, data: formData })).then(
        (response) => {
          if (response?.payload?.status === 200) {
            toast.success("User updated successfully!");
            dispatch(getUsers());
            setUpdate();
            localStorage.setItem("update", JSON.stringify({ updatekey: true }));
          } else {
            toast.error(response?.message || "Something went wrong.");
          }
        }
      );
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [edImage, selectedImage, setSelectedImage] = useState(
    data?.profilePhoto || "/static/avatar/001-man.svg"
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
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleUpdateUser(values, setSubmitting);
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
                Edit User
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
                      select
                      fullWidth
                      name="gender"
                      label="Gender"
                      variant="outlined"
                      value={values.gender}
                      onChange={handleChange}
                      error={Boolean(errors.gender && touched.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
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
                      name="age"
                      label="Age"
                      value={values.age}
                      onChange={handleChange}
                      helperText={touched.age && errors.age}
                      error={Boolean(touched.age && errors.age)}
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
                      name="height"
                      label="Height"
                      value={values.height}
                      onChange={handleChange}
                      helperText={touched.height && errors.height}
                      error={Boolean(touched.height && errors.height)}
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
                      name="weight"
                      label="Weight"
                      value={values.weight}
                      onChange={handleChange}
                      helperText={touched.weight && errors.weight}
                      error={Boolean(touched.weight && errors.weight)}
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
                      select
                      fullWidth
                      name="exerciseLevel"
                      label="Exercise Level"
                      variant="outlined"
                      value={values.exerciseLevel}
                      onChange={handleChange}
                      error={Boolean(
                        errors.exerciseLevel && touched.exerciseLevel
                      )}
                      helperText={touched.exerciseLevel && errors.exerciseLevel}
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </TextField>{" "}
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      select
                      name="targets"
                      label="Targets"
                      multiple
                      fullWidth
                      value={values.targets || []}
                      onChange={(e) => setFieldValue("targets", e.target.value)}
                      renderValue={(selected) =>
                        selected
                          .map((id) => targets.find((t) => t.id === id)?.name)
                          .join(",")
                      }
                      // error={Boolean(touched.targets && errors.targets)}
                      // helperText={touched.targets && errors.targets}
                    >
                      {targets.map((target) => (
                        <MenuItem key={target.id} value={target.id}>
                          {/* <Checkbox
                            checked={values.targets?.includes(target.id)}
                          /> */}
                          <ListItemText primary={target.name} />
                        </MenuItem>
                      ))}
                    </TextField>
                    {touched.targets && errors.targets && (
                      <Small color="error.main" mt={0.5}>
                        {errors.targets}
                      </Small>
                    )}
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="activitiesCount"
                      label="Activities Count"
                      value={values.activitiesCount}
                      onChange={handleChange}
                      helperText={
                        touched.activitiesCount && errors.activitiesCount
                      }
                      error={Boolean(
                        touched.activitiesCount && errors.activitiesCount
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
                    <TextField
                      fullWidth
                      name="walletBalance"
                      label="wallet Balance"
                      value={values.walletBalance}
                      onChange={handleChange}
                      helperText={touched.walletBalance && errors.walletBalance}
                      error={Boolean(
                        touched.walletBalance && errors.walletBalance
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
                      name="totalCoinsEarned"
                      label="Total Coins Earned"
                      value={values.totalCoinsEarned}
                      onChange={handleChange}
                      helperText={
                        touched.totalCoinsEarned && errors.totalCoinsEarned
                      }
                      error={Boolean(
                        touched.totalCoinsEarned && errors.totalCoinsEarned
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
                      name="totalCoinsUsed"
                      label="Total Coins Used"
                      value={values.totalCoinsUsed}
                      onChange={handleChange}
                      helperText={
                        touched.totalCoinsUsed && errors.totalCoinsUsed
                      }
                      error={Boolean(
                        touched.totalCoinsUsed && errors.totalCoinsUsed
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
                        Is Active
                      </Paragraph>

                      <Switch defaultChecked />
                    </SwitchWrapper>
                  </Grid>
                  <Grid size={12}>
                    <Button type="submit" variant="contained">
                      Update User
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
