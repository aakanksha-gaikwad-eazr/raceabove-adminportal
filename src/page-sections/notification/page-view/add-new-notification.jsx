import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import { Paragraph } from "@/components/typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createNotification } from "@/store/apps/notification";

// Notification type options
const notificationTypes = [
  { value: "like", label: "Like" },
  { value: "comment", label: "Comment" },
  { value: "mention", label: "Mention" },
  { value: "new_follower", label: "New Follower" },
  { value: "new_activity", label: "New Activity" },
  { value: "challenge_completed", label: "Challenge Completed" },
  { value: "challenge_reward", label: "Challenge Reward" },
  { value: "challenge_invitation", label: "Challenge Invitation" },
  { value: "challenge_reminder", label: "Challenge Reminder" },
  { value: "event_announcement", label: "Event Announcement" },
  { value: "schedule_added", label: "Schedule Added" },
  { value: "schedule_missed", label: "Schedule Missed" },
  { value: "marketing", label: "Marketing" },
];

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Body is required"),
  type: Yup.string().required("Type is required"),
});

export default function AddNewNotificationPageView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    body: "",
    type: "",
  };

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Replace with your actual notification creation action
        const response = await dispatch(createNotification(values)).unwrap();
        console.log(response,"response")

        if (response?.status === 201 || response?.success) {
          toast.success("Notification created successfully");
          resetForm();
          navigate("/notification");
        } else {
          toast.error(
            response?.message || "Failed to create notification"
          );
        }
      } catch (error) {
        console.error("Error creating notification:", error);
        toast.error(
          error?.message ||
            "Error occurred while creating notification"
        );
      }
    },
  });

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FlexBox alignItems="center" gap={2}>
              <IconWrapper>
                <NotificationsIcon
                  sx={{
                    color: "primary.main",
                  }}
                />
              </IconWrapper>
              <Paragraph fontSize={20} fontWeight="bold">
               Notification
              </Paragraph>
            </FlexBox>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Title"
                    variant="outlined"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    placeholder="Enter notification title"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    name="body"
                    label="Body"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={values.body}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.body && Boolean(errors.body)}
                    helperText={touched.body && errors.body}
                    placeholder="Enter notification body"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl
                    fullWidth
                    error={touched.type && Boolean(errors.type)}
                  >
                    <InputLabel id="type-label">
                      Notification Type
                    </InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Notification Type"
                    >
                      {notificationTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.type && errors.type && (
                      <Typography
                        variant="caption"
                        color="error"
                        mt={1}
                      >
                        {errors.type}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FlexBox gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={
                        !values.title || !values.body || !values.type
                      }
                    >
                      Create Notification
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                  </FlexBox>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
