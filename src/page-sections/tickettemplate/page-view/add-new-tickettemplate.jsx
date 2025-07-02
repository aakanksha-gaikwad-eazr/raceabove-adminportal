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
import { Checkbox, ListItemText, Menu, MenuItem, Select } from "@mui/material";
import {
  createTicketTemplate,
  getTicketTemplate,
} from "@/store/apps/tickettemplate";
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
  const { ticketTemplate } = useSelector((state) => state.tickettemplate);
  console.log("ticketTemplate", ticketTemplate);
  const { tickettypes } = useSelector((state) => state.tickettype);
  console.log("tickettypes", tickettypes);

  useEffect(() => {
    dispatch(getTicketTemplate());
    dispatch(getTicketType());
  }, []);

  const initialValues = {
    name: "",
    description: "",
    minAge: "",
    maxAge: "",
    price: "",
    quantity: "",
    ticketTypeId: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Template name is required"),
    description: Yup.string().required("Template description is required"),
    minAge: Yup.number().required("Min age is required").min(0),
    maxAge: Yup.number().required("Max age is required").min(Yup.ref("minAge")),
    price: Yup.number().required("Price is required").min(0),
    quantity: Yup.number().required("Quantity is required").min(1),
    ticketTypeId: Yup.string().required("ticket Type Id is required"),
  });

  const { values, errors, handleChange, handleSubmit, touched, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: handleFormSubmit,
    });

  const navigate = useNavigate();

  async function handleFormSubmit(values) {
    const payload = {
      name: values.name,
      description: values.description,
      minAge: values.minAge,
      maxAge: values.maxAge,
      price: values.price,
      quantity: values.quantity,
      ticketTypeId: values.ticketTypeId,
    };

    try {
      const response = await dispatch(createTicketTemplate(payload)).unwrap();
      if (response?.status === 201) {
        toast.success("Ticket template created successfully!");
        navigate("/ticket-template-grid");
      } else {
        toast.error(response?.message || "Failed to create Ticket template");
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
                Add Ticket Template
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
                  <Grid container spacing={3}>
                    <Grid sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Ticket Template Name"
                        value={values.name}
                        onChange={handleChange}
                        helperText={touched.name && errors.name}
                        error={Boolean(touched.name && errors.name)}
                      />
                    </Grid>
                    <Grid sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="description"
                        label="Template Description"
                        value={values.description}
                        onChange={handleChange}
                        helperText={touched.description && errors.description}
                        error={Boolean(
                          touched.description && errors.description
                        )}
                      />
                    </Grid>
                    <Grid sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="minAge"
                        label="Minimum Age"
                        type="number"
                        value={values.minAge}
                        onChange={handleChange}
                        helperText={touched.minAge && errors.minAge}
                        error={Boolean(touched.minAge && errors.minAge)}
                      />
                    </Grid>
                    <Grid sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="maxAge"
                        label="Maximum Age"
                        type="number"
                        value={values.maxAge}
                        onChange={handleChange}
                        helperText={touched.maxAge && errors.maxAge}
                        error={Boolean(touched.maxAge && errors.maxAge)}
                      />
                    </Grid>
                    <Grid sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="price"
                        label="Price"
                        type="number"
                        value={values.price}
                        onChange={handleChange}
                        helperText={touched.price && errors.price}
                        error={Boolean(touched.price && errors.price)}
                      />
                    </Grid>
                    <Grid sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="quantity"
                        label="Quantity"
                        type="number"
                        value={values.quantity}
                        onChange={handleChange}
                        helperText={touched.quantity && errors.quantity}
                        error={Boolean(touched.quantity && errors.quantity)}
                      />
                    </Grid>
                    <Grid sm={6} xs={12}>
                      <Grid sm={6} xs={12}>
                        <Select
                          fullWidth
                          name="ticketTypeId"
                          labelId="Select Ticket Type"
                          value={values.ticketTypeId}
                          onChange={handleChange}
                          helperText={
                            touched.ticketTypeId && errors.ticketTypeId
                          }
                          error={Boolean(
                            touched.ticketTypeId && errors.ticketTypeId
                          )}
                          sx={{ minWidth: 400 }}
                        >
                          {tickettypes?.map((type) => (
                            <MenuItem
                              key={type?.id}
                              value={type?.id}
                              style={{ width: "100px" }}
                            >
                              {type?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid size={12}>
                    <FlexBox alignItems="center" gap={2}>
                      <Button type="submit" variant="contained">
                        Create New Ticket Type
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/ticket-template-grid")}
                      >
                        Cancel
                      </Button>
                    </FlexBox>
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
