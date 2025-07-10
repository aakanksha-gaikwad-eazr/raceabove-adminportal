import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT
import { FlexBox } from "@/components/flexbox";
import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM COMPONENTS
import { Paragraph, Small } from "@/components/typography"; // CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FlexBetween } from "@/components/flexbox";
import { 
  getAddOnsCategory, 
} from "@/store/apps/addonscategory";

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

export default function EditAddonPageView() {
  //store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id", id);
  
  const { singleAddOnsCategory, loading } = useSelector((state) => state.addonscategory);
  // console.log("singleAddOnsCategory", singleAddOnsCategory);

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = { ...values };

        if (res?.payload?.status === 200) {
          toast.success("Add-on category updated successfully");
          dispatch(getAddOnsCategory());
          navigate("/addoncategory-list-2");
        } else {
          toast.error("Update failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    },
  });



  // Update form values when data is loaded
  useEffect(() => {
    if (singleAddOnsCategory && singleAddOnsCategory.id === id) {
      setValues({
        name: singleAddOnsCategory.name || "",
        description: singleAddOnsCategory.description || "",
      });
    }
  }, [singleAddOnsCategory, id, setValues]);

  // Show loading state
  if (loading) {
    return (
      <div className="pt-2 pb-4">
        <Card className="p-3">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Paragraph>Loading...</Paragraph>
          </div>
        </Card>
      </div>
    );
  }

  // Show error if no data found
  if (!loading && !singleAddOnsCategory && id) {
    return (
      <div className="pt-2 pb-4">
        <Card className="p-3">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Paragraph color="error">Add-on category not found</Paragraph>
            <Button 
              variant="contained" 
              onClick={() => navigate("/addoncategory-list-2")}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <FlexBetween mb={2}>
        <FlexBox alignItems="center" gap={1}>
          <IconWrapper>
            <GroupSenior sx={{ color: "primary.main" }} />
          </IconWrapper>
          <Paragraph fontSize={18} fontWeight="bold">
            Edit Product Category
          </Paragraph>
        </FlexBox>
        <Button 
          variant="outlined" 
          onClick={() => navigate("/addoncategory-list-2")}
        >
          Back to List
        </Button>
      </FlexBetween>

      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
          }}
          sx={{ margin: "auto" }}
        >
          <Card className="p-3">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="name"
                    label="Add-on Category name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.name && errors.name}
                    error={Boolean(touched.name && errors.name)}
                    placeholder="Enter category name"
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    label="Add-on Category description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.description && errors.description}
                    error={Boolean(touched.description && errors.description)}
                    placeholder="Enter category description"
                  />
                </Grid>
                
                <Grid size={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Product Category'}
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