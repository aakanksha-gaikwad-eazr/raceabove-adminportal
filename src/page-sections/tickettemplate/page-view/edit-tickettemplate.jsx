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
import {
  getTicketType,
  updateTicketTypes,
  getSingleTicketType,
} from "@/store/apps/tickettype";
import { getSingleTicketTemplate } from "@/store/apps/tickettemplate";
import { getTicketTemplate } from "@/store/apps/tickettemplate";
import { MenuItem, Select } from "@mui/material";
import { updateTicketTemplate } from "@/store/apps/tickettemplate";

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

export default function EditTicketTemplatePageView() {
  const { id } = useParams();
  //store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleTicketTemplate } = useSelector((state) => state.tickettemplate);
  // console.log("singleTicketTemplate", singleTicketTemplate);
  const { tickettypes } = useSelector((state) => state.tickettype);
  // console.log("tickettypes", tickettypes);

  const initialValues = {
    name: "",
    description: "",
    minAge: "",
    maxAge: "",
    price: "",
    quantity: "",
    ticketTypeId: "",
  };
  useEffect(() => {
    dispatch(getTicketTemplate());
    dispatch(getTicketType());
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    minAge: Yup.number().required("Min age is required").min(0),
    maxAge: Yup.number().required("Max age is required").min(Yup.ref("minAge")),
    price: Yup.number().required("Price is required").min(0),
    quantity: Yup.number().required("Quantity is required").min(1),
    ticketTypeId: Yup.string().required("ticket Type Id is required"),
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
    // validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,})

    async function handleFormSubmit(values) {
      console.log("values", values)
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("minAge", values.minAge);
      formData.append("maxAge", values.maxAge);
      formData.append("price", values.price);
      formData.append("quantity", values.quantity);
      formData.append("ticketTypeId", values.ticketTypeId);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }      try {
        const response = await dispatch(
          updateTicketTemplate({ id, data: formData })
        ).unwrap();
        console.log("resp::::", response)
        if (response?.status === 201) {
          toast.success("Ticket template updated successfully!");
          navigate("/ticket-template-grid");
        } else {
          toast.error(response?.message || "Failed to update Ticket template");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error(error?.message || "Something went wrong");
      }
    }

  useEffect(() => {
    dispatch(getSingleTicketType());
    if (id) dispatch(getSingleTicketTemplate(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleTicketTemplate?.id === id) {
      setValues((prev) => ({
        ...prev,
        ...singleTicketTemplate,
        ticketTypeId: singleTicketTemplate.ticketTypeId || "",
      }));
    }
  }, [singleTicketTemplate, id, setValues]);

  const selectedType = tickettypes?.find(
    (type) => type.id === values.ticketTypeId
  );

  // console.log("Form value ticketTypeId:", values.ticketTypeId, typeof values.ticketTypeId);
  // console.log("Tickettypes:", tickettypes.map(t => [t.id, typeof t.id]));

  if (!singleTicketTemplate || !tickettypes || tickettypes.length === 0) {
    return <div>Loading...</div>;
  }

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
                Edit Ticket Template
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
                  <Grid sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Ticket Type Description"
                      value={values.description}
                      onChange={handleChange}
                      helperText={touched.description && errors.description}
                      error={Boolean(touched.description && errors.description)}
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
                    <Select
                      fullWidth
                      name="ticketTypeId"
                      labelId="Select Ticket Type"
                      value={String(values.ticketTypeId)}
                      onChange={handleChange}
                      helperText={touched.ticketTypeId && errors.ticketTypeId}
                      error={Boolean(
                        touched.ticketTypeId && errors.ticketTypeId
                      )}
                      sx={{ minWidth: 400 }}
                    >
                      {tickettypes?.map((type) => (
                        <MenuItem
                          key={type?.id}
                          value={String(type?.id)}
                          style={{ width: "100px" }}
                        >
                          {type?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid size={12} >
                     <FlexBox alignItems="center" gap={2}>
                    <Button type="submit" variant="contained">
                      Edit Ticket Template
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={()=>navigate("/ticket-template-grid")}>
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
