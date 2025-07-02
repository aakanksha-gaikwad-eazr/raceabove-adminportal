import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS

import { Paragraph, Small } from "@/components/typography"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createUser } from "../../../store/apps/user";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { MenuItem } from "@mui/material";

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

export default function AddNewGearsPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store actual file


  //store
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  // console.log("users", users)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    setSelectedFile(file); // Store actual file
    setSelectedImage(URL.createObjectURL(file));
    // const imageUrl = URL.createObjectURL(file);
    // setSelectedImage(imageUrl);
    toast.success("Image uploaded successfully!");
  };
  console.log("sdsa", selectedImage)


  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    target: "",
    exerciseLevel: "",
    activitiesCount: "",
    height: 0,
    weight: 0,
    reminder:""
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    // phoneNumber: Yup.number().required("Phone Number is Required!"),
      phoneNumber: Yup.string()
        .matches(/^\+91\d{10}$/, "Phone number must start with +91 and be 10 digits long")
        .required("Phone Number is Required!"),
    age: Yup.number().required("age is Required!"),
    target: Yup.string().required("Target is Required!"),
    exerciseLevel: Yup.string().required("Exercise Level is Required!"),
    activitiesCount: Yup.number().required("Activities Count is Required!"),
    height: Yup.number().required("height is Required!"),
    weight: Yup.number().required("weight is Required!"),
    gender: Yup.string().required("gender is Required!"),
    reminder: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Reminder must be in HH:mm format!")
    .required("Reminder is required!"),
    });
  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const navigate = useNavigate(); 

  // async function handleFormSubmit(formData) {
  //   console.log("clicked");
  //   const processedData = {
  //     ...formData,
  //     height: parseFloat(formData.height),
  //     weight: parseFloat(formData.weight),
  //     }

  //     if (selectedImage) {
  //       processedData.append("profilePhoto", selectedImage); 
  //     } else {
  //       toast.error("Image is required!");
  //       return;
  //     }
  
  //   };

  //   try {
  //     const response = await dispatch(createUser(processedData)).unwrap();


  //     if (response?.status === 201) {
  //       toast.success("User created successfully!");
  //       navigate("/user-list-2");
  //     } else {
  //       throw new Error(response.message || "Failed to create user");
  //     }
  //   } catch (error) {
  //     console.error("❌ Error in form submission:", error);
  //     toast.error(error.message || "Something went wrong!");
  //   }
  



  async function handleFormSubmit(formData) {
    console.log("clicked");
  
    // Create FormData object
    const formDataToSend = new FormData();
  
    // Append all form values
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
  
    // Append profile photo if selected
    if (selectedFile) {
      formDataToSend.append("profilePhoto", selectedFile); 
    } else {
      toast.error("Profile photo is required!");
      return;
    }
    
    try {
      const response = await dispatch(createUser(formDataToSend)).unwrap();
    
      if (response?.status === 201) {
        toast.success("User created successfully!");
        navigate("/user-list-2");
      } else {
        throw new Error(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error("❌ Error in form submission:", error);
      toast.error(error?.message);
    }
  }
  


  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    name="target"
                    label="Target"
                    value={values.target}
                    onChange={handleChange}
                    helperText={touched.target && errors.target}
                    error={Boolean(touched.target && errors.target)}
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
                    name="reminder"
                    label="Reminder"
                    value={values.reminder}
                    onChange={handleChange}
                    helperText={touched.reminder && errors.reminder}
                    error={Boolean(touched.reminder && errors.reminder)}
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
                    Create User
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
