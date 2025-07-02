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
  updateTarget,
  getTargetById,
  getTargets,
} from "../../../store/apps/target";

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
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    banner: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Target Name is required"),
    banner: Yup.mixed()
      .required("Banner File is required")
      .test("fileType", "Only images are allowed", (value) =>
        value
          ? ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
          : false
      ),
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

      for (let pair of formData.entries()) {
        console.log("------", pair[0], pair[1]);
      }

      // formData.append("name", values.name);

      // if (values.banner) {
      //   formData.append("file", values.banner);
      // }else{
      //   console.error("No banner file selected");
      // }

      try {
        const response = await dispatch(
          updateTarget({ id: editTargetId, data: formData })
        );
        console.log("res target", response);
        if (response?.payload?.status === 200) {
          toast.success(
            response?.payload?.message || "target created successfully!"
          );
          dispatch(getTargets());
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
      if (!editTargetId) {
        console.error("editTargetId is missing, update API will not be called.");
        return;
      }else {
        dispatch(getTargetById(editTargetId));
      }
      dispatch(getTargets());
    }, [dispatch]);


  useEffect(() => {
    if (singleTargets) {
      setValues({
        ...initialValues,
        ...singleTargets,
        banner: singleTargets.banner || null
      });
    }
  }, [singleTargets]);

  return (
    <StyledAppModal open={open} handleClose={handleClose}>
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
                  setValues("banner", files[0]);
                }}
              />
              {values.banner && (
                <Avatar
                  variant="rounded"
                  src={
                    typeof values.banner === "string"
                      ? values.banner
                      : URL.createObjectURL(values.banner)
                  }
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
              Edit
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
