import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCouponsById,
  updateCoupons,
  getCoupons,
} from "@/store/apps/coupons";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FlexBox } from "@/components/flexbox";

const categoryOptions = [
  { value: "events", label: "Events" },
  { value: "challenges", label: "Challenges" },
];

export default function EditCouponsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleCoupons } = useSelector((state) => state.coupons);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

  const initialValues = {
    code: "",
    description: "",
    discountType: "",
    discountValue: "",
    maxDiscountValue: "",
    minimumPurchase: "",
    applicableCategories: [],
    startDate: "",
    endDate: "",
    usageLimit: "",
    usageLimitPerUser: "",
    usageCount: "",
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
    description: Yup.string().required("Description is required"),
    discountType: Yup.string().required("Discount type is required"),
    discountValue: Yup.number().required("Discount value is required"),
    maxDiscountValue: Yup.number().required("Max discount value is required"),
    minimumPurchase: Yup.number().required("Minimum purchase is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    usageLimit: Yup.number().required("Usage limit is required"),
    usageLimitPerUser: Yup.number().required("Usage/user is required"),
    usageCount: Yup.number().required("Usage count is required"),
    applicableCategories: Yup.array().of(Yup.string()),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          discountValue: Number(values.discountValue),
          maxDiscountValue: Number(values.maxDiscountValue),
          minimumPurchase: Number(values.minimumPurchase),
          usageLimit: Number(values.usageLimit),
          usageLimitPerUser: Number(values.usageLimitPerUser),
          usageCount: Number(values.usageCount),
        };

        const res = await dispatch(
          updateCoupons({ editId: id, changedData: payload })
        );

        if (res?.payload?.status === 200) {
          toast.success("Coupon updated successfully");
          dispatch(getCoupons());
          navigate("/coupons-grid");
        } else {
          toast.error("Update failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getCouponsById(id));
    }
  }, [id]);

  useEffect(() => {
    if (singleCoupons?.id === id) {
      setValues({
        ...initialValues,
        ...singleCoupons,
        discountValue: singleCoupons.discountValue ?? "",
        maxDiscountValue: singleCoupons.maxDiscountValue ?? "",
        minimumPurchase: singleCoupons.minimumPurchase ?? "",
        usageLimit: singleCoupons.usageLimit ?? "",
        usageLimitPerUser: singleCoupons.usageLimitPerUser ?? "",
        usageCount: singleCoupons.usageCount ?? "",
        applicableCategories: singleCoupons.applicableCategories || [],
      });
    }
  }, [singleCoupons]);

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Coupon
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Text Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Coupon Code"
                name="code"
                fullWidth
                value={values.code}
                onChange={handleChange}
                error={touched.code && Boolean(errors.code)}
                helperText={touched.code && errors.code}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Discount Type"
                name="discountType"
                fullWidth
                value={values.discountType}
                onChange={handleChange}
                error={touched.discountType && Boolean(errors.discountType)}
                helperText={touched.discountType && errors.discountType}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="flat">Flat</MenuItem>
              </TextField>
            </Grid>

            {[
              { name: "discountValue", label: "Discount Value" },
              {
                name: "maxDiscountValue",
                label: "Max Discount Value",
              },
              { name: "minimumPurchase", label: "Minimum Purchase" },
              { name: "usageLimit", label: "Usage Limit" },
              {
                name: "usageLimitPerUser",
                label: "Usage Limit Per User",
              },
              { name: "usageCount", label: "Usage Count" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  fullWidth
                  type="number"
                  value={values[field.name]}
                  onChange={handleChange}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  helperText={touched[field.name] && errors[field.name]}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Start Date"
                name="startDate"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={values.startDate}
                onChange={handleChange}
                error={touched.startDate && Boolean(errors.startDate)}
                helperText={touched.startDate && errors.startDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="End Date"
                name="endDate"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={values.endDate}
                onChange={handleChange}
                error={touched.endDate && Boolean(errors.endDate)}
                helperText={touched.endDate && errors.endDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
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

              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {values.applicableCategories.map((cat) => (
                  <Chip key={cat} label={cat} />
                ))}
              </Box>

              {touched.applicableCategories && errors.applicableCategories && (
                <Typography color="error" variant="body2" mt={1}>
                  {errors.applicableCategories}
                </Typography>
              )}
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/coupons-grid")}
                >
                  Cancel
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
