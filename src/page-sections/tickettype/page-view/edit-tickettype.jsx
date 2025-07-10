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
import { getTicketType,getSingleTicketType } from "@/store/apps/tickettype";

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

export default function EditTicketTypePageView() {
  const { id } = useParams();
  //store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {singleTicketType} = useSelector((state) => state.tickettype);




  const initialValues = {
    title: "",
    description: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
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
      console.log("values", values)
      try {
        const payload = {
    title: values.title,
    description: values.description,
  };
   
        if (res?.payload?.status === 200) {
          toast.success("ticket type updated successfully");
          dispatch(getTicketType());
          navigate("/ticket-type-list-2");
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
    if (id) dispatch(getSingleTicketType(id));
  }, [dispatch, id]);
  

  useEffect(() => {
    if (singleTicketType?.id === id) {
      setValues((prev) => ({
        ...prev,
        ...singleTicketType,
      }));
    }
  }, [singleTicketType, id, setValues]);
  

  return (
    <div className="pt-2 pb-4">
       <FlexBox mb={2} alignItems="center">
              <IconWrapper>
                <GroupSenior sx={{ color: "primary.main" }} />
              </IconWrapper>
              <Paragraph fontSize={18} fontWeight="bold">
                Edit Ticket Type
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
                      name="title"
                      label="Ticket Type Name"
                      value={values.title}
                      onChange={handleChange}
                      helperText={touched.title && errors.title}
                      error={Boolean(touched.title && errors.title)}
                    />
                  </Grid>
                  <Grid
                    size={{
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
                      Edit Ticket Type
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
