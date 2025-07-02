import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createChallenges,
  getChallenges,
  getChallengesById,
} from "../../../store/apps/challenges";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Modal from "@/components/modal";
import Dropzone from "@/components/dropzone";
import toast from "react-hot-toast";
import { Select } from "@mui/material";
import ReactQuill from "react-quill";

const StyledAppModal = styled(Modal)(({ theme }) => ({
  "& .add-btn": {
    border: `1px solid ${theme.palette.divider}`,
  },
  "& .label": {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
    display: "block",
  },
  "& .btn-group": {
    gap: "1rem",
    display: "flex",
    paddingTop: "1.5rem",
  },
}));

// ==============================================================
export default function ProjectForm({ open, handleClose }) {
  const [date, setDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const dispatch = useDispatch();

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formik = useFormik({
    initialValues,
    // validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values) => {
      console.log("Form values before submission:", values);
      try {
        const formData = new FormData();

        // Append all form values to FormData
        Object.keys(values).forEach((key) => {
          console.log("values", values)
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
          dispatch(getChallenges());
          handleClose(); // Close the modal
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

  const { sports } = useSelector((state) => state.sports);

  return (
    <StyledAppModal open={open} handleClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* title */}
          <div>
            <p className="label">Challenge Title</p>
            <TextField
              fullWidth
              name="title"
              size="small"
              placeholder="Challenge Title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              helperText={touched.title && errors.title}
              error={Boolean(touched.title && errors.title)}
            />
          </div>

          {/* start date */}
          <div>
            <p className="label">Start Date</p>
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
            />
          </div>

          {/* end date */}
          <div>
            <p className="label">End Date</p>
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
            />
          </div>

          {/* target value */}
          <div>
            <p className="label">Target Value</p>
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
          </div>

          {/* target unit */}
          <div>
            <p className="label">Target Unit</p>
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
          </div>

          {/* target description */}
          {/* <div> */}
            <p className="label">Target Description</p>
             <TextField
              fullWidth
              name="targetDescription"
              size="small"
              placeholder="Target Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.targetDescription}
              helperText={touched.targetDescription && errors.targetDescription}
              error={Boolean(touched.targetDescription && errors.targetDescription)}
            /> 
          {/* <ReactQuill
              theme="snow"
              value={values.targetDescription}
              onChange={(content) =>
                setFieldValue("targetDescription", content) 
              }
            /> */}
          {/* </div> */}

          {/* reward */}
          <div>
            <p className="label">Reward</p>
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
          </div>

          {/* reward coins interval */}
          <div>
            <p className="label">Reward Coins Interval</p>
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
          </div>

          {/* reward coins per interval */}
          <div>
            <p className="label">Reward Coins Per Interval</p>
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
                touched.rewardCoinsPerInterval && errors.rewardCoinsPerInterval
              }
              error={Boolean(
                touched.rewardCoinsPerInterval && errors.rewardCoinsPerInterval
              )}
            />
          </div>

          {/* qualifying sports */}
          <div>
            <p className="label">Qualifying Sports</p>
            <Select
              fullWidth
              name="qualifyingSports"
              size="small"
              placeholder="Qualifying Sports"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.qualifyingSports}
              multiple
              renderValue={(selected) =>
                selected.length > 0 ? selected.join(", ") : "Select Sports"
              }
            >
              {sports.map((sport) => (
                <MenuItem key={sport.id} value={sport.id}>
                  {sport.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* description */}
            <p className="label">Description</p>

            <ReactQuill
              theme="snow"
              value={values.description}
              onChange={(description) => setFieldValue("description", description)}
            />

          {/* banner */}
          <div>
            <p className="label">Banner</p>
            <Dropzone
              onDrop={(files) => {
                setFieldValue("bannerFile", files[0]);
              }}
            />
            {touched.bannerFile && errors.bannerFile && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "8px" }}>
                {errors.bannerFile}
              </p>
            )}
          </div>

          {/* badge */}
          <div>
            <p className="label">Badge</p>
            <Dropzone
              onDrop={(files) => {
                setFieldValue("badgeFile", files[0]);
              }}
            />
            {touched.badgeFile && errors.badgeFile && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "8px" }}>
                {errors.badgeFile}
              </p>
            )}
          </div>

          <div className="btn-group">
            <Button type="submit" variant="contained" fullWidth>
              Create
            </Button>

            <Button variant="outlined" fullWidth onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Stack>
      </form>
    </StyledAppModal>
  );
}
