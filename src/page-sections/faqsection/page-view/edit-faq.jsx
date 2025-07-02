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
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getFaq } from '@/store/apps/faq';
import { useNavigate, useParams } from 'react-router-dom';
import { updateFaq } from '@/store/apps/faq';
import { getSingleFaq } from '@/store/apps/faq';
import { useEffect } from 'react';
export default function EditFaqPageView() {
  const DATA = [
    'Review the existing question and answer carefully before making changes.',
    'Ensure the updated content remains clear and helpful for users.',
    'Avoid removing useful context unless it\'s outdated or incorrect.',
    'Use simple language and avoid technical jargon where possible.',
    'Update the FAQ if features have changed or common issues have evolved.'
  ];
  
  
  const validationSchema = Yup.object({
    question: Yup.string().required('Question is Required!'),
    answer: Yup.string().required('Answer is Required!'),
  });
  const initialValues = {
    question: '',
    answer: '',
  };
  const { id } = useParams();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {singleFaq} =useSelector(state=>state.faq)

  useEffect(() => {
    if (id) {
      dispatch(getSingleFaq(id));
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
        const payload = {question: values.question,
          answer: values.answer}
        const response = await dispatch(
          updateFaq({
           data:payload, id
          })
        );
        console.log("res", response)
        if(response?.payload?.status === 200){
          toast.success('FAQ update:');
          dispatch(getFaq())
          navigate("/faq/section")
        }
        resetForm();
      } catch (error) {
        console.error('Failed to update FAQ:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (singleFaq && singleFaq.question && singleFaq.answer) {
      setValues({
        question: singleFaq.question,
        answer: singleFaq.answer,
      });
    }
  }, [singleFaq, setValues]);

  return <Box py={3}>
      <Card sx={{
      p: 3,
      maxWidth: 900,
      margin: 'auto'
    }}>
        <H6 fontSize={18}>Edit FAQ</H6>

        <Paragraph color="text.secondary" mb={3}>
        Ensure the updated question and answer include all key details to help users understand the issue or solution.        </Paragraph>

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
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>;
}