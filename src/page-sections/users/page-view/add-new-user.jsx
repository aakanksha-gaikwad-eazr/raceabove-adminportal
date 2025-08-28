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
import { createUser } from "../../../store/apps/user";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
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
  position: "relative",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.grey[isDark(theme) ? 600 : 200],
  }
}));

const UploadButton = styled("label")(({ theme }) => ({
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[isDark(theme) ? 600 : 200],
  border: `1px solid ${theme.palette.background.paper}`,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.grey[isDark(theme) ? 500 : 300],
  }
}));

const HiddenInput = styled("input")({
  display: "none",
});

export default function AddNewUserPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store actual file

  //store
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { targets } = useSelector((state) => state.target || {});

  useEffect(() => {
    dispatch(getTargets());
  }, [dispatch]);

  // console.log("users", users)
  console.log("targets", targets);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, JPG, PNG, GIF)!");
      return;
    }

    // Validate file size (3.1 MB)
    const maxSize = 3.1 * 1024 * 1024; // 3.1 MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 3.1 MB!");
      return;
    }

    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    // Set the file in formik
    setFieldValue("profilePhoto", file);
    toast.success("Image uploaded successfully!");
  };

 const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  city: "",
  state: "",
  dailyStepsTarget: 0,
  targets: [],
  exerciseLevel: "",
  activitiesCount: "",
  height: "",
  weight: "",
  gender: "",
  isActive: true,
};


  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits long")
      .required("Phone Number is Required!"),
    age: Yup.number().required("age is Required!"),
