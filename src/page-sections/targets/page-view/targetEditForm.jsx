import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createChallenges,
  getChallenges,
  getChallengesById,
} from "../../../store/apps/challenges";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import styled from "@mui/material/styles/styled";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Modal from "@/components/modal";
import Dropzone from "@/components/dropzone";
import { getSports } from "../../../store/apps/sports";
import { Box, Chip } from "@mui/material";
import toast from "react-hot-toast";
import {
  createTarget,
  editTarget,
  getTargetById,
  getTargets,
} from "../../../store/apps/target";
import { FlexBetween, FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import { Paragraph } from "@/components/typography";

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
export default function TargetEditForm({
  open,
  handleClose,
  handleEditTarget,
  editTargetId,
  setEditTargetId,
  singleTargets,
}) {

  console.log("editTargetId", editTargetId)
  const dispatch = useDispatch();
  const objectUrlRef = useRef(null);

  const initialValues = {
    name: "",
    banner: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Target Name is required"),
    banner: Yup.mixed()
      .required("Banner File is required")
      .test("fileType", "Only images are allowed", (value) => {
        if (!value) return false;
        if (typeof value === "string") return true; // Allow existing URLs
        return ["image/png", "image/jpeg", "image/jpg"].includes(value.type);
      }),
  });

  const [anchorEl, setAnchorEl] = useState(null);

  // const {singleTargets} = useSelector((state)=>state.target)

  const {
    values, 
    
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.banner) {
        formData.append("file", values.banner);
      }

      try {
        const response = await dispatch(
          editTarget({ id: editTargetId, data: formData })
        );
        if (response?.payload?.status === 200) {
          toast.success(
            response?.payload?.message || "target created successfully!"
          );
          dispatch(getTargets());
          // resetForm();
        } else {
          toast.error("Failed to create target.");
        }
      } catch (error) {
        toast.error("An error occurred while creating the target.");
      }
      handleClose();
    },
  });

    useEffect(() => {
      if (editTargetId) {
        dispatch(getTargetById(editTargetId));
      }
    }, [dispatch, editTargetId]);

  useEffect(() => {
    if (singleTargets && Object.keys(singleTargets).length > 0) {
      console.log("Setting form values with:", singleTargets);
      setValues({
        name: singleTargets.name || "",
        banner: singleTargets.banner || null
      });
    }
  }, [singleTargets, setValues]);

  // Cleanup object URL when component unmounts or when banner changes
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const getImageUrl = (banner) => {
    if (!banner) return null;
    if (typeof banner === "string") return banner;
    
    // Cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    
    // Create new object URL
    objectUrlRef.current = URL.createObjectURL(banner);
    return objectUrlRef.current;
  };

  return (
    <StyledAppModal open={open} handleClose={handleClose}>
       {/* === Heading === */}
  <FlexBetween mb={2}>
    <FlexBox alignItems="center" gap={1}>
      <IconWrapper>
        <GroupSenior sx={{ color: "primary.main" }} />
      </IconWrapper>
      <Paragraph fontSize={20} fontWeight="bold">
        Edit Target
      </Paragraph>
    </FlexBox>
  </FlexBetween>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <p className="label">Target Title</p>
            <TextField
              fullWidth
              name="name"
              size="small"
              placeholder="Target Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              helperText={touched.name && errors.name}
              error={Boolean(touched.name && errors.name)}
            />
          </div>

          <div>
            <p className="label">Banner File</p>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              justifyContent="space-around"
            >
              <Dropzone
                onDrop={(files) => {
                  console.log("Selected File:", files[0]);
                  setFieldValue("banner", files[0]);
                }}
              />
              {values.banner && (
                <Avatar
                  variant="rounded"
                  src={getImageUrl(values.banner)}
                  alt="Banner"
                  sx={{ width: 100, height: 100 }}
                />
              )}
            </Box>
            {touched.banner && errors.banner && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.banner}</p>
            )}
          </div>

          <div className="btn-group">
            <Button type="submit" variant="contained" fullWidth>
              Save
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
