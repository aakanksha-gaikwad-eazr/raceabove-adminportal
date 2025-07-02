import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT
import { useFormik } from "formik";
import * as Yup from "yup"; // CUSTOM COMPONENTS
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { createFaq } from "@/store/apps/faq";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getFaq } from "@/store/apps/faq";
import { useNavigate } from "react-router-dom";
import { createTnc } from "@/store/apps/tnc";
import { getTnc } from "@/store/apps/tnc";
export default function CreateTncPageView() {
  const DATA = [
    "Ensure the terms are clear, accurate, and legally compliant.",
    "Avoid vague language or overly technical/legal jargon.",
    "Only include terms that are enforceable and relevant to the platform.",
    "Review and update the T&C regularly to reflect policy or feature changes.",
    "Be transparent—users should easily understand their rights and responsibilities.",
  ];

  const validationSchema = Yup.object({
    content: Yup.string().required("content is Required!"),
  });
  const initialValues = {
    content: "",
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await dispatch(
          createTnc({
            content: values.content,
          })
        );
        if (response?.payload?.status === 201) {
          toast.success("TNC Created:");
          dispatch(getTnc());
          navigate("/tnc/tncpage");
        }
        resetForm();
      } catch (error) {
        console.error("Failed to create TNC:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Box py={3}>
      <Card
        sx={{
          p: 3,
          maxWidth: 900,
          margin: "auto",
        }}
      >
        <H6 fontSize={18}>Create TNC</H6>

        <Paragraph color="text.secondary" mb={3}>
          Please include all necessary details to clearly define the terms,
          conditions, and user responsibilities.{" "}
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
                fullWidth
                multiline
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
                <Button variant="outlined" color="secondary" onClick={()=>navigate("/tnc/tncpage")}>
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
