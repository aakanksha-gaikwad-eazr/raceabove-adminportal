import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Paragraph, Small } from "@/components/typography";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createUser, updateUser, getUsers } from "@/store/apps/user";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material";
import { getTargets } from "@/store/apps/target";
import { FlexBox } from "@/components/flexbox";

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
  const [selectedImage, setSelectedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Store
  const dispatch = useDispatch();
  const { id } = useParams();
  const { users } = useSelector((state) => state.user);
  const { targets } = useSelector((state) => state.target);
  
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Get user data from state or find in users array
  const userData = state?.user || users.find(user => user.id === id);

  useEffect(() => {
    // Fetch targets if not already loaded
    if (!targets.length) {
      dispatch(getTargets());
    }
    
    // Fetch users if not already loaded and no user data in state
    if (!users.length && !userData) {
      dispatch(getUsers());
    }
  }, [dispatch, targets.length, users.length, userData]);

  // Set initial image when component mounts or userData changes
  useEffect(() => {
    if (userData?.profilePhoto) {
      setSelectedImage(userData.profilePhoto);
    }
  }, [userData]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file!");
      return;
    }

    // Validate file size (3MB limit)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size must be less than 3MB!");
      return;
    }

    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    setFieldValue('profilePhoto', file);
    toast.success("Image uploaded successfully!");
  };

  const initialValues = {
    name: userData?.name || "",
    age: userData?.age || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber?.replace(/^\+91/, "") || "",
    gender: userData?.gender || "",
    weight: userData?.weight || "",
    height: userData?.height || "",
    activitiesCount: userData?.activitiesCount || "",
    exerciseLevel: userData?.exerciseLevel || "",
    targets: Array.isArray(userData?.targets) ? userData.targets : [],
    walletBalance: userData?.wallet?.balance || "0.00",
    totalCoinsEarned: userData?.wallet?.totalCoinsEarned || "0.00",
    totalCoinsUsed: userData?.wallet?.totalCoinsUsed || "0.00",
    profilePhoto: userData?.profilePhoto || "",
    isActive: userData?.isActive || false,
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
    age: Yup.number()
      .positive("Age must be positive")
      .integer("Age must be an integer")
      .min(1, "Age must be at least 1")
      .max(120, "Age must be less than 120")
      .required("Age is required"),
    height: Yup.number()
      .positive("Height must be positive")
      .required("Height is required"),
    weight: Yup.number()
      .positive("Weight must be positive")
      .required("Weight is required"),
    targets: Yup.array()
      .min(1, "Select at least one target")
      .required("Targets are required"),
    activitiesCount: Yup.number()
      .min(0, "Must be a positive number")
      .required("Activities Count is required"),
    exerciseLevel: Yup.string().required("Exercise Level is required"),
    walletBalance: Yup.number()
      .min(0, "Wallet balance must be positive")
      .required("Wallet balance is required"),
    totalCoinsEarned: Yup.number()
      .min(0, "Total coins earned must be positive")
      .required("Total coins earned is required"),
    totalCoinsUsed: Yup.number()
      .min(0, "Total coins used must be positive")
      .required("Total coins used is required"),
  });

  // Handle edit user
  const handleUpdateUser = async (values) => {
    if (!userData?.id) {
      toast.error("User ID not found");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();

      // Append all form values
      Object.keys(values).forEach((key) => {
        console.log("values", values)
        if (key === "profilePhoto" && selectedFile) {
          formData.append("profilePhoto", selectedFile);
        } else if (key === "phoneNumber") {
          // Prepend +91 before submitting
          formData.append("phoneNumber", `+91${values[key]}`);
        } else if (key === "targets") {
              values.targets.forEach((target, index) => {
            formData.append(`targets[${index}]`, target);
          });
        } else if (key !== "profilePhoto") {
          formData.append(key, values[key]);
        }
      });

      console.log("Updating user with ID:", userData.id);

      const response = await dispatch(updateUser({ 
        id: userData.id, 
        data: formData 
      }));

      console.log("Update response:", response);

      if (response?.payload?.status === 200 || response?.meta?.requestStatus === "fulfilled") {
        toast.success("User updated successfully!");
        
        // Refresh users list
        await dispatch(getUsers());
        
        // Navigate back to user list
        navigate("/user-list-2");
      } else {
        toast.error(response?.payload?.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleUpdateUser,
  });

  // Show loading or error if user data is not available
  if (!userData) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Paragraph>Loading user data...</Paragraph>
        </Card>
      </div>
    );
  }

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
          
          <Grid size={{ md: 4, xs: 12 }}>
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
                    alt="Profile Preview"
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

          <Grid size={{ md: 8, xs: 12 }}>
            <Card className="p-3">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ sm: 6, xs: 12 }}>
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

                  <Grid size={{ sm: 6, xs: 12 }}>
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

                  <Grid size={{ sm: 6, xs: 12 }}>
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

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      name="gender"
                      label="Gender"
                      variant="outlined"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.gender && touched.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="age"
                      label="Age"
                      value={values.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.age && errors.age}
                      error={Boolean(touched.age && errors.age)}
                      type="number"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="height"
                      label="Height (cm)"
                      value={values.height}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.height && errors.height}
                      error={Boolean(touched.height && errors.height)}
                      type="number"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="weight"
                      label="Weight (kg)"
                      value={values.weight}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.weight && errors.weight}
                      error={Boolean(touched.weight && errors.weight)}
                      type="number"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      name="exerciseLevel"
                      label="Exercise Level"
                      variant="outlined"
                      value={values.exerciseLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.exerciseLevel && touched.exerciseLevel)}
                      helperText={touched.exerciseLevel && errors.exerciseLevel}
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      select
                      name="targets"
                      label="Targets"
                      multiple
                      fullWidth
                      value={values.targets || []}
                      onChange={(e) => {
                        const value = e.target.value
                        setFieldValue("targets", value);
                      }}
                      renderValue={(selected) =>
                        selected
                          .map((id) => targets.find((t) => t.id === id)?.name)
                          .filter(Boolean)
                          .join(", ")
                      }
                    >
                      {targets.map((target) => (
                        <MenuItem key={target.id} value={target.id}>
                          <Checkbox checked={values.targets?.includes(target.id)} />
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

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="activitiesCount"
                      label="Activities Count"
                      value={values.activitiesCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.activitiesCount && errors.activitiesCount}
                      error={Boolean(touched.activitiesCount && errors.activitiesCount)}
                      type="number"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="walletBalance"
                      label="Wallet Balance"
                      value={values.walletBalance}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.walletBalance && errors.walletBalance}
                      error={Boolean(touched.walletBalance && errors.walletBalance)}
                      type="number"
                      step="0.01"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="totalCoinsEarned"
                      label="Total Coins Earned"
                      value={values.totalCoinsEarned}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.totalCoinsEarned && errors.totalCoinsEarned}
                      error={Boolean(touched.totalCoinsEarned && errors.totalCoinsEarned)}
                      type="number"
                      step="0.01"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="totalCoinsUsed"
                      label="Total Coins Used"
                      value={values.totalCoinsUsed}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.totalCoinsUsed && errors.totalCoinsUsed}
                      error={Boolean(touched.totalCoinsUsed && errors.totalCoinsUsed)}
                      type="number"
                      step="0.01"
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <SwitchWrapper>
                      <Paragraph display="block" fontWeight={600}>
                        Is Active
                      </Paragraph>
                      <Switch
                        checked={values.isActive}
                        onChange={(e) => setFieldValue("isActive", e.target.checked)}
                        color="primary"
                      />
                    </SwitchWrapper>
                  </Grid>

                  <Grid size={12}>
                    <Box display="flex" gap={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ minWidth: 120 }}
                      >
                        {isSubmitting ? "Updating..." : "Update User"}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/user-list-2")}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </Box>
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