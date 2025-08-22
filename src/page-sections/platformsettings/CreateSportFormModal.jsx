// components/CreateSportFormModal.js
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { createSports, getSports } from "../../store/apps/sports";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';

export default function CreateSportFormModal({ open, handleClose }) {
    const [iconFile, setIconFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const dispatch = useDispatch();

    const initialValues = {
        name: "",
        iconFile: null,
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Sport name is required"),
        iconFile: Yup.mixed().required("Icon is required"),
    })

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
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            if (iconFile) {
                formData.append("iconFile", iconFile);
            }

            try {
                const response = await dispatch(createSports(formData));
                
                if (response?.payload?.data) {
                    toast.success("Sport created successfully");
                    dispatch(getSports());
                    resetForm();
                    setIconFile(null);
                    setPreviewUrl(null);
                    handleClose();
                } else {
                    toast.error(response?.payload?.message || "Failed to create sport");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error occurred while creating sport");
            }
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconFile(file);
            setFieldValue("iconFile", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Sport</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Sport Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            fullWidth
                        />
                        <Box display="flex" alignItems="center" gap={2}>
                            {previewUrl && (
                                <Avatar
                                    src={previewUrl}
                                    sx={{ width: 64, height: 64, bgcolor: "grey.100" }}
                                />
                            )}
                            <Box>
                                <input
                                    accept="image/*"
                                    id="icon-upload"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="icon-upload">
                                    <Button variant="outlined" component="span">
                                        Upload Icon
                                    </Button>
                                </label>
                                {touched.iconFile && errors.iconFile && (
                                    <Box color="error.main" mt={1} fontSize={12}>
                                        {errors.iconFile}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
  