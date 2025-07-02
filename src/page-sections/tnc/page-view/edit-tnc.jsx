import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useFormik } from "formik";
import * as Yup from "yup"; // CUSTOM COMPONENTS

import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { createFaq } from "@/store/apps/faq";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getFaq } from "@/store/apps/faq";
import { useNavigate, useParams } from "react-router-dom";
import { updateFaq } from "@/store/apps/faq";
import { getSingleFaq } from "@/store/apps/faq";
import { useEffect } from "react";
import { getSingleTnc } from "@/store/apps/tnc";
import { updateTnc } from "@/store/apps/tnc";
import { getTnc } from "@/store/apps/tnc";
export default function EditTncPageView() {
  const DATA = [
    "Review the existing terms carefully before making any changes.",
    "Ensure the updated content remains legally accurate and easy to understand.",
    "Avoid removing important clauses unless they are outdated or no longer applicable.",
    "Use clear and straightforward language to ensure users can understand the terms.",
    "Update the T&C to reflect current platform policies, features, or legal requirements.",
  ];
  const validationSchema = Yup.object({
    content: Yup.string().required("Content is Required!"),
  });
  const initialValues = {
    content: "",
  };
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleTnc } = useSelector((state) => state.tnc);

  useEffect(() => {
    if (id) {
      dispatch(getSingleTnc(id));
    }
  }, [dispatch, id]);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { content: values.content };
        const response = await dispatch(
          updateTnc({
            data: payload,
            id,
          })
        );
        console.log("res", response);
        if (response?.payload?.status === 200) {
          toast.success("TNC update:");
          dispatch(getTnc());
          navigate("/tnc/tncpage");
        }
        resetForm();
      } catch (error) {
        console.error("Failed to update TNC:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (singleTnc && singleTnc.content) {
      setValues({
        content: singleTnc.content,
      });
    }
  }, [singleTnc, setValues]);
  console.log("Loaded singleTnc:", singleTnc);


  return (
    <Box py={3}>
      <Card
        sx={{
          p: 3,
          maxWidth: 900,
          margin: "auto",
        }}
      >
        <H6 fontSize={18}>Edit TNC</H6>

        <Paragraph color="text.secondary" mb={3}>
          Ensure the updated terms clearly outline all key details to help users
          understand their rights, responsibilities.{" "}
        </Paragraph>

        <Box component="ul" pl={2} mb={4}>
          {DATA.map((item) => (
            <Box key={item} component="li" fontSize={14} pb={0.5}>
              {item}
            </Box>
          ))}
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
              }}
            >
              <TextField
                multiline
                fullWidth
                name="content"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.content}
                placeholder="Content*"
                helperText={touched.content && errors.content}
                error={Boolean(touched.content && errors.content)}
              />
            </Grid>

            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit">Submit</Button>
                <Button variant="outlined" color="secondary">
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
