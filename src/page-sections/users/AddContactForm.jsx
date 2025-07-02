import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // MUI ICON COMPONENT

import CameraAlt from "@mui/icons-material/CameraAlt";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS

import { H5 } from "@/components/typography";
import AvatarBadge from "@/components/avatar-badge"; // ==========================================================================
import { MenuItem } from "@mui/material";
import { getUsers, updateUser } from "../../store/apps/user";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

// ==========================================================================
export default function AddContactForm({ handleCancel, data }) {
  const dispatch = useDispatch();
  useEffect(()=>{
    console.log("updated")
  },[data])

  const initialValues = {
    name: data?.name || "",
    age: data?.age || "",
    email: data?.email || "",
    phoneNumber: data?.phoneNumber || "",
    gender: data?.gender || "",
    weight: data?.weight || "",
    height: data?.height || "",
    activitiesCount: data?.activitiesCount || "",
    exerciseLevel: data?.exerciseLevel || "",
    target: data?.target || "",
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Must be greater than 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(
        /^\+?\d{12}$/,
        "Phone Number must be exactly 10 digits, starts with +91"
      )
      .required("Phone Number is required"),
    gender: Yup.string().required("Gender is required"),
    age: Yup.number().positive().integer().required("Age is required"),
    height: Yup.string().required("Height is required"),
    weight: Yup.string().required("Weight is required"),
    target: Yup.string().required("Target is required"),
    activitiesCount: Yup.number()
      .min(0, "Must be a positive number")
      .required("Activities Count is required"),
    exerciseLevel: Yup.string().required("Exercise Level is required"),
  });

  //handle edit user
  const handleUpdateUser = async (values, setSubmitting) => {
    console.log("clciked");
    try {
      const formData = new FormData();

      // Append all form values
    Object.keys(values).forEach((key) => {
      if (key === "profilePhoto" && values[key] instanceof File) {
        formData.append("profilePhoto", values[key]); // Append image file
      } else {
        formData.append(key, values[key]);
      }
    });

      dispatch(
        updateUser({ id: data?.id, data: values })
      ).then((response) => {
        if (response?.payload?.status === 200) {
          handleCancel()
      
          toast.success("User updated successfully!");
          dispatch(getUsers());
          setUpdate()
          localStorage.setItem("update",JSON.stringify({updatekey:true}))
        } else {
          toast.error(response?.message || "Something went wrong.");
        }
      });
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState(
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
    // onSubmit: (values) => console.log(values),
    onSubmit: (values, { setSubmitting }) => {
      handleUpdateUser(values, setSubmitting);
    },
  });
  return (
    <div>
      <H5 fontSize={16} mb={4}>
        Edit User
      </H5>

      <form onSubmit={handleSubmit}>
        <Stack direction="row" justifyContent="center" mb={6}>
          <AvatarBadge
            badgeContent={
              <label htmlFor="icon-button-file">
                <input
                  type="file"
                  accept="image/*"
                  id="icon-button-file"
                  style={{
                    display: "none",
                  }}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      setSelectedImage(URL.createObjectURL(file)); // Update preview
                      setFieldValue("profilePhoto", file); // Update formik state
                    }
                  }}
                />

                <IconButton aria-label="upload picture" component="span">
                  <CameraAlt
                    sx={{
                      fontSize: 16,
                      color: "background.paper",
                    }}
                  />
                </IconButton>
              </label>
            }
          >
            <Avatar
              src={selectedImage || "/static/avatar/001-man.svg"}
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "grey.100",
              }}
            />
          </AvatarBadge>
        </Stack>

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
              label="Name"
              variant="outlined"
              onBlur={handleBlur}
              value={values.name}
              onChange={handleChange}
              error={Boolean(errors.name && touched.name)}
              helperText={touched.name && errors.name}
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
              onBlur={handleBlur}
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
              name="height"
              label="Height"
              variant="outlined"
              onBlur={handleBlur}
              value={values.height}
              onChange={handleChange}
              error={Boolean(errors.height && touched.height)}
              helperText={touched.height && errors.height}
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
              variant="outlined"
              onBlur={handleBlur}
              value={values.weight}
              onChange={handleChange}
              error={Boolean(errors.weight && touched.weight)}
              helperText={touched.weight && errors.weight}
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
              variant="outlined"
              onBlur={handleBlur}
              value={values.target}
              onChange={handleChange}
              error={Boolean(errors.target && touched.target)}
              helperText={touched.target && errors.target}
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
              name="activitiesCount"
              label="Activities Count"
              variant="outlined"
              onBlur={handleBlur}
              value={values.activitiesCount}
              onChange={handleChange}
              error={Boolean(errors.activitiesCount && touched.activitiesCount)}
              helperText={touched.activitiesCount && errors.activitiesCount}
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
              type="email"
              label="Email"
              variant="outlined"
              onBlur={handleBlur}
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email && touched.email)}
              helperText={touched.email && errors.email}
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
              onBlur={handleBlur}
              value={values.exerciseLevel}
              onChange={handleChange}
              error={Boolean(errors.exerciseLevel && touched.exerciseLevel)}
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
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              onBlur={handleBlur}
              value={values.phoneNumber}
              onChange={handleChange}
              error={Boolean(errors.phoneNumber && touched.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
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
              variant="outlined"
              onBlur={handleBlur}
              value={values.age}
              onChange={handleChange}
              error={Boolean(errors.age && touched.age)}
              helperText={touched.age && errors.age}
            />
          </Grid>
        </Grid>

        <Stack direction="row" alignItems="center" spacing={1} mt={4}>
          <Button type="submit" size="small">
            Save
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </div>
  );
}
