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
import Dropzone from "@/components/dropzone"; // STYLED COMPONENT
import { getSports } from "../../../store/apps/sports";
import { Box, Chip, ListItemText } from "@mui/material";
import toast from "react-hot-toast";
import {
  getCoupons,
  getCouponsById,
  updateCoupons,
} from "../../../store/apps/coupons";

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

// ====================================================== ========
export default function AddonFormEdit({ open, handleClose, couponId }) {
  const [date, setDate] = useState(new Date());
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const { singleCoupons } = useSelector((state) => state.coupons);

  const categoryOptions = [
    { value: "events", label: "Events" },
    { value: "challenges", label: "Challenges" },
  ];

  // Clear form when modal is closed
  useEffect(() => {
    if (!open) {
      setValues(initialValues);
    }
  }, [open]);

  useEffect(() => {
    if (couponId && open) {
      dispatch(getCouponsById(couponId));
    }
  }, [couponId, dispatch, open]);

  const initialValues = {
    name: '',
    description: '',
    isActive: true,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description type is required"),
  });

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
    resetForm
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          description: values.description,
        };



        if (response?.payload?.data) {
          toast.success("Coupon updated successfully");
          dispatch(getAddOnsCategory());
          handleClose();
          resetForm();
        } else {
          toast.error(response?.payload?.message || "Failed to update coupon");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error(error?.message || "An error occurred while updating the coupon");
      }
    },
  });

  useEffect(() => {
    if (singleCoupons && open) {
      // Handle null values by converting them to empty strings or appropriate defaults
      const sanitizedValues = {
        ...initialValues,
        name: singleCoupons.name || '',
        description: singleCoupons.description || '',
      };

      setValues(sanitizedValues);
    }
  }, [singleCoupons, open]);
  return (
    <StyledAppModal open={open} handleClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <p className="label">Product Categories Name</p>
            <TextField
              fullWidth
              name="code"
              size="small"
              placeholder="Coupon code"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.code}
              helperText={touched.code && errors.code}
              error={Boolean(touched.code && errors.code)}
            />
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
            />
          </div>

          <div className="btn-group">
            <Button type="submit" variant="contained" fullWidth>
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
