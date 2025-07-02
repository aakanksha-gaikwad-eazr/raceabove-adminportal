import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // MUI
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"; // CUSTOM COMPONENTS

import { H6 } from "@/components/typography";
import DropZone from "@/components/dropzone";
import FlexBox from "@/components/flexbox/FlexBox";
import IconWrapper from "@/components/icon-wrapper";

import ShoppingBasket from "@/icons/ShoppingBasket";
import { getAddOnsCategory } from "@/store/apps/addonscategory";
import toast from "react-hot-toast";
import { createAddOns } from "@/store/apps/addons";

export default function CreateAddOnsPageView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {addOnsCategory} = useSelector(state=>state.addonscategory)
  console.log("addons", addOnsCategory)
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(()=>{
   dispatch( getAddOnsCategory())
  },[])
  useEffect(()=>{
    setCategories(addOnsCategory)
  },[])

  const handleChangeDescription = (value) => {
    console.log(value);
  };


  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    categoryId: Yup.string().required("Category is required!"),
    price: Yup.number().required("Price is required!"),
    description: Yup.string().required("Description is required!"),
    isActive: Yup.string().required("Status is required!"),
    imageFile: Yup.mixed().required("photo is required"),
  });
  const initialValues = {
    name: "",
    categoryId: "",
    price: "",
    description: "",
    isActive: true,
    imageFile: "",
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    setFieldValue,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const handleDropFile = useCallback((acceptedFiles) => {
    const files = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(files);
    setSelectedFile(acceptedFiles[0]);
    setFieldValue("imageFile", acceptedFiles[0]);
  }, [setFieldValue]);

  async function handleFormSubmit(formData) {
    console.log("form", formData);
    // Create FormData object
    const formDataToSend = new FormData();

    // Append all form values
    Object.keys(formData).forEach((key) => {
      console.log("formData", formData);
      formDataToSend.append(key, formData[key]);
    });

    try {
      console.log("formdata to send", formDataToSend);
      const response = await dispatch(createAddOns(formDataToSend)).unwrap();

      if (response?.status === 201) {
        toast.success("Addons created successfully!");
        navigate("/add-ons/add-ons-list");
      } else {
        throw new Error(response.message || "Failed to create Addons");
      }
    } catch (error) {
      console.error("❌ Error in form submission:", error);
      toast.error(error?.message);
    }
  }
  return (
    <div className="pt-2 pb-4">
      <form onSubmit={handleSubmit}>
        <Card className="p-3">
          <Grid container spacing={3} alignItems="start">
            <Grid size={12}>
              <FlexBox gap={0.5} alignItems="center">
                <IconWrapper>
                  <ShoppingBasket color="primary" />
                </IconWrapper>

                <H6 fontSize={16}>Create New Products</H6>
              </FlexBox>
            </Grid>

            <Grid
              container
              spacing={2}
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <Grid size={12}>
                <H6 fontSize={16}>Main Parameters</H6>
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Name"
                  fullWidth
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Category"
                  slotProps={{
                    select: {
                      native: true,
                      IconComponent: KeyboardArrowDown,
                    },
                  }}
                  name="categoryId"
                  value={values.categoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.categoryId &&
                    Boolean(errors.categoryId)
                  }
                  helperText={
                    touched.categoryId && errors.categoryId}
                >
                  {/* <option value=""></option> */}
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField 
                  label="Price" 
                  fullWidth 
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>

              <Grid size={12}>
                <TextField 
                  label="Description" 
                  fullWidth 
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>
              <Grid size={12}>
                <Card
                  sx={{
                    my: 3,
                  }}
                >
                  <DropZone onDrop={handleDropFile} />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <FlexBox flexWrap="wrap" gap={2} my={2}>
          <Button type="submit" variant="contained">
            Create New Product
          </Button>

          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </FlexBox>
      </form>
    </div>
  );
}
