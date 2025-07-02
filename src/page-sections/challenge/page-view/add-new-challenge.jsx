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
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material";
import { getTargets } from "@/store/apps/target";
import { DatePicker } from "@mui/x-date-pickers";
import ReactQuill from "react-quill";
import DropZone from "@/components/dropzone";
import { createChallenges } from "@/store/apps/challenges";
import { getSports } from "@/store/apps/sports";
import { getChallenges } from "@/store/apps/challenges";
import { FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";

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

export default function AddNewChallengePageView() {
  const [date, setDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);

  //store
  const dispatch = useDispatch();
  const { sports } = useSelector((state) => state.sports);
  console.log("sports", sports);

  useEffect(() => {
    dispatch(getSports());
  }, [dispatch]);

  const initialValues = {
    title: "",
    startDate: "" || new Date().toISOString().split("T")[0],
    endDate: "" || new Date().toISOString().split("T")[0],
    targetValue: "",
    targetUnit: "",
    targetDescription: "",
    reward: "",
    description: "",
    bannerFile: null,
    badgeFile: null,
    rewardCoinsInterval: "",
    rewardCoinsPerInterval: "",
    qualifyingSports: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    startDate: Yup.string()
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Start date must be a valid date in YYYY-MM-DD format"
      )
      .required("Start Date is required"),
    endDate: Yup.string()
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "End date must be a valid date in YYYY-MM-DD format"
      )
      .required("End Date is required"),
    targetValue: Yup.number().required("Target Value is required"),
    targetDescription: Yup.string().required("Target Description is required"),
    reward: Yup.string().required("Reward is required"),
    targetUnit: Yup.string().required("Target Unit is required"),
    rewardCoinsInterval: Yup.number().required("Reward Interval is required"),
    rewardCoinsPerInterval: Yup.number().required(
      "Reward Per Interval is required"
    ),
    description: Yup.string().required("Description is required"),
    bannerFile: Yup.mixed().required("Banner File is required"),
    badgeFile: Yup.mixed().required("Badge File is required"),
    qualifyingSports: Yup.array()
      .of(Yup.string().required())
      .min(1, "Select at least one sport")
      .required("Qualifying Sports is required"),
  });

  function formatDate(date) {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values) => {
      console.log("Form values before submission:", values);
      try {
        const formData = new FormData();

        // Append all form values to FormData
        Object.keys(values).forEach((key) => {
          console.log("values", values);
          if (key === "bannerFile" || key === "badgeFile") {
            // Handle file fields
            if (values[key]) {
              formData.append(key, values[key]);
            }
          } else if (key === "qualifyingSports") {
            // Handle array field - ensure it's an array and append each value
            const sportsArray = Array.isArray(values[key])
              ? values[key]
              : [values[key]];
            console.log("sportsArray", sportsArray);
            sportsArray.forEach((sportId, index) => {
              formData.append(`qualifyingSports[${index}]`, sportId);
            });
          } else {
            // Handle all other fields
            formData.append(key, values[key]);
          }
        });

        const response = await dispatch(createChallenges(formData)).unwrap();

        if (response) {
          toast.success("Challenge created successfully");
          navigate("/challenges/version-3");
          dispatch(getChallenges());
          resetForm(); // Reset the form
        }
      } catch (error) {
        toast.error(error.message || "Failed to create challenge");
      }
    },
  });

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    resetForm,
  } = formik;

  const navigate = useNavigate();

  // async function handleFormSubmit(formData) {
  //   console.log("form", formData);
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
  //     } else {
  //       formDataToSend.append(key, formData[key]);
  //     }
  //   });

  //   // Append profile photo if selected
  //   if (selectedFile) {
  //     formDataToSend.append("profilePhoto", selectedFile);
  //   } else {
  //     toast.error("Profile photo is required!");
  //     return;
  //   }

  //   try {
  //     console.log("formdata to send", formDataToSend);
  //     const response = await dispatch(createUser(formDataToSend)).unwrap();

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

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FlexBox alignItems="center">
            <IconWrapper>
              <GroupSenior sx={{ color: "primary.main" }} />
            </IconWrapper>
            <Paragraph fontSize={18} fontWeight="bold">
              Add New Challenge
            </Paragraph>
          </FlexBox>
        </Grid>
        <Grid
          size={{
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
                    name="title"
                    size="small"
                    label="Challenge Title"
                    placeholder="Challenge Title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.title && errors.title}
                    error={Boolean(touched.title && errors.title)}
                  />
                </Grid>

                <Grid
                  size={{
                    sm: 6,
                    xs: 12,
                  }}
                >
                  <DatePicker
                    fullWidth
                    name="startDate"
                    size="small"
                    value={values.startDate ? new Date(values.startDate) : null}
                    onChange={(newDate) => {
                      if (newDate) {
                        setFieldValue("startDate", formatDate(newDate));
                      } else {
                        setFieldValue("startDate", "");
                      }
                    }}
                    sx={{ width: "100%" }}
                  />
                </Grid>

                <Grid
                  size={{
                    sm: 6,
                    xs: 12,
                  }}
                >
                  <DatePicker
                    fullWidth
                    name="endDate"
                    value={values.endDate ? new Date(values.endDate) : null}
                    onChange={(newDate) => {
                      if (newDate) {
                        setFieldValue("endDate", formatDate(newDate));
                      } else {
                        setFieldValue("endDate", "");
                      }
                    }}
                    sx={{ width: "100%" }}
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
                    name="targetValue"
                    size="small"
                    placeholder="Target Value"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.targetValue}
                    helperText={touched.targetValue && errors.targetValue}
                    error={Boolean(touched.targetValue && errors.targetValue)}
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
                    name="targetUnit"
                    size="small"
                    placeholder="Target Unit"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.targetUnit}
                    helperText={touched.targetUnit && errors.targetUnit}
                    error={Boolean(touched.targetUnit && errors.targetUnit)}
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
                    name="targetDescription"
                    size="small"
                    placeholder="Target Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.targetDescription}
                    helperText={
                      touched.targetDescription && errors.targetDescription
                    }
                    error={Boolean(
                      touched.targetDescription && errors.targetDescription
                    )}
                  />
                </Grid>

                <Grid
                  size={{
                    sm: 6,
                    xs: 12,
                  }}
                >
                  <Select
                    displayEmpty
                    fullWidth
                    name="qualifyingSports"
                    size="small"
                    placeholder="Qualifying Sports"
                    onBlur={handleBlur}
                    onChange={(event) => {
                      setFieldValue("qualifyingSports", event.target.value);
                    }}
                    value={values.qualifyingSports}
                    multiple
                    renderValue={(selected) => {
                      const selectedSports = selected
                        .map(
                          (id) => sports.find((sport) => sport.id === id)?.name
                        )
                        .filter(Boolean);
                      return selectedSports.length > 0
                        ? selectedSports.join(", ")
                        : "Select Sports";
                    }}
                    error={Boolean(
                      touched.qualifyingSports && errors.qualifyingSports
                    )}
                  >
                    {sports?.map((sport) => (
                      <MenuItem key={sport.id} value={sport.id}>
                        <Checkbox
                          checked={
                            values.qualifyingSports.indexOf(sport.id) > -1
                          }
                        />
                        <ListItemText primary={sport.name} />
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.qualifyingSports && errors.qualifyingSports && (
                    <Small color="error.main" mt={0.5}>
                      {errors.qualifyingSports}
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
                    name="reward"
                    size="small"
                    placeholder="Reward"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.reward}
                    helperText={touched.reward && errors.reward}
                    error={Boolean(touched.reward && errors.reward)}
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
                    name="rewardCoinsInterval"
                    size="small"
                    placeholder="Reward Coins Interval"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.rewardCoinsInterval}
                    type="number"
                    helperText={
                      touched.rewardCoinsInterval && errors.rewardCoinsInterval
                    }
                    error={Boolean(
                      touched.rewardCoinsInterval && errors.rewardCoinsInterval
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
                    name="rewardCoinsPerInterval"
                    size="small"
                    placeholder="Reward Coins Per Interval"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.rewardCoinsPerInterval}
                    type="number"
                    helperText={
                      touched.rewardCoinsPerInterval &&
                      errors.rewardCoinsPerInterval
                    }
                    error={Boolean(
                      touched.rewardCoinsPerInterval &&
                        errors.rewardCoinsPerInterval
                    )}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={values.description || ""}
                    placeholder="Write your Description..."
                    onChange={(description) =>
                      setFieldValue("description", description)
                    }
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <Paragraph fontWeight={500} mb={1}>
                    Challenge Banner Image
                  </Paragraph>
                  <DropZone
                    onDrop={(files) => {
                      setFieldValue("bannerFile", files[0]);
                    }}
                  />
                  {touched.bannerFile && errors.bannerFile && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      {errors.bannerFile}
                    </p>
                  )}
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <Paragraph fontWeight={500} mb={1}>
                  Challenge Badge Image
                  </Paragraph>
                  <DropZone
                    onDrop={(files) => {
                      setFieldValue("badgeFile", files[0]);
                    }}
                  />
                  {touched.badgeFile && errors.badgeFile && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      {errors.badgeFile}
                    </p>
                  )}
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
                    Create
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
