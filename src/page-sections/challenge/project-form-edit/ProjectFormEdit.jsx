import { useEffect, useState } from "react"; // MUI ICON COMPONENT

import Add from "@mui/icons-material/Add"; // MUI
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import { useDispatch, useSelector } from "react-redux";
import {
  createChallenges,
  getChallenges,
  getChallengesById,
  updateChallenges,

} from "../../../store/apps/challenges"; // Import the API call

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import styled from "@mui/material/styles/styled";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // CUSTOM COMPONENTS
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";

import Modal from "@/components/modal";
import { getSports } from "../../../store/apps/sports";
import { Box, Chip } from "@mui/material";
import toast from "react-hot-toast";
import Dropzone from "@/components/dropzone";

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
})); // ==============================================================

// ==============================================================

const initialValues = {
  title: "",
  startDate: "" || new Date().toISOString().split("T")[0],
  endDate: "" || new Date().toISOString().split("T")[0],
  targetValue: "",
  targetUnit: "",
  targetDescription: "",
  reward: "",
  description: "",
  banner: null,
  badge: null,
  rewardCoinsInterval: "",
  rewardCoinsPerInterval: "",
  qualifyingSports: [],
};

export default function ProjectFormEdit({ open, handleClose, challengeId }) {
  const [date, setDate] = useState(new Date());

  const dispatch = useDispatch();

  const { challenge } = useSelector((state) => state.challenges);
  const { singleChallenge } = useSelector((state) => state.challenges);
  const { sports } = useSelector((state) => state.sports);

  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    if (!challengeId) {
      console.error("challengeId is missing, update API will not be called.");
      return;
    }
    
    const loadData = async () => {
      try {
        await dispatch(getChallengesById(challengeId));
        await dispatch(getSports());
      } catch (error) {
        console.error("Error loading challenge data:", error);
        toast.error("Failed to load challenge data");
      }
    };
    
    loadData();
  }, [dispatch, challengeId]);


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
    rewardCoinsPerInterval: Yup.number().required("Reward Per Interval is required"),
    description: Yup.string().required("Description is required"),
    bannerFile: Yup.mixed().nullable(),  // Changed this
    badgeFile: Yup.mixed().nullable(),   // Changed this
    banner: Yup.mixed().nullable(),      // Added this
    badge: Yup.mixed().nullable(), 
    qualifyingSports: Yup.array()
      .of(Yup.string().required())
      .min(1, "Select at least one sport")
      .required("Qualifying Sports is required"),
  }).test(
    'fileValidation', null, function(value) {

  const errors = {};
  // Check if either bannerFile or banner exists
  if (!value.bannerFile && !value.banner) {
    errors.bannerFile = 'Either banner or bannerFile is required';
  }
  
  // Check if either badgeFile or badge exists
  if (!value.badgeFile && !value.badge) {
    errors.badgeFile = 'Either badge or badgeFile is required';
  }
  
  return Object.keys(errors).length === 0 ? true : this.createError({ path: null, errors: [errors] });
}
  )
 
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
    touched,
  } = useFormik({
    initialValues,
    // validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      console.log("Form Submitted",values)

   
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value == null) return;
      
          if (key === "banner" && value instanceof File) {
            formData.append("banner", value);
          } else if (key === "badge" && value instanceof File) {
            formData.append("badge", value);
          } else if (Array.isArray(value)) {
            value.forEach((v) => formData.append(`${key}[]`, v));
          } else if (["startDate", "endDate"].includes(key)) {
            formData.append(key, new Date(value).toISOString().split("T")[0]);
          } else {
            formData.append(key, value);
          }
        });

      try {
        console.log("apicalled")
        const response = await dispatch(updateChallenges({id: challengeId,
          changedData:formData , })).unwrap();
          console.log("res>>>;", response)
        if(response?.status === 200){
          toast.success("edited form succesfully")
          await dispatch(getChallenges())
          await dispatch(getChallengesById(challengeId)) // Refresh the single challenge data
          handleClose() // Close the modal
        }else{
          toast.error("Failed to edit challenge.")
        }
        
      } catch (error) {
        toast.error(error.message || "Failed to update challenge");
      }
    },
  });

  useEffect(() => {
    if (singleChallenge) {
      const {
        title,
        startDate,
        endDate,
        targetValue,
        targetDescription,
        reward,
        targetUnit,
        rewardCoinsInterval,
        rewardCoinsPerInterval,
        description,
        banner,
        badge,
        qualifyingSports
      } = singleChallenge;
  
      setValues({
        title: title || "",
        startDate: startDate || new Date().toISOString().split("T")[0],
        endDate: endDate || new Date().toISOString().split("T")[0],
        targetValue: targetValue || "",
        targetDescription: targetDescription || "",
        reward: reward || "",
        targetUnit: targetUnit || "",
        rewardCoinsInterval: rewardCoinsInterval || "",
        rewardCoinsPerInterval: rewardCoinsPerInterval || "",
        description: description || "",
        bannerFile: banner || null,
        badgeFile: badge || null,
        banner: banner || null,
        badge: badge || null,
        qualifyingSports: qualifyingSports?.map(sport => sport.id) || [],
      });
    }
  }, [singleChallenge, setValues]);
  


  return (
    <StyledAppModal open={open} handleClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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

          <div>
            <p className="label">Start Date</p>
            <DatePicker
              value={values.startDate ? new Date(values.startDate) : null}
              onChange={(date) => {
                if (date) {
                  setValues((prevValues) => ({
                    ...prevValues,
                    startDate: date.toISOString().split("T")[0],
                  }));
                }
              }}
            />
          </div>
          <div>
            <p className="label">End Date</p>
            <DatePicker
              value={values.endDate ? new Date(values.endDate) : null}
              onChange={(date) => {
                if (date) {
                  setValues((prevValues) => ({
                    ...prevValues,
                    endDate: date.toISOString().split("T")[0],
                  }));
                }
              }}
            /> 
          </div>

          <div>
            <p className="label">Target Value</p>
            <TextField
              fullWidth
              size="small"
              placeholder="Target Value"
              name="targetValue"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.targetValue}
              helperText={touched.targetValue && errors.targetValue}
              error={Boolean(touched.targetValue && errors.targetValue)}
            />
          </div>
          <div>
            <p className="label">Target Description</p>
            <TextField
              rows={2}
              fullWidth
              multiline
              size="small"
              name="targetDescription"
              placeholder="Target Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.targetDescription}
              helperText={touched.targetDescription && errors.targetDescription}
              error={Boolean(
                touched.targetDescription && errors.targetDescription
              )}
            //  dangerouslySetInnerHTML={{ __html: values?.description }}

              />            
          </div>
          <div>
            <p className="label">Reward</p>
            <TextField
              fullWidth
              size="small"
              name="reward"
              placeholder="reward"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.reward}
              helperText={touched.reward && errors.reward}
              error={Boolean(touched.reward && errors.reward)}
            />
          </div>
          <div>
            <p className="label">Target Unit</p>
            <TextField
              fullWidth
              size="small"
              name="targetUnit"
              placeholder="Target Unit"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.targetUnit}
              helperText={touched.targetUnit && errors.targetUnit}
              error={Boolean(touched.targetUnit && errors.targetUnit)}
            />
          </div>
          <div>
            <p className="label">Reward Coins Interval</p>
            <TextField
              fullWidth
              size="small"
              name="rewardCoinsInterval"
              placeholder="Reward Coins Interval"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.rewardCoinsInterval}
              helperText={
                touched.rewardCoinsInterval && errors.rewardCoinsInterval
              }
              error={Boolean(
                touched.rewardCoinsInterval && errors.rewardCoinsInterval
              )}
            />
          </div>
          <div>
            <p className="label">Reward Coins Per Interval</p>
            <TextField
              fullWidth
              size="small"
              name="rewardCoinsPerInterval"
              placeholder="Reward Coins Per Interval"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.rewardCoinsPerInterval}
              helperText={
                touched.rewardCoinsPerInterval && errors.rewardCoinsPerInterval
              }
              error={Boolean(
                touched.rewardCoinsPerInterval && errors.rewardCoinsPerInterval
              )}
            />
          </div>

          <div>
            <p className="label">Qualifying Sports</p>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
                Select Sports
              </Button>
              {values.qualifyingSports.map((sportId) => {
                const sport = sports.find((s) => s.id === sportId);
                return sport ? (
                  <Chip
                    key={sport.id}
                    label={sport.name}
                    onDelete={() => {
                      const newSelected = values.qualifyingSports.filter(
                        (id) => id !== sport.id
                      );
                      setFieldValue("qualifyingSports", newSelected);
                    }}
                    avatar={
                      <Avatar src={sport.icon} alt={sport.name}>
                        {sport.name[0]}
                      </Avatar>
                    }
                  />
                ) : null;
              })}
            </Box>
            <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {sports.map((sport) => (
                <MenuItem
                  key={sport.id}
                  onClick={() => {
                    const selected = values.qualifyingSports.includes(sport.id)
                      ? values.qualifyingSports.filter((id) => id !== sport.id)
                      : [...values.qualifyingSports, sport.id];
                      setFieldValue("qualifyingSports", selected);
                    console.log("selected", selected);
                  }}
                >
                  <Checkbox
                    checked={values.qualifyingSports.includes(sport.id)}
                  />
                  <img
                    src={sport.icon}
                    alt={sport.name}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                  {sport.name}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <div>
            <p className="label">Description</p>
            <TextField
              rows={2}
              fullWidth
              multiline
              size="small"
              name="description"
              placeholder="Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              helperText={touched.description && errors.description}
              error={Boolean(touched.description && errors.description)}
              // dangerouslySetInnerHTML={{ __html: values?.description }}
            />
          </div>

          <div>
            <p className="label">Banner</p>
            <Box display="flex" alignItems="center" gap={2} justifyContent='space-around'>
              <Dropzone
                onDrop={(files) => setFieldValue("bannerFile", files[0])}
              />
              {(values.bannerFile) && (
                <Avatar
                  variant="rounded"
                  src={
                    values.bannerFile
                  }
                  alt="banner"
                  sx={{ width: 100, height: 100 }}
                />
              )}
            </Box>
            {touched.bannerFile && errors.bannerFile && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.bannerFile}
              </p>
            )}
          </div>
          <div>
            <p className="label">Badge</p>
            <Box display="flex" alignItems="center" gap={2} justifyContent='space-around'>
              <Dropzone
                onDrop={(files) => setFieldValue("badgeFile", files[0])}
              />
              {(values.badgeFile) && (
                <Avatar
                  variant="rounded"
                  src={
                    values.badgeFile
                  }
                  alt="Badge file"
                  sx={{ width: 100, height: 100 }}
                />
              )}
            </Box>
            {touched.badgeFile && errors.badgeFile && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.badgeFile}
              </p>
            )}
          </div>
          <div className="btn-group">
            <Button type="button" onClick={async () => {
              console.log("🟡 Submit button clicked");

              const validationErrors = await validationSchema.validate(values, {
                abortEarly: false,
              }).catch((err) => err);

              if (validationErrors?.inner) {
                const formatted = validationErrors.inner.reduce((acc, error) => {
                  acc[error.path] = error.message;
                  return acc;
                }, {});
                console.log("🚨 Formik validation failed:", formatted);
                
                // Show each validation error as a toast
                Object.values(formatted).forEach(errorMessage => {
                  toast.error(errorMessage);
                });
              } else {
                console.log("✅ No validation errors. Proceeding...");
                handleSubmit();
              }
            }} variant="contained" fullWidth>
              Save Changes
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
