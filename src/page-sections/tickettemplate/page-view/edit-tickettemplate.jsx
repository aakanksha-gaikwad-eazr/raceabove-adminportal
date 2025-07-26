import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import { FlexBox } from "@/components/flexbox";
import GroupSenior from "@/icons/GroupSenior";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Paragraph, Small } from "@/components/typography";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTicketType,
  getSingleTicketType,
} from "@/store/apps/tickettype";
import { 
  getTicketTemplate,
  getSingleTicketTemplate  // Add this import
} from "@/store/apps/tickettemplate";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,           // Add this import
  FormHelperText     // Add this import
} from "@mui/material";

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
  console.log("is id", id);
  
  // Store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleTicketTemplate } = useSelector((state) => state.tickettemplate);
  const { tickettypes } = useSelector((state) => state.tickettype);

  const initialValues = {
    description: "",
    maxAge: 0,
    minAge: 0,
    price: 0,
    quantity: 0,
    ticketTypeId: "",
  };

  ///details-ticket-template/id
  // Create a state to track if data is loaded
  const [dataLoaded, setDataLoaded] = useState(false);

  const validationSchema = Yup.object().shape({
    maxAge: Yup.number().required("maxAge is required"),
    minAge: Yup.number().required("minAge is required"),
    price: Yup.number().required("price is required"),
    quantity: Yup.number().required("quantity is required"),
    description: Yup.string().required("Description is required"),
    ticketTypeId: Yup.string().required("Ticket type is required"),
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
      console.log("values", values);
      try {
        const payload = {
          maxAge: values.maxAge,
          minAge: values.minAge,
          price: values.price,
          quantity: values.quantity,
          description: values.description,
          ticketTypeId: values.ticketTypeId,
        };

        if (res?.payload?.status === 200) {
          toast.success("ticket template updated successfully");
          dispatch(getTicketTemplate());
          navigate("/ticket-template-list-2");
        } else {
          toast.error("Update failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    },
  });

  // Debug logs after formik initialization
  console.log("=== RENDER STATE ===");
  console.log("Form values:", values);
  console.log("Single ticket template:", singleTicketTemplate);
  console.log("Ticket types:", tickettypes);

  // Fetch ticket template data and ticket types on component mount
  useEffect(() => {
    if (id) {
      // Load ticket types FIRST, then template data
      dispatch(getTicketType()).then(() => {
        dispatch(getSingleTicketTemplate(id));
      });
    }
  }, [dispatch, id]);

  // Update form values when ticket template data is loaded
  useEffect(() => {
    console.log("=== DEBUGGING FORM VALUES ===");
    console.log("singleTicketTemplate:", singleTicketTemplate);
    console.log("tickettypes:", tickettypes);
    console.log("Current form values:", values);
    console.log("ID from params:", id);
    
    if (singleTicketTemplate?.id == id && tickettypes && tickettypes.length > 0) {
      console.log("Template ticketTypeId:", singleTicketTemplate.ticketTypeId);
      console.log("Available ticket type IDs:", tickettypes.map(t => ({ id: t.id, title: t.title })));
      
      // Find matching ticket type
      const matchingType = tickettypes.find(type => 
        type.id == singleTicketTemplate.ticketTypeId || 
        type.id.toString() == singleTicketTemplate.ticketTypeId?.toString()
      );
      console.log("Matching ticket type found:", matchingType);
      
      const templateData = {
        description: singleTicketTemplate.description || "",
        maxAge: Number(singleTicketTemplate.maxAge) || 0,
        minAge: Number(singleTicketTemplate.minAge) || 0,
        price: Number(singleTicketTemplate.price) || 0,
        quantity: Number(singleTicketTemplate.quantity) || 0,
        ticketTypeId: matchingType ? matchingType.id.toString() : "",
      };
      
      console.log("Setting form values to:", templateData);
      setValues(templateData);
    }
  }, [singleTicketTemplate, tickettypes, id, setValues]);

  useEffect(() => {
    if (singleTicketTemplate?.id === id && tickettypes && tickettypes.length > 0) {
      const ticketTypeId = singleTicketTemplate.ticketTypeId?.toString() || "";
      const ticketTypeExists = tickettypes.some(type => type.id.toString() === ticketTypeId);
      
      console.log("Ticket type exists:", ticketTypeExists, "ID:", ticketTypeId);
      
      if (ticketTypeExists && values.ticketTypeId !== ticketTypeId) {
        setFieldValue('ticketTypeId', ticketTypeId);
      }
    }
  }, [singleTicketTemplate, tickettypes, id, setFieldValue, values.ticketTypeId]);

  return (
    <div className="pt-2 pb-4">
      <FlexBox mb={2} alignItems="center">
        <IconWrapper>
          <GroupSenior sx={{ color: "primary.main" }} />
        </IconWrapper>
        <Paragraph fontSize={18} fontWeight="bold">
          Edit Ticket Template
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
                    name="description"
                    label="Ticket Template Description"
                    value={values.description}
                    onChange={handleChange}
                    helperText={touched.description && errors.description}
                    error={Boolean(touched.description && errors.description)}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    name="maxAge"
                    label="Max Age"
                    value={values.maxAge}
                    onChange={handleChange}
                    helperText={touched.maxAge && errors.maxAge}
                    error={Boolean(touched.maxAge && errors.maxAge)}
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
                    label="Min Age"
                    value={values.minAge}
                    onChange={handleChange}
                    helperText={touched.minAge && errors.minAge}
                    error={Boolean(touched.minAge && errors.minAge)}
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
                    <InputLabel id="ticket-type-select-label">
                      Ticket Type
                    </InputLabel>
                    <Select
                      labelId="ticket-type-select-label"
                      name="ticketTypeId"
                      value={values.ticketTypeId || "n/a"}
                      label="Ticket Type"
                      onChange={handleChange}
                    >
                      {tickettypes?.map((ticketType) => (
                        <MenuItem key={ticketType.id} value={ticketType.id.toString()}>
                          {ticketType.title} (ID: {ticketType.id})
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.ticketTypeId && errors.ticketTypeId && (
                      <FormHelperText>{errors.ticketTypeId}</FormHelperText>
                    )}
                  </FormControl>
                  {/* Debug info */}
                  {/* <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Current selected: {values.ticketTypeId || 'None'} | 
                    Available: {tickettypes?.length || 0} types
                  </div> */}
                </Grid>
                {/* Remove the duplicate ticketTypeId TextField */}
                <Grid size={12}>
                  <Button type="submit" variant="contained">
                    Edit Ticket Template
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