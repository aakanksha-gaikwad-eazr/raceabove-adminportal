import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; // MUI ICON COMPONENT

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // CUSTOM COMPONENTS

import FlexBox from '@/components/flexbox/FlexBox';
import { H6, Paragraph } from '@/components/typography';
import { createFaq } from '@/store/apps/faq';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getFaq } from '@/store/apps/faq';
import { useNavigate } from 'react-router-dom';
export default function CreateFaqPageView() {
  const DATA = [
    'Write clear and concise questions and answers based on common user issues.',
    'Avoid technical jargon; keep the language beginner-friendly.',
    'Regularly update FAQs as new features or user queries arise.'
  ];
  
  const validationSchema = Yup.object({
    question: Yup.string().required('Question is Required!'),
    answer: Yup.string().required('Answer is Required!'),
  });
  const initialValues = {
    question: '',
    answer: '',
  };
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await dispatch(
          createFaq({
            question: values.question,
            answer: values.answer,
          })
        );
        if(response?.payload?.status === 201){
          toast.success('FAQ Created:');
          dispatch(getFaq())
          navigate("/faq/section")
        }
        resetForm();
      } catch (error) {
        console.error('Failed to create FAQ:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return <Box py={3}>
      <Card sx={{
      p: 3,
      maxWidth: 900,
      margin: 'auto'
    }}>
        <H6 fontSize={18}>Create FAQ</H6>

        <Paragraph color="text.secondary" mb={3}>
          Please include as many details as possible about your question or problem.
        </Paragraph>

        <Box component="ul" pl={2} mb={4}>
          {DATA.map(item => <Box key={item} component="li" fontSize={14} pb={0.5}>
              {item}
            </Box>)}
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{
            xs: 12
          }}>
              <TextField fullWidth name="question" onBlur={handleBlur} onChange={handleChange} value={values.question} placeholder="Question*" helperText={touched.question && errors.question} error={Boolean(touched.question && errors.question)} />
            </Grid>

            <Grid size={{
            xs: 12
          }}>
              <TextField fullWidth name="answer" onBlur={handleBlur} onChange={handleChange} value={values.answer} placeholder="Answer*" helperText={touched.answer && errors.answer} error={Boolean(touched.answer && errors.answer)} />
            </Grid>

            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit">Submit</Button>
                <Button variant="outlined" color="secondary" onClick={()=>navigate('/faq/section')}>
                  Cancel
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>;
}