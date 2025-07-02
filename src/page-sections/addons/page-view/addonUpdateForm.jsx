import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import styled from "@mui/material/styles/styled";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Modal from "@/components/modal";
import Dropzone from "@/components/dropzone";
import { Box } from "@mui/material";
import toast from "react-hot-toast";
import { updateAddOns, getAddOns } from "@/store/apps/addons";
import { getAddOnsCategory } from "@/store/apps/addonscategory";
import { FlexBetween, FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import { Paragraph } from "@/components/typography";

const StyledAppModal = styled(Modal)(({ theme }) => ({
  "& .add-btn": {
    border: `1px solid ${theme.palette.divider}`,
  },
  "& .label": {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
    display: "block",
  },
  "& .btn-group": {
    gap: "1rem",
    display: "flex",
    paddingTop: "1.5rem",
  },
}));

export default function AddOnsUpdateForm({ open, handleClose, product }) {
  const dispatch = useDispatch();
  const { addOnsCategory } = useSelector((state) => state.addonscategory);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(product?.image || null);

  useEffect(() => {
    dispatch(getAddOnsCategory());
  }, [dispatch]);

  useEffect(() => {
    if (product?.image) {
      setPreviewUrl(product.image);
    }
  }, [product]);

  const initialValues = {
    name: product?.name || "",
    categoryId: product?.category?.id || "",
    price: product?.price || "",
    description: product?.description || "",
    isActive: product?.isActive || true,
    imageFile: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    categoryId: Yup.string().required("Category is required!"),
    price: Yup.number().required("Price is required!"),
    description: Yup.string().required("Description is required!"),
    isActive: Yup.boolean(),
  });

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(":::::values ", values);
      try {
        const formData = new FormData();
        
        // Append all form values as multipart form data
        Object.keys(values).forEach((key) => {
          if (key === "imageFile" && values[key]) {
            formData.append("imageFile", values[key]);
          } else if (key !== "imageFile") {
            formData.append(key, values[key]);
          }
        });
        // Create the payload with the correct structure
        const updatePayload = {
          id: product.id,
          data: formData
        };

        console.log("Update payload:", updatePayload);
        console.log("Product ID:", product.id);
        console.log("FormData type:", formData instanceof FormData);

        const response = await dispatch(updateAddOns(updatePayload)).unwrap();
        console.log("response here", response);

        if (response?.status === 200) {
          handleClose();
          toast.success("Add-on updated successfully");
          await dispatch(getAddOns());
          resetForm();
        } else {
          toast.error("Failed to update add-on");
        }
      } catch (error) {
        console.error("Error updating add-on:", error);
        toast.error(error?.message || "Failed to update add-on");
      }
    },
  });

  const handleDropFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFieldValue("imageFile", file);
    }
  };

  return (
    <StyledAppModal open={open} handleClose={handleClose}>
       {/* === Heading === */}
        <FlexBetween mb={2}>
          <FlexBox alignItems="center" gap={1}>
            <IconWrapper>
              <GroupSenior sx={{ color: "primary.main" }} />
            </IconWrapper>
            <Paragraph fontSize={20} fontWeight="bold">
              Edit Product
            </Paragraph>
          </FlexBox>
        </FlexBetween>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <p className="label">Name</p>
            <TextField
              fullWidth
              name="name"
              size="small"
              placeholder="Add-on Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              helperText={touched.name && errors.name}
              error={Boolean(touched.name && errors.name)}
            />
          </div>

          <div>
            <p className="label">Category</p>
            <Select
              fullWidth
              size="small"
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.categoryId && errors.categoryId)}
            >
              {addOnsCategory?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {touched.categoryId && errors.categoryId && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.categoryId}
              </p>
            )}
          </div>

          <div>
            <p className="label">Price</p>
            <TextField
              fullWidth
              name="price"
              size="small"
              type="number"
              placeholder="Price"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.price}
              helperText={touched.price && errors.price}
              error={Boolean(touched.price && errors.price)}
            />
          </div>

          <div>
            <p className="label">Description</p>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              size="small"
              placeholder="Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              helperText={touched.description && errors.description}
              error={Boolean(touched.description && errors.description)}
            />
          </div>

          <div>
            <p className="label">Image</p>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              {previewUrl && (
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                  }}
                >
                  <Dropzone onDrop={handleDropFile} />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 6,
                    maxWidth: "100%",
                    maxHeight: "220px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
            {touched.imageFile && errors.imageFile && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.imageFile}
              </p>
            )}
          </div>

          <div className="btn-group">
            <Button type="submit" variant="contained" fullWidth>
              Update
            </Button>
            <Button variant="outlined" fullWidth onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Stack>
      </form>
    </StyledAppModal>
  );
}