dateOfBirth: Yup.string()
  .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .required("Date of Birth is required!"),
    targets: Yup.array()
      .min(1, "Select at least one target")
      .required("Targets are required!"),
    exerciseLevel: Yup.string().required(
      "Exercise Level is Required!"
    ),
    activitiesCount: Yup.number().required(
      "Activities Count is Required!"
    ),
    height: Yup.number()
      .typeError("Height must be a number")
      .moreThan(0, "Height must be greater than 0")
      .required("Height is Required!"),
    weight: Yup.number()
      .typeError("Weight must be a number")
      .moreThan(0, "Weight must be greater than 0")
      .required("Weight is Required!"),
    gender: Yup.string().required("gender is Required!"),
    reminder: Yup.string()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Reminder must be in HH:mm format!"
      )
      .required("Reminder is required!"),
    profilePhoto: Yup.mixed().required("Profile photo is required"),
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    setFieldValue,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const navigate = useNavigate();

  // async function handleFormSubmit(formData) {
  //   console.log("form", formData);
    
  //   // Check if profile photo is selected
  //   if (!selectedFile) {
  //     toast.error("Profile photo is required!");
  //     return;
  //   }

  //   // Create FormData object
  //   const formDataToSend = new FormData();

  //   // Append all form values
  //   Object.keys(formData).forEach((key) => {
  //     if (key === "phoneNumber") {
  //       // Add +91 prefix to phone number
  //       formDataToSend.append(key, `+91${formData[key]}`);
  //     } else if (key === "targets") {
  //       // Handle targets array
  //       formData[key]
  //         .filter((target) => !!target)
  //         .forEach((target, i) =>
  //           formDataToSend.append(`targets[${i}]`, target)
  //         );
  //     }else if(formData.dateOfBirth) {
  //   const [year, month, day] = formData.dateOfBirth.split("-");
  //   formData.dateOfBirth = `${day}/${month}/${year}`;
  //     }else if (key === "profilePhoto") {
  //       // Skip profilePhoto here, we'll add the actual file below
  //       return;
  //     } else {
  //       formDataToSend.append(key, formData[key]);
  //     }
  //   });

  //   // Append profile photo file
  //   formDataToSend.append("profilePhoto", selectedFile);

  //   try {
  //     console.log("formdata to send", formDataToSend);
  //     const response = await dispatch(
  //       createUser(formDataToSend)
  //     ).unwrap();

  //     if (response?.status === 201) {
  //       toast.success("User created successfully!");
  //       navigate("/user-list-2");
  //     } else {
  //       throw new Error(response.message || "Failed to create user");
  //     }
  //   } catch (error) {
  //     console.error("❌ Error in form submission:", error);
  //     toast.error(error?.message);
  //   }
  // }

 async function handleFormSubmit(formData, { resetForm }){
  try {
    // ✅ Convert dateOfBirth from YYYY-MM-DD → DD/MM/YYYY before sending
    if (formData.dateOfBirth) {
      const [year, month, day] = formData.dateOfBirth.split("-");
      formData.dateOfBirth = `${day}/${month}/${year}`;
    }

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "phoneNumber") {
        formDataToSend.append(key, `+91${formData[key]}`);
      } else if (key === "targets") {
        formData[key].forEach((target, index) => {
          formDataToSend.append(`targets[${index}]`, target);
        });
      } else if (key !== "profilePhoto") {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (formData.profilePhoto) {
      formDataToSend.append("profilePhoto", formData.profilePhoto);
    }

    const response = await dispatch(createUser(formDataToSend)).unwrap();
    if (response?.statusCode === 200) {
      toast.success("User added successfully!");
      resetForm();
    } else {
      toast.error("Failed to add user. Please try again.");
    }
  } catch (error) {
    console.error("Error adding user:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


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
                Add New User
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
                <UploadButton htmlFor="upload-btn">
                  <HiddenInput
                    accept="image/*"
                    id="upload-btn"
                    type="file"
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
                  border="2px solid"
                  borderColor="primary.main"
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

              {/* Show validation error for profile photo */}
              {touched.profilePhoto && errors.profilePhoto && (
                <Small color="error.main" mt={1}>
                  {errors.profilePhoto}
                </Small>
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
                      helperText={
                        touched.phoneNumber && errors.phoneNumber
                      }
                      error={Boolean(
                        touched.phoneNumber && errors.phoneNumber
                      )}
                      InputProps={{
                        startAdornment: (
                          <span style={{ marginRight: "8px" }}>
                            +91
                          </span>
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

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <Select
                      multiple
                      fullWidth
                      value={values.targets || []}
                      onChange={(e) =>
                        setFieldValue("targets", e.target.value)
                      }
                      onBlur={handleBlur}
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) =>
                              targets.find((t) => t.id === id)?.name
                          )
                          .join(", ")
                      }
                      error={Boolean(
                        touched.targets && errors.targets
                      )}
                      displayEmpty

                      // renderValue={(selected) => {
                      //   if (selected.length === 0) {
                      //     return <span style={{ color: '#9e9e9e' }}>Select Targets</span>;
                      //   }
                      //   return selected
                      //     .map(
                      //       (id) =>
                      //         targets.find((t) => t.id === id)?.name
                      //     )
                      //     .join(", ");
                      // }}
                      
                    >
                      {targets.map((target) => (
                        <MenuItem key={target.id} value={target.id}>
                          <Checkbox
                            checked={values.targets?.includes(
                              target.id
                            )}
                          />
                          <ListItemText primary={target.name} />
                        </MenuItem>
                      ))}
                    </Select>
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
                      select
                      fullWidth
                      name="exerciseLevel"
                      label="Exercise Level"
                      variant="outlined"
                      value={values.exerciseLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        errors.exerciseLevel && touched.exerciseLevel
                      )}
                      helperText={
                        touched.exerciseLevel && errors.exerciseLevel
                      }
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">
                        Intermediate
                      </MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
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

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="state"
                      label="State"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.state && errors.state}
                      error={Boolean(touched.state && errors.state)}
                      
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
                      name="dailyStepsTarget"
                      label="Daily Steps Target"
                      value={values.dailyStepsTarget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.dailyStepsTarget && errors.dailyStepsTarget}
                      error={Boolean(touched.dailyStepsTarget && errors.dailyStepsTarget)}
                      
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
  type="date"
  name="dateOfBirth"
  label="Date of Birth"
  InputLabelProps={{ shrink: true }}
  value={values.dateOfBirth}   // keep YYYY-MM-DD here
  onChange={handleChange}
  onBlur={handleBlur}
  helperText={touched.dateOfBirth && errors.dateOfBirth}
  error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
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
                      name="city"
                      label="City (cm)"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.city && errors.city}
                      error={Boolean(touched.city && errors.city)}
                      
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
                      label="Weight (kg)"
                      value={values.weight}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      name="activitiesCount"
                      label="Activities Count"
                      value={values.activitiesCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        touched.activitiesCount &&
                        errors.activitiesCount
                      }
                      error={Boolean(
                        touched.activitiesCount &&
                          errors.activitiesCount
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
                      name="reminder"
                      label="Reminder (HH:mm)"
                      placeholder="e.g., 09:30"
                      value={values.reminder}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.reminder && errors.reminder}
                      error={Boolean(
                        touched.reminder && errors.reminder
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

                      <Switch 
                        defaultChecked 
                        name="isActive"
                        onChange={(e) => setFieldValue("isActive", e.target.checked)}
                      />
                    </SwitchWrapper>
                  </Grid>
                  <Grid size={12}>
                    <Button 
                      type="submit" 
                      variant="contained"
                      size="large"
                      sx={{ minWidth: 120 }}
                    >
                      Create User
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