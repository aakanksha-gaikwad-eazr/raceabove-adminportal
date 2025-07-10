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
import { Checkbox, ListItemText, Menu, MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { createCoupon } from "../../../store/apps/coupons";
import { getTicketType } from "@/store/apps/tickettype";

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

export default function AddNewTicketTemplatePageView() {
  //store
  const dispatch = useDispatch();
  const { tickettypes } = useSelector((state) => state.tickettype);
  console.log("tickettypes", tickettypes);

  const initialValues = {
    description: "",
    maxAge: 0,
    minAge: 0,
    price: 0,
    quantity: 0,
    ticketTypeId: "",
  };

  const validationSchema = Yup.object().shape({
    maxAge: Yup.number().required("maxAge is required"),
    minAge: Yup.number().required("minAge is required"),
    price: Yup.number().required("price is required"),
    quantity: Yup.number().required("quantity is required"),
    description: Yup.string().required("Description is required"),
    ticketTypeId: Yup.string().required("Ticket type is required"), // Add validation for ticketTypeId
  });

  const { values, errors, handleChange, handleSubmit, touched, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: handleFormSubmit,
    });

  const navigate = useNavigate();

  // Fetch ticket types on component mount
  useEffect(() => {
    dispatch(getTicketType());
  }, [dispatch]);

  async function handleFormSubmit(values) {
    console.log("values", values);
    try {
      console.log("res Ticket template", response);
      if (response?.status === 201) {
        toast.success("Ticket template created successfully!");
        navigate("/ticket-template-list-2");
      } else {
        toast.error(response?.message || "Failed to create Ticket template");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  }

  return (
    <div className="pt-2 pb-4">
      <FlexBox mb={2} alignItems="center">
        <IconWrapper>
          <GroupSenior sx={{ color: "primary.main" }} />
        </IconWrapper>
        <Paragraph fontSize={18} fontWeight="bold">
          Add Ticket Template
        </Paragraph>
      </FlexBox>
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
                    multiline
                    name="description"
                    label="Ticket Template Description"
                    value={values.description}
                    onChange={handleChange}
                    helperText={touched.description && errors.description}
                    error={Boolean(touched.description && errors.description)}
                  />
                </Grid>
                
                {/* Ticket Type Select */}
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <FormControl 
                    fullWidth 
                    error={Boolean(touched.ticketTypeId && errors.ticketTypeId)}
                  >
                    <InputLabel id="ticket-type-select-label">Ticket Type</InputLabel>
                    <Select
                      labelId="ticket-type-select-label"
                      name="ticketTypeId"
                      value={values.ticketTypeId}
                      label="Ticket Type"
                      onChange={handleChange}
                    >
                      {tickettypes?.map((ticketType) => (
                        <MenuItem key={ticketType.id} value={ticketType.id}>
                          {ticketType.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.ticketTypeId && errors.ticketTypeId && (
                      <FormHelperText>{errors.ticketTypeId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="maxAge"
                    label="Max age"
                    value={values.maxAge}
                    onChange={handleChange}
                    helperText={touched.maxAge && errors.maxAge}
                    error={Boolean(touched.maxAge && errors.maxAge)}
                    type="number"
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="minAge"
                    label="Min age"
                    value={values.minAge}
                    onChange={handleChange}
                    helperText={touched.minAge && errors.minAge}
                    error={Boolean(touched.minAge && errors.minAge)}
                      type="number"
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="quantity"
                    label="Quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    helperText={touched.quantity && errors.quantity}
                    error={Boolean(touched.quantity && errors.quantity)}
                      type="number"
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="price"
                    label="Price"
                    value={values.price}
                    onChange={handleChange}
                    helperText={touched.price && errors.price}
                    error={Boolean(touched.price && errors.price)}
                      type="number"
                  />
                </Grid>
                <Grid size={12}>
                  <Button type="submit" variant="contained">
                    Create New Ticket Template
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