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
export default function TicketTemplateFormEdit({ open, handleClose, couponId }) {
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
    code: '',
    description: '',
    discountType: '',
    discountValue: 0,
    maxDiscountValue: 0,
    minimumPurchase: 0,
    applicableCategories: [],
    startDate: '',
    endDate: '',
    usageLimit: 0,
    usageLimitPerUser: 0,
    usageCount: 0,
  };
  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
    discountType: Yup.string().required("Discount type is required"),
    discountValue: Yup.number().required("Discount value is required"),
    maxDiscountValue: Yup.number().required(
      "maxDiscountValue value is required"
    ),
    minimumPurchase: Yup.number().required("minimumPurchase value is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    usageLimit: Yup.number().required("Usage limit is required"),
    usageLimitPerUser: Yup.number().required("Usage/user is required"),
    usageCount: Yup.number().required("Usage Count is required"),
    applicableCategories: Yup.array().of(Yup.string()),
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
        // Convert FormData to a regular object
        const payload = {
          code: values.code,
          description: values.description,
          discountType: values.discountType,
          discountValue: Number(values.discountValue),
          maxDiscountValue: Number(values.maxDiscountValue),
          minimumPurchase: Number(values.minimumPurchase),
          startDate: values.startDate,
          endDate: values.endDate,
          usageLimit: Number(values.usageLimit),
          usageLimitPerUser: Number(values.usageLimitPerUser),
          usageCount: Number(values.usageCount),
          applicableCategories: values.applicableCategories
        };

        // const response = await dispatch(updateCoupons({ 
        //   editId: couponId, 
        //   changedData: payload 
        // }));

        if (response?.payload?.data) {
          toast.success("Coupon updated successfully");
          dispatch(getCoupons());
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
        code: singleCoupons.code || '',
        description: singleCoupons.description || '',
        discountType: singleCoupons.discountType || '',
        discountValue: singleCoupons.discountValue || 0,
        maxDiscountValue: singleCoupons.maxDiscountValue || 0,
        minimumPurchase: singleCoupons.minimumPurchase || 0,
        startDate: singleCoupons.startDate || '',
        endDate: singleCoupons.endDate || '',
        usageLimit: singleCoupons.usageLimit || 0,
        usageLimitPerUser: singleCoupons.usageLimitPerUser || 0,
        usageCount: singleCoupons.usageCount || 0,
        applicableCategories: Array.isArray(singleCoupons.applicableCategories)
          ? singleCoupons.applicableCategories
          : [],
      };

      setValues(sanitizedValues);
    }
  }, [singleCoupons, open]);
  return (
    <StyledAppModal open={open} handleClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <p className="label">Coupon Code</p>
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

          <div>
            <p className="label">Start Date</p>
            <TextField
              fullWidth
              name="startDate"
              // label="startDate"
              value={values.startDate}
              onChange={handleChange}
              helperText={touched.startDate && errors.startDate}
              error={Boolean(touched.startDate && errors.startDate)}
              type="date"
            />
          </div>

          <div>
            <p className="label">End Date</p>
            <TextField
              fullWidth
              name="EndDate"
              // label="startDate"
              value={values.endDate}
              onChange={handleChange}
              helperText={touched.endDate && errors.endDate}
              error={Boolean(touched.endDate && errors.endDate)}
              type="date"
            />
          </div>

          <div>
            <p className="label">Minimum Purchase</p>
            <TextField
              fullWidth
              size="small"
              placeholder="Minimum Purchase"
              name="minimumPurchase"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.minimumPurchase}
              helperText={touched.minimumPurchase && errors.minimumPurchase}
              error={Boolean(touched.minimumPurchase && errors.minimumPurchase)}
              type="number"
            />
          </div>

          <div>
            <p className="label">Usage Limit Per User</p>
            <TextField
              fullWidth
              size="small"
              name="usageLimitPerUser"
              placeholder="usageLimitPerUser"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.usageLimitPerUser}
              helperText={touched.usageLimitPerUser && errors.usageLimitPerUser}
              error={Boolean(
                touched.usageLimitPerUser && errors.usageLimitPerUser
              )}
            />
          </div>

          <div>
            <p className="label">Usage Limit</p>
            <TextField
              fullWidth
              size="small"
              name="usageLimit"
              placeholder="Usage Limit"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.usageLimit}
              helperText={touched.usageLimit && errors.usageLimit}
              error={Boolean(touched.usageLimit && errors.usageLimit)}
            />
          </div>
          <div>
            <p className="label">Usage Count</p>
            <TextField
              fullWidth
              size="small"
              name="usageCount"
              placeholder="usageCount"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.usageCount}
              helperText={touched.usageCount && errors.usageCount}
              error={Boolean(touched.usageCount && errors.usageCount)}
              type="number"
            />
          </div>

          <div>
            <p className="label">Discount Value</p>
            <TextField
              fullWidth
              size="small"
              name="discountValue"
              placeholder="Discount Value"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.discountValue}
              helperText={touched.discountValue && errors.discountValue}
              error={Boolean(touched.discountValue && errors.discountValue)}
              type="number"
            />
          </div>
          <div>
            <p className="label">Discount Type</p>
            <TextField
              fullWidth
              size="small"
              name="discountType"
              placeholder="Discount Type"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.discountType}
              helperText={touched.discountType && errors.discountType}
              error={Boolean(touched.discountType && errors.discountType)}
            />
          </div>

          <div>
            <p className="label">Max Discount Value</p>
            <TextField
              fullWidth
              size="small"
              name="maxDiscountValue"
              placeholder="Max Discount Value"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.maxDiscountValue}
              helperText={touched.maxDiscountValue && errors.maxDiscountValue}
              error={Boolean(
                touched.maxDiscountValue && errors.maxDiscountValue
              )}
              type="number"
            />
          </div>

          <div>
            <p className="label">Applicable Categories</p>
            <Button
              variant="outlined"
              fullWidth
              onClick={(e) => setCategoryAnchorEl(e.currentTarget)}
            >
              {values.applicableCategories.length > 0
                ? `Selected (${values.applicableCategories.length})`
                : "Select Categories"}
            </Button>

            <Menu
              anchorEl={categoryAnchorEl}
              open={Boolean(categoryAnchorEl)}
              onClose={() => setCategoryAnchorEl(null)}
              PaperProps={{ style: { maxHeight: 300, width: 250 } }}
            >
              {categoryOptions.map((cat) => (
                <MenuItem
                  key={cat.value}
                  onClick={() => {
                    const selected = values.applicableCategories.includes(
                      cat.value
                    )
                      ? values.applicableCategories.filter(
                          (v) => v !== cat.value
                        )
                      : [...values.applicableCategories, cat.value];

                    setFieldValue("applicableCategories", selected);
                  }}
                >
                  <Checkbox
                    checked={values.applicableCategories.includes(cat.value)}
                  />
                  <ListItemText primary={cat.label} />
                </MenuItem>
              ))}
            </Menu>

            {touched.applicableCategories && errors.applicableCategories && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: 4 }}>
                {errors.applicableCategories}
              </p>
            )}
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              {values.applicableCategories.map((cat) => (
                <Chip key={cat} label={cat} />
              ))}
            </Box>
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
