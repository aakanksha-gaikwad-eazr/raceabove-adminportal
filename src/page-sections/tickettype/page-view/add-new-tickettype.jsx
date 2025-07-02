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
import { Navigate, useNavigate } from "react-router-dom";
import {
  Checkbox,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { createCoupon } from "../../../store/apps/coupons";
import { createTicketType } from "@/store/apps/tickettype";

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

export default function AddNewCouponsPageView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store actual file

  //store
  const dispatch = useDispatch();
  const tickettype = useSelector((state) => state.user);
  // console.log("users", users)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload!");
      return;
    }

    setSelectedFile(file); // Store actual file
    setSelectedImage(URL.createObjectURL(file));
    // const imageUrl = URL.createObjectURL(file);
    // setSelectedImage(imageUrl);
    toast.success("Image uploaded successfully!");
  };

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
    handleSubmit,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const navigate = useNavigate();

  async function handleFormSubmit(values) {
    try {
      const response = await dispatch(createTicketType(values)).unwrap();
      console.log("res Ticket type", response);
      if (response?.status === 201) {
        toast.success("Ticket type created successfully!");
        navigate("/ticket-type-grid");
      } else {
        toast.error(response?.message || "Failed to create Ticket type");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  }

  const categoryOptions = [
    { value: "events", label: "Events" },
    { value: "challenges", label: "Challenges" },
  ];
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
         
          <Grid size={{ xs: 12 }}>
            <FlexBox alignItems="center">
              <IconWrapper>
                <GroupSenior sx={{ color: "primary.main" }} />
              </IconWrapper>
              <Paragraph fontSize={18} fontWeight="bold">
                Add Ticket Type
              </Paragraph>
            </FlexBox>
          </Grid>

          <Grid
            size={{
              md: 8,
              xs: 12,
            }}
            sx={{ margin: "auto" }}
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
                      name="name"
                      label="Ticket Type Name"
                      value={values.name}
                      onChange={handleChange}
                      helperText={touched.name && errors.name}
                      error={Boolean(touched.name && errors.name)}
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
                      name="description"
                      label="Ticket Type Description"
                      value={values.description}
                      onChange={handleChange}
                      helperText={
                        touched.description && errors.description
                      }
                      error={Boolean(
                        touched.description && errors.description
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button type="submit" variant="contained">
                      Create New Ticket Type
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
